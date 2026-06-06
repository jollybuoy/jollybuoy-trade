from __future__ import annotations

import os
import threading
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Callable, TypeVar

from ib_insync import IB

HOST = os.getenv("IBKR_HOST", "127.0.0.1")
PORT = int(os.getenv("IBKR_PORT", "4002"))
CLIENT_ID = int(os.getenv("IBKR_CLIENT_ID", "10"))
MODE = os.getenv("IBKR_MODE", "paper")
CONNECT_TIMEOUT = int(os.getenv("IBKR_CONNECT_TIMEOUT", "10"))

LOGIN_EXPIRED_CODES = {504, 1100, 1101, 1102, 10197}
READONLY_ERROR_CODES = {321, 103, 104}

T = TypeVar("T")

_executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="ibkr-client")
_ib_lock = threading.Lock()


class IbkrServiceError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 503) -> None:
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class IbkrClient:
    def __init__(self) -> None:
        self._ib = IB()
        self._session_error: str | None = None
        self._error_handler_registered = False

    def _ensure_error_handler(self) -> None:
        if self._error_handler_registered:
            return

        def on_error(_req_id: int, error_code: int, error_string: str, _contract: Any) -> None:
            if error_code in LOGIN_EXPIRED_CODES:
                self._session_error = f"{error_code}: {error_string}"
            if error_code in READONLY_ERROR_CODES and "read-only" in error_string.lower():
                self._session_error = f"{error_code}: {error_string}"

        self._ib.errorEvent += on_error
        self._error_handler_registered = True

    def connect(self) -> IB:
        self._session_error = None
        self._ensure_error_handler()

        if self._ib.isConnected():
            return self._ib

        try:
            self._ib.connect(HOST, PORT, clientId=CLIENT_ID, timeout=CONNECT_TIMEOUT)
        except Exception as exc:  # noqa: BLE001
            raise map_connect_error(exc) from exc

        if self._session_error:
            if "read-only" in self._session_error.lower():
                raise IbkrServiceError("read_only_mode", self._session_error, 503)
            raise IbkrServiceError("not_logged_in", self._session_error, 503)

        return self._ib

    def disconnect(self) -> None:
        if self._ib.isConnected():
            self._ib.disconnect()

    def run(self, operation: Callable[[IB], T]) -> T:
        with _ib_lock:
            ib = self.connect()
            return operation(ib)


_client = IbkrClient()


def run_ibkr_operation(operation: Callable[[IB], T]) -> T:
    def task() -> T:
        import asyncio

        try:
            asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        return _client.run(operation)

    future = _executor.submit(task)
    try:
        return future.result(timeout=CONNECT_TIMEOUT + 30)
    except IbkrServiceError:
        raise
    except Exception as exc:  # noqa: BLE001
        cause = exc.__cause__ or exc
        if isinstance(cause, IbkrServiceError):
            raise cause from exc
        raise map_connect_error(cause) from exc


def disconnect_ib() -> None:
    future = _executor.submit(_client.disconnect)
    future.result(timeout=10)


def map_connect_error(exc: BaseException) -> IbkrServiceError:
    message = str(exc).lower()

    if isinstance(exc, ConnectionRefusedError):
        return IbkrServiceError(
            "gateway_not_running",
            "IB Gateway is not running or is not listening on the configured port.",
            503,
        )

    if isinstance(exc, TimeoutError):
        return IbkrServiceError(
            "connection_timeout",
            "Timed out connecting to IB Gateway. Confirm Paper Trading is logged in.",
            504,
        )

    if isinstance(exc, OSError) and getattr(exc, "errno", None) in {61, 111}:
        return IbkrServiceError(
            "gateway_not_running",
            "IB Gateway is not accepting API connections.",
            503,
        )

    if "refused" in message:
        return IbkrServiceError(
            "api_port_unavailable",
            "IB Gateway API port is unavailable.",
            503,
        )

    if any(keyword in message for keyword in ("login", "expired", "session", "authenticate")):
        return IbkrServiceError(
            "not_logged_in",
            "IB Gateway is running but the session is not authenticated.",
            503,
        )

    if "read-only" in message:
        return IbkrServiceError(
            "read_only_mode",
            "IB Gateway API is in read-only mode. Disable Read-Only API for account reads.",
            503,
        )

    return IbkrServiceError(
        "connection_failed",
        f"Failed to connect to IB Gateway: {exc}",
        503,
    )


