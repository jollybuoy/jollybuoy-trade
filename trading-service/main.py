from __future__ import annotations

import asyncio
import logging
import os
from contextlib import asynccontextmanager
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ibkr_client import (
    IbkrServiceError,
    cancel_all_open_orders,
    configure_connection_mode,
    disconnect_ib,
    disconnect_session,
    get_account_response,
    get_executions_response,
    get_heartbeat_payload,
    get_open_orders_response,
    get_positions_response,
    get_status_payload,
    place_market_order,
)
from ibkr_connection_manager import HEARTBEAT_INTERVAL_SECONDS, get_manager
from strategies.mega7_harvest_strategy import (
    STRATEGY_CYCLE_INTERVAL_SECONDS,
    auto_start_if_paper,
    emergency_stop_strategy,
    get_strategy_status,
    pause_strategy,
    run_strategy_cycle,
    should_run_scheduled_cycle,
    start_strategy,
)

load_dotenv()

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]


class ConnectRequest(BaseModel):
    mode: Literal["paper", "live"]


class PlaceOrderRequest(BaseModel):
    symbol: str
    action: Literal["BUY", "SELL"]
    quantity: float = Field(gt=0)


async def heartbeat_loop() -> None:
    manager = get_manager()
    while True:
        await asyncio.sleep(HEARTBEAT_INTERVAL_SECONDS)
        try:
            await asyncio.to_thread(manager.heartbeat_check)
        except Exception:  # noqa: BLE001
            logging.getLogger("ibkr.connection").exception("Background heartbeat failed")


async def strategy_scheduler_loop() -> None:
    logger = logging.getLogger("strategy.mega7_harvest")
    while True:
        await asyncio.sleep(STRATEGY_CYCLE_INTERVAL_SECONDS)
        try:
            if should_run_scheduled_cycle():
                logger.info("Scheduled strategy cycle starting.")
                await asyncio.to_thread(run_strategy_cycle)
        except Exception:  # noqa: BLE001
            logger.exception("Scheduled strategy cycle failed")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    manager = get_manager()
    await asyncio.to_thread(manager.initialize)
    await asyncio.to_thread(manager.startup_connect)
    await asyncio.to_thread(auto_start_if_paper)
    heartbeat_task = asyncio.create_task(heartbeat_loop())
    strategy_task = asyncio.create_task(strategy_scheduler_loop())

    async def kickoff_strategy_cycle() -> None:
        await asyncio.sleep(3)
        if should_run_scheduled_cycle():
            logging.getLogger("strategy.mega7_harvest").info("Kickoff strategy cycle starting.")
            await asyncio.to_thread(run_strategy_cycle)

    kickoff_task = asyncio.create_task(kickoff_strategy_cycle())
    yield
    heartbeat_task.cancel()
    strategy_task.cancel()
    kickoff_task.cancel()
    try:
        await heartbeat_task
    except asyncio.CancelledError:
        pass
    try:
        await strategy_task
    except asyncio.CancelledError:
        pass
    try:
        await kickoff_task
    except asyncio.CancelledError:
        pass
    await asyncio.to_thread(disconnect_ib)


app = FastAPI(
    title="JollyBuoy Trade IBKR Service",
    description="IBKR bridge for the local React terminal (read + controlled order flow).",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "jollybuoy-trade-ibkr"}


@app.get("/api/ibkr/status")
async def ibkr_status() -> dict:
    try:
        return await asyncio.to_thread(get_status_payload)
    except IbkrServiceError as exc:
        manager = get_manager()
        return {
            "connected": False,
            "clientId": manager.client_id,
            "account": None,
            "lastHeartbeat": None,
            "mode": manager.mode,
            "host": manager.host,
            "port": manager.port,
            "error": exc.message,
            "errorCode": exc.code,
        }


@app.get("/api/ibkr/heartbeat")
async def ibkr_heartbeat() -> dict:
    return await asyncio.to_thread(get_heartbeat_payload)


@app.post("/api/ibkr/connect")
async def ibkr_connect(body: ConnectRequest) -> dict:
    try:
        return await asyncio.to_thread(configure_connection_mode, body.mode)
    except IbkrServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@app.post("/api/ibkr/disconnect")
async def ibkr_disconnect() -> dict:
    return await asyncio.to_thread(disconnect_session)


@app.get("/api/ibkr/account")
async def ibkr_account() -> dict:
    try:
        return await asyncio.to_thread(get_account_response)
    except IbkrServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@app.get("/api/ibkr/positions")
async def ibkr_positions() -> list:
    try:
        return await asyncio.to_thread(get_positions_response)
    except IbkrServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@app.get("/api/ibkr/open-orders")
async def ibkr_open_orders() -> list:
    try:
        return await asyncio.to_thread(get_open_orders_response)
    except IbkrServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@app.get("/api/ibkr/executions")
async def ibkr_executions() -> list:
    try:
        return await asyncio.to_thread(get_executions_response)
    except IbkrServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@app.post("/api/ibkr/cancel-all-orders")
async def ibkr_cancel_all_orders() -> dict:
    try:
        return await asyncio.to_thread(cancel_all_open_orders)
    except IbkrServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@app.post("/api/ibkr/orders")
async def ibkr_place_order(body: PlaceOrderRequest) -> dict:
    try:
        return await asyncio.to_thread(
            place_market_order,
            body.symbol,
            body.action,
            body.quantity,
        )
    except IbkrServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@app.get("/api/strategy/mega7/status")
async def mega7_strategy_status() -> dict:
    return await asyncio.to_thread(get_strategy_status)


@app.post("/api/strategy/mega7/run-once")
async def mega7_strategy_run_once() -> dict:
    try:
        return await asyncio.to_thread(run_strategy_cycle)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/strategy/mega7/start")
async def mega7_strategy_start() -> dict:
    return await asyncio.to_thread(start_strategy)


@app.post("/api/strategy/mega7/pause")
async def mega7_strategy_pause() -> dict:
    return await asyncio.to_thread(pause_strategy)


@app.post("/api/strategy/mega7/emergency-stop")
async def mega7_strategy_emergency_stop() -> dict:
    return await asyncio.to_thread(emergency_stop_strategy)
