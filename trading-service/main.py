from __future__ import annotations

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ibkr_client import (
    HOST,
    MODE,
    PORT,
    IbkrServiceError,
    disconnect_ib,
    get_account_response,
    get_open_orders_response,
    get_positions_response,
    get_status_payload,
)

load_dotenv()

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]


@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    disconnect_ib()


app = FastAPI(
    title="JollyBuoy Trade IBKR Service",
    description="Read-only IBKR Paper Trading bridge for the local React terminal.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "jollybuoy-trade-ibkr"}


@app.get("/api/ibkr/status")
async def ibkr_status() -> dict:
    try:
        return get_status_payload()
    except IbkrServiceError as exc:
        return {
            "connected": False,
            "account": None,
            "mode": MODE,
            "host": HOST,
            "port": PORT,
            "error": exc.message,
            "errorCode": exc.code,
        }


@app.get("/api/ibkr/account")
async def ibkr_account() -> dict:
    try:
        return get_account_response()
    except IbkrServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@app.get("/api/ibkr/positions")
async def ibkr_positions() -> list:
    try:
        return get_positions_response()
    except IbkrServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@app.get("/api/ibkr/open-orders")
async def ibkr_open_orders() -> list:
    try:
        return get_open_orders_response()
    except IbkrServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
