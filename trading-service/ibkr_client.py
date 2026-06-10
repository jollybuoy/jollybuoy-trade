from __future__ import annotations

from typing import Any, Callable, TypeVar

from ib_insync import IB, MarketOrder, Stock

from ibkr_connection_manager import (
    HOST,
    MODE_PORTS,
    get_manager,
)

T = TypeVar("T")


class IbkrServiceError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 503) -> None:
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def _manager():
    return get_manager()


def run_ibkr_operation(operation: Callable[[IB], T]) -> T:
    try:
        return _manager().run(operation)
    except RuntimeError as exc:
        message = str(exc)
        if "Connect in Settings" in message:
            raise IbkrServiceError("user_disconnected", message, 503) from exc
        raise IbkrServiceError("disconnected", message, 503) from exc
    except IbkrServiceError:
        raise
    except Exception as exc:  # noqa: BLE001
        raise map_connect_error(exc) from exc


def disconnect_ib() -> None:
    _manager().shutdown()


def disconnected_status_payload() -> dict[str, Any]:
    manager = _manager()
    return {
        "connected": False,
        "clientId": manager.client_id,
        "account": None,
        "lastHeartbeat": None,
        "mode": manager.mode,
        "host": manager.host,
        "port": manager.port,
        "error": "Account disconnected. Click Connect in Settings.",
        "errorCode": "user_disconnected",
    }


def disconnect_session() -> dict[str, Any]:
    _manager().disable_session()
    return disconnected_status_payload()


def configure_connection_mode(mode: str) -> dict[str, Any]:
    normalized = mode.lower().strip()
    if normalized not in MODE_PORTS:
        raise IbkrServiceError("invalid_mode", f"Unsupported mode: {mode}", 400)

    manager = _manager()
    try:
        manager.enable_session(normalized)
    except Exception as exc:  # noqa: BLE001
        raise map_connect_error(exc) from exc

    status = manager.status_payload()
    if not status.get("connected"):
        error = status.get("error") or "Failed to connect to IB Gateway."
        raise IbkrServiceError(status.get("errorCode", "connection_failed"), error, 503)

    return status


def get_heartbeat_payload() -> dict[str, Any]:
    return _manager().heartbeat_payload()


def get_status_payload() -> dict[str, Any]:
    return _manager().status_payload()


def build_executions_payload(ib: IB, account_id: str) -> list[dict[str, Any]]:
    ib.reqExecutions()
    ib.sleep(1.5)

    payload: list[dict[str, Any]] = []
    seen_exec_ids: set[str] = set()

    for fill in ib.fills():
        execution = fill.execution
        if execution.acctNumber and execution.acctNumber != account_id:
            continue
        if execution.execId in seen_exec_ids:
            continue
        seen_exec_ids.add(execution.execId)

        contract = fill.contract
        commission = 0.0
        if fill.commissionReport and fill.commissionReport.commission:
            try:
                commission = float(fill.commissionReport.commission)
            except (TypeError, ValueError):
                commission = 0.0

        timestamp = execution.time
        if hasattr(timestamp, "isoformat"):
            timestamp_str = timestamp.isoformat()
        else:
            timestamp_str = str(timestamp)

        payload.append(
            {
                "execId": execution.execId,
                "orderId": int(execution.orderId or 0),
                "symbol": contract.symbol,
                "side": execution.side,
                "quantity": float(execution.shares),
                "price": float(execution.price),
                "avgPrice": float(execution.avgPrice or execution.price),
                "timestamp": timestamp_str,
                "exchange": execution.exchange,
                "commission": commission,
            }
        )

    payload.sort(key=lambda item: item["timestamp"], reverse=True)
    return payload


def get_executions_response() -> list[dict[str, Any]]:
    def operation(ib: IB) -> list[dict[str, Any]]:
        account_id = get_primary_account(ib)
        return build_executions_payload(ib, account_id)

    return run_ibkr_operation(operation)


