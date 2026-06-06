#!/usr/bin/env python3
"""Verify connectivity to an Interactive Brokers Paper Trading account via IB Gateway."""

from __future__ import annotations

import sys
from typing import Any

from ib_insync import IB

HOST = "127.0.0.1"
PORT = 4002
CLIENT_ID = 1
CONNECT_TIMEOUT = 10

LOGIN_EXPIRED_CODES = {504, 1100, 1101, 1102, 10197}
CASH_BALANCE_TAGS = ("TotalCashValue", "CashBalance", "SettledCash")


def format_connection_status(ib: IB) -> str:
    return "Connected" if ib.isConnected() else "Disconnected"


def find_account_value(summary: list[Any], tag: str) -> str | None:
    for item in summary:
        if item.tag == tag:
            return f"{item.value} {item.currency}"
    return None


def find_cash_balance(summary: list[Any]) -> str | None:
    for tag in CASH_BALANCE_TAGS:
        value = find_account_value(summary, tag)
        if value is not None:
            return value
    return None


def print_account_summary(summary: list[Any]) -> None:
    print("\nAccount summary:")
    if not summary:
        print("  (no account summary returned)")
        return

    for item in summary:
        print(f"  {item.tag}: {item.value} {item.currency} ({item.account})")


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


def main() -> int:
    ib = IB()
    session_error: dict[str, str | None] = {"message": None}

    def on_error(_req_id: int, error_code: int, error_string: str, _contract: Any) -> None:
        if error_code in LOGIN_EXPIRED_CODES:
            session_error["message"] = f"{error_code}: {error_string}"

    ib.errorEvent += on_error

    print(f"Connecting to IB Gateway at {HOST}:{PORT} (clientId={CLIENT_ID})...")

    try:
        ib.connect(HOST, PORT, clientId=CLIENT_ID, timeout=CONNECT_TIMEOUT)
    except Exception as exc:  # noqa: BLE001 - map provider errors to user-facing messages
        return handle_connect_error(exc)

    if session_error["message"]:
        print("ERROR: Login expired or IB Gateway session is invalid.")
        print(session_error["message"])
        if ib.isConnected():
            ib.disconnect()
        return 1

    print(f"Connection status: {format_connection_status(ib)}")

    try:
        accounts = ib.managedAccounts()
        summary = ib.accountSummary()

        print(f"Managed accounts: {', '.join(accounts) if accounts else 'none'}")
        print_account_summary(summary)

        buying_power = find_account_value(summary, "BuyingPower")
        cash_balance = find_cash_balance(summary)

        print(f"\nBuying power: {buying_power or 'not available'}")
        print(f"Cash balance: {cash_balance or 'not available'}")
    except Exception as exc:  # noqa: BLE001
        message = str(exc).lower()
        if any(keyword in message for keyword in ("login", "expired", "session", "authenticate")):
            print("ERROR: Login expired or IB Gateway session is invalid.")
            print(exc)
            return 1
        print(f"ERROR: Connected, but failed to read account data: {exc}")
        return 1
    finally:
        if ib.isConnected():
            ib.disconnect()
            print("\nDisconnected cleanly.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
