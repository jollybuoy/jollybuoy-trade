#!/usr/bin/env python3
"""
⚠️  PAPER TRADING ONLY — READ BEFORE RUNNING  ⚠️

This script submits a real market order request to Interactive Brokers via the API.

REQUIREMENTS:
- IB Gateway MUST be running in Paper Trading mode.
- Socket port MUST be 4002 (paper). NEVER use live port 4001.
- Read-Only API MUST be disabled in IB Gateway settings.

WARNING:
- This is for verifying paper order flow only.
- Do NOT point this script at a live account or live IB Gateway.
- Do NOT use this script in production or automated trading systems.

Run only when you intentionally want to place one paper test order:
    python place_test_order.py
"""

from __future__ import annotations

import sys
from typing import Any

from ib_insync import IB, MarketOrder, Stock

# ⚠️ PAPER TRADING ONLY — port 4002 is the IB Gateway paper API port.
HOST = "127.0.0.1"
PORT = 4002
CLIENT_ID = 2
CONNECT_TIMEOUT = 10
STATUS_WAIT_SECONDS = 10
CANCEL_WAIT_SECONDS = 5

SYMBOL = "AAPL"
EXCHANGE = "SMART"
CURRENCY = "USD"
QUANTITY = 1

PENDING_STATUSES = {"PendingSubmit", "PreSubmitted"}
LOGIN_EXPIRED_CODES = {504, 1100, 1101, 1102, 10197}


def handle_connect_error(exc: BaseException) -> int:
    message = str(exc).lower()

    if isinstance(exc, ConnectionRefusedError):
        print("ERROR: Connection refused.")
        print("IB Gateway is not running or is not listening on port 4002.")
        return 1

    if isinstance(exc, TimeoutError):
        print("ERROR: Connection timed out.")
        print("IB Gateway may not be running, or Paper Trading API is not enabled on port 4002.")
        return 1

    if isinstance(exc, OSError) and getattr(exc, "errno", None) in {61, 111}:
        print("ERROR: Connection refused.")
        print("Start IB Gateway in Paper Trading mode and confirm Socket Port is 4002.")
        return 1

    if "refused" in message:
        print("ERROR: Connection refused.")
        print("IB Gateway is not accepting API connections on 127.0.0.1:4002.")
        return 1

    if any(keyword in message for keyword in ("login", "expired", "session", "authenticate")):
        print("ERROR: Login expired or IB session is not authenticated.")
        print(str(exc))
        return 1

    print(f"ERROR: Failed to connect to IB Gateway: {exc}")
    return 1


def print_order_status(trade: Any) -> None:
    status = trade.orderStatus
    print(f"Order status: {status.status}")
    print(f"  Filled: {status.filled} / {trade.order.totalQuantity}")
    print(f"  Remaining: {status.remaining}")
    print(f"  TIF: {trade.order.tif}")
    print(f"  Outside RTH: {trade.order.outsideRth}")

    if status.avgFillPrice and status.avgFillPrice > 0:
        print(f"Filled price: {status.avgFillPrice} {CURRENCY}")


def print_market_open_warning() -> None:
    print("\nWARNING: Order was not filled.")
    print("The US equity market may be closed.")
    print("AAPL market orders typically fill during regular US hours only:")
    print("  Monday-Friday, 9:30 AM - 4:00 PM Eastern Time.")
    print("Retry during market hours with IB Gateway in Paper Trading mode (port 4002).")


def wait_for_updates(ib: IB, trade: Any, timeout_seconds: float) -> None:
    elapsed = 0.0
    poll_interval = 0.5

    while elapsed < timeout_seconds and not trade.isDone():
        ib.waitOnUpdate(timeout=poll_interval)
        elapsed += poll_interval


def qualify_stock(ib: IB) -> Stock | None:
    contract = Stock(SYMBOL, EXCHANGE, CURRENCY)
    qualified = ib.qualifyContracts(contract)

    if not qualified:
        print(f"ERROR: Could not qualify {SYMBOL} contract on {EXCHANGE} ({CURRENCY}).")
        return None

    resolved = qualified[0]
    print(
        "Qualified contract: "
        f"{resolved.symbol} conId={resolved.conId} "
        f"exchange={resolved.exchange} primaryExchange={resolved.primaryExchange} "
        f"currency={resolved.currency}"
    )
    return resolved


def build_market_order() -> MarketOrder:
    order = MarketOrder("BUY", QUANTITY)
    order.tif = "DAY"
    order.outsideRth = False
    order.transmit = True
    return order


def main() -> int:
    print("⚠️  PAPER TRADING ONLY — submitting one test market order on port 4002.")

    ib = IB()
    session_error: dict[str, str | None] = {"message": None}

    def on_error(_req_id: int, error_code: int, error_string: str, _contract: Any) -> None:
        if error_code in LOGIN_EXPIRED_CODES:
            session_error["message"] = f"{error_code}: {error_string}"
        elif error_code == 10349:
            print(f"NOTE: IB message {error_code}: {error_string}")

    ib.errorEvent += on_error

    print(f"Connecting to IB Gateway at {HOST}:{PORT} (clientId={CLIENT_ID})...")

    try:
        ib.connect(HOST, PORT, clientId=CLIENT_ID, timeout=CONNECT_TIMEOUT)
    except Exception as exc:  # noqa: BLE001
        return handle_connect_error(exc)

    if session_error["message"]:
        print("ERROR: Login expired or IB Gateway session is invalid.")
        print(session_error["message"])
        if ib.isConnected():
            ib.disconnect()
        return 1

    print(f"Connection status: {'Connected' if ib.isConnected() else 'Disconnected'}")

    exit_code = 0

    try:
        contract = qualify_stock(ib)
        if contract is None:
            return 1

        order = build_market_order()
        print(
            "\nOrder settings: "
            f"BUY {QUANTITY} {SYMBOL}, tif={order.tif}, "
            f"outsideRth={order.outsideRth}, transmit={order.transmit}"
        )

        trade = ib.placeOrder(contract, order)

        print(f"\nSubmitted paper market order: BUY {QUANTITY} {SYMBOL} @ {EXCHANGE} ({CURRENCY})")
        print_order_status(trade)

        def on_status_update(updated_trade: Any) -> None:
            print("\nOrder update received:")
            print_order_status(updated_trade)

        trade.statusEvent += on_status_update

        print(f"\nWaiting up to {STATUS_WAIT_SECONDS}s for order status updates...")
        wait_for_updates(ib, trade, STATUS_WAIT_SECONDS)

        print("\nFinal order state:")
        print_order_status(trade)

        if trade.orderStatus.status == "Filled":
            return 0

        print_market_open_warning()

        if trade.orderStatus.status in PENDING_STATUSES:
            print(
                f"\nOrder still {trade.orderStatus.status} after {STATUS_WAIT_SECONDS}s — cancelling..."
            )
            ib.cancelOrder(trade.order)
            wait_for_updates(ib, trade, CANCEL_WAIT_SECONDS)
            print("\nState after cancel request:")
            print_order_status(trade)
            exit_code = 1
        else:
            print(
                f"\nOrder left active with status '{trade.orderStatus.status}' "
                "(not auto-cancelled because it is no longer pending submission)."
            )
            exit_code = 1

    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: Failed to place or monitor paper test order: {exc}")
        exit_code = 1
    finally:
        if ib.isConnected():
            ib.disconnect()
            print("\nDisconnected cleanly.")

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
