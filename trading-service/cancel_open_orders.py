#!/usr/bin/env python3
"""Cancel all open / pre-submitted IBKR orders (paper port 4002). Does not place new orders."""

from __future__ import annotations

import sys

from ib_insync import IB

HOST = "127.0.0.1"
PORT = 4002
CLIENT_ID = 12
CONNECT_TIMEOUT = 10
SKIP_STATUSES = {"Filled", "Cancelled", "Inactive", "ApiCancelled", "PendingCancel"}


def main() -> int:
    ib = IB()

    print(f"Connecting to IB Gateway at {HOST}:{PORT} (clientId={CLIENT_ID})...")
    try:
        ib.connect(HOST, PORT, clientId=CLIENT_ID, timeout=CONNECT_TIMEOUT)
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: Could not connect: {exc}")
        return 1

    ib.reqOpenOrders()
    ib.sleep(1)

    open_trades = ib.openTrades()
    if not open_trades:
        print("No open orders found.")
        ib.disconnect()
        return 0

    cancelled = 0
    for trade in open_trades:
        status = trade.orderStatus.status
        if status in SKIP_STATUSES:
            continue

        order = trade.order
        print(
            f"Cancelling order {order.orderId} {order.action} "
            f"{order.totalQuantity} {trade.contract.symbol} ({status})..."
        )
        ib.cancelOrder(order)
        cancelled += 1

    if cancelled:
        ib.sleep(2)

    remaining = [
        t for t in ib.openTrades() if t.orderStatus.status not in SKIP_STATUSES | {"PendingCancel"}
    ]
    print(f"\nCancelled {cancelled} order(s). Remaining active: {len(remaining)}")
    for trade in remaining:
        print(
            f"  - {trade.contract.symbol} {trade.order.action} "
            f"{trade.order.totalQuantity} [{trade.orderStatus.status}]"
        )

    ib.disconnect()
    return 0 if not remaining else 1


if __name__ == "__main__":
    sys.exit(main())