def place_market_order(symbol: str, action: str, quantity: float) -> dict[str, Any]:
    normalized_symbol = symbol.upper().strip()
    normalized_action = action.upper().strip()
    if normalized_action not in {"BUY", "SELL"}:
        raise IbkrServiceError("invalid_action", "Action must be BUY or SELL", 400)
    if quantity <= 0:
        raise IbkrServiceError("invalid_quantity", "Quantity must be greater than zero", 400)

    mega_cap_7 = {"AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA"}
    if normalized_symbol not in mega_cap_7:
        raise IbkrServiceError("invalid_symbol", "Only Mega Cap 7 US symbols are supported", 400)

    manager = _manager()

    def operation(ib: IB) -> dict[str, Any]:
        get_primary_account(ib)
        contract = Stock(normalized_symbol, "SMART", "USD")
        qualified = ib.qualifyContracts(contract)
        if not qualified:
            raise IbkrServiceError("invalid_contract", f"Could not qualify {normalized_symbol}", 400)

        order = MarketOrder(normalized_action, quantity)
        order.tif = "DAY"
        order.outsideRth = False
        order.transmit = True

        trade = ib.placeOrder(qualified[0], order)
        ib.sleep(1)

        status = trade.orderStatus
        return {
            "orderId": int(trade.order.orderId or 0),
            "symbol": normalized_symbol,
            "action": normalized_action,
            "quantity": float(quantity),
            "orderType": "MKT",
            "status": status.status,
            "filled": float(status.filled),
            "remaining": float(status.remaining),
            "avgFillPrice": float(status.avgFillPrice or 0),
            "mode": manager.mode,
        }

    return run_ibkr_operation(operation)


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

    if "326" in message or "client id" in message or "already in use" in message:
        return IbkrServiceError(
            "client_id_in_use",
            "IB Gateway client ID is already in use. Close other API connections or restart the trading service.",
            503,
        )

    detail = str(exc).strip() or f"{type(exc).__name__} (no detail)"
    return IbkrServiceError(
        "connection_failed",
        f"Failed to connect to IB Gateway: {detail}",
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


def get_account_response() -> dict[str, Any]:
    def operation(ib: IB) -> dict[str, Any]:
        account_id = get_primary_account(ib)
        ib.reqAccountSummary()
        ib.sleep(0.5)
        return build_account_payload(ib, account_id)

    return run_ibkr_operation(operation)


def get_positions_response() -> list[dict[str, Any]]:
    def operation(ib: IB) -> list[dict[str, Any]]:
        account_id = get_primary_account(ib)
        ib.reqPositions()
        ib.sleep(0.5)
        return build_positions_payload(ib, account_id)

    return run_ibkr_operation(operation)


def get_open_orders_response() -> list[dict[str, Any]]:
    def operation(ib: IB) -> list[dict[str, Any]]:
        get_primary_account(ib)
        ib.reqOpenOrders()
        ib.sleep(0.5)
        return build_open_orders_payload(ib)

    return run_ibkr_operation(operation)


def cancel_all_open_orders() -> dict[str, Any]:
    skip_statuses = {"Filled", "Cancelled", "Inactive", "ApiCancelled", "PendingCancel"}

    def operation(ib: IB) -> dict[str, Any]:
        get_primary_account(ib)
        ib.reqOpenOrders()
        ib.sleep(1)

        cancelled: list[dict[str, Any]] = []
        failed: list[dict[str, Any]] = []

        for trade in ib.openTrades():
            order = trade.order
            status = trade.orderStatus.status
            if status in skip_statuses:
                continue

            try:
                ib.cancelOrder(order)
                cancelled.append(
                    {
                        "orderId": int(order.orderId or 0),
                        "symbol": trade.contract.symbol,
                        "action": order.action,
                        "quantity": float(order.totalQuantity),
                        "previousStatus": status,
                    }
                )
            except Exception as exc:  # noqa: BLE001
                failed.append(
                    {
                        "orderId": int(order.orderId or 0),
                        "symbol": trade.contract.symbol,
                        "previousStatus": status,
                        "error": str(exc),
                    }
                )

        if cancelled:
            ib.sleep(2)

        return {
            "cancelledCount": len(cancelled),
            "failedCount": len(failed),
            "cancelled": cancelled,
            "failed": failed,
        }

    return run_ibkr_operation(operation)