def get_primary_account(ib: IB) -> str:
    accounts = ib.managedAccounts()
    if not accounts:
        raise IbkrServiceError("not_logged_in", "No managed IBKR accounts returned by Gateway.", 503)
    return accounts[0]


def account_tag_map(summary: list[Any], account_id: str) -> dict[str, tuple[float, str]]:
    values: dict[str, tuple[float, str]] = {}
    for item in summary:
        if item.account != account_id:
            continue
        try:
            values[item.tag] = (float(item.value), item.currency)
        except (TypeError, ValueError):
            continue
    return values


def require_tag(values: dict[str, tuple[float, str]], tag: str, default: float = 0.0) -> tuple[float, str]:
    if tag in values:
        return values[tag]
    return default, values.get("NetLiquidation", (default, "USD"))[1]


def build_account_payload(ib: IB, account_id: str) -> dict[str, Any]:
    summary = ib.accountSummary()
    values = account_tag_map(summary, account_id)

    account_type = "UNKNOWN"
    for item in summary:
        if item.account == account_id and item.tag == "AccountType":
            account_type = str(item.value)
            break

    net_liq, currency = require_tag(values, "NetLiquidation")
    total_cash, _ = require_tag(values, "TotalCashValue")
    buying_power, _ = require_tag(values, "BuyingPower")
    available_funds, _ = require_tag(values, "AvailableFunds")
    excess_liquidity, _ = require_tag(values, "ExcessLiquidity")
    unrealized_pnl, _ = require_tag(values, "UnrealizedPnL")
    realized_pnl, _ = require_tag(values, "RealizedPnL")
    gross_position_value, _ = require_tag(values, "GrossPositionValue")

    return {
        "accountId": account_id,
        "accountType": account_type,
        "netLiquidation": net_liq,
        "totalCashValue": total_cash,
        "buyingPower": buying_power,
        "availableFunds": available_funds,
        "excessLiquidity": excess_liquidity,
        "currency": currency,
        "unrealizedPnL": unrealized_pnl,
        "realizedPnL": realized_pnl,
        "grossPositionValue": gross_position_value,
    }


def build_positions_payload(ib: IB, account_id: str) -> list[dict[str, Any]]:
    portfolio_items = ib.portfolio(account_id)

    payload: list[dict[str, Any]] = []
    for item in portfolio_items:
        if item.position == 0:
            continue

        contract = item.contract
        payload.append(
            {
                "symbol": contract.symbol,
                "secType": contract.secType,
                "exchange": contract.exchange or contract.primaryExchange or "",
                "currency": contract.currency,
                "quantity": float(item.position),
                "averageCost": float(item.averageCost),
                "marketPrice": float(item.marketPrice or 0),
                "marketValue": float(item.marketValue or 0),
                "unrealizedPnL": float(item.unrealizedPNL or 0),
                "realizedPnL": float(item.realizedPNL or 0),
            }
        )

    return payload


def build_open_orders_payload(ib: IB) -> list[dict[str, Any]]:
    payload: list[dict[str, Any]] = []

    for trade in ib.openTrades():
        contract = trade.contract
        order = trade.order
        status = trade.orderStatus
        payload.append(
            {
                "orderId": int(order.orderId or 0),
                "symbol": contract.symbol,
                "action": order.action,
                "quantity": float(order.totalQuantity),
                "orderType": order.orderType,
                "status": status.status,
                "filled": float(status.filled),
                "remaining": float(status.remaining),
            }
        )

    return payload


def get_status_payload() -> dict[str, Any]:
    def operation(ib: IB) -> dict[str, Any]:
        account_id = get_primary_account(ib)
        return {
            "connected": True,
            "account": account_id,
            "mode": MODE,
            "host": HOST,
            "port": PORT,
        }

    return run_ibkr_operation(operation)


def get_account_response() -> dict[str, Any]:
    def operation(ib: IB) -> dict[str, Any]:
        account_id = get_primary_account(ib)
        return build_account_payload(ib, account_id)

    return run_ibkr_operation(operation)


def get_positions_response() -> list[dict[str, Any]]:
    def operation(ib: IB) -> list[dict[str, Any]]:
        account_id = get_primary_account(ib)
        return build_positions_payload(ib, account_id)

    return run_ibkr_operation(operation)


def get_open_orders_response() -> list[dict[str, Any]]:
    def operation(ib: IB) -> list[dict[str, Any]]:
        get_primary_account(ib)
        return build_open_orders_payload(ib)

    return run_ibkr_operation(operation)
