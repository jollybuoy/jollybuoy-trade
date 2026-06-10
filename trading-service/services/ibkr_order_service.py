from __future__ import annotations

from typing import Any

from ib_insync import IB, MarketOrder, Stock

from ibkr_client import IbkrServiceError, run_ibkr_operation
from ibkr_connection_manager import get_manager

MEGA_7_SYMBOLS = frozenset({"AAPL", "MSFT", "NVDA", "AMZN", "META", "GOOGL", "TSLA"})


def _require_paper_mode() -> None:
    manager = get_manager()
    if manager.mode.lower() != "paper":
        raise IbkrServiceError("paper_only", "Strategy executes on IBKR paper account only.", 403)
    if manager.port != 4002:
        raise IbkrServiceError("paper_only", "Strategy requires IB Gateway paper port 4002.", 403)


def _primary_account(ib: IB) -> str:
    accounts = ib.managedAccounts()
    if not accounts:
        raise IbkrServiceError("not_logged_in", "No managed IBKR accounts returned.", 503)
    return accounts[0]


def _qualify_stock(ib: IB, symbol: str) -> Stock:
    normalized = symbol.upper().strip()
    if normalized not in MEGA_7_SYMBOLS:
        raise IbkrServiceError("invalid_symbol", f"{normalized} is not in the Mega 7 universe.", 400)
    contract = Stock(normalized, "SMART", "USD")
    qualified = ib.qualifyContracts(contract)
    if not qualified:
        raise IbkrServiceError("invalid_contract", f"Could not qualify {normalized}.", 400)
    return qualified[0]


def get_account() -> dict[str, Any]:
    _require_paper_mode()

    def operation(ib: IB) -> dict[str, Any]:
        account_id = _primary_account(ib)
        ib.reqAccountSummary()
        ib.sleep(0.5)
        summary = {item.tag: float(item.value) for item in ib.accountSummary() if item.account == account_id}
        return {
            "accountId": account_id,
            "netLiquidation": summary.get("NetLiquidation", 0.0),
            "buyingPower": summary.get("BuyingPower", 0.0),
            "realizedPnL": summary.get("RealizedPnL", 0.0),
            "unrealizedPnL": summary.get("UnrealizedPnL", 0.0),
            "currency": "USD",
        }

    return run_ibkr_operation(operation)


def get_positions() -> list[dict[str, Any]]:
    _require_paper_mode()

    def operation(ib: IB) -> list[dict[str, Any]]:
        account_id = _primary_account(ib)
        ib.reqPositions()
        ib.sleep(0.5)
        payload: list[dict[str, Any]] = []
        for item in ib.portfolio(account_id):
            if item.position == 0:
                continue
            contract = item.contract
            if contract.symbol not in MEGA_7_SYMBOLS:
                continue
            payload.append(
                {
                    "symbol": contract.symbol,
                    "quantity": float(item.position),
                    "averageCost": float(item.averageCost),
                    "marketPrice": float(item.marketPrice or 0),
                    "marketValue": float(item.marketValue or 0),
                    "unrealizedPnL": float(item.unrealizedPNL or 0),
                    "realizedPnL": float(item.realizedPNL or 0),
                }
            )
        return payload

    return run_ibkr_operation(operation)


def get_position(symbol: str) -> dict[str, Any] | None:
    normalized = symbol.upper()
    for position in get_positions():
        if position["symbol"] == normalized:
            return position
    return None


def _resolve_live_price(ib: IB, contract: Stock, account_id: str) -> float | None:
    for item in ib.portfolio(account_id):
        if item.contract.symbol == contract.symbol and item.marketPrice and item.marketPrice > 0:
            return float(item.marketPrice)

    ticker = ib.reqMktData(contract, "", False, False)
    ib.sleep(3)
    price = ticker.marketPrice() or ticker.last or ticker.close
    if (not price or price <= 0) and ticker.bid and ticker.ask and ticker.bid > 0 and ticker.ask > 0:
        price = (float(ticker.bid) + float(ticker.ask)) / 2
    ib.cancelMktData(contract)
    if price and price > 0:
        return float(price)

    intraday = ib.reqHistoricalData(
        contract,
        endDateTime="",
        durationStr="1 D",
        barSizeSetting="1 min",
        whatToShow="TRADES",
        useRTH=True,
        formatDate=1,
    )
    if intraday:
        return float(intraday[-1].close)

    daily = ib.reqHistoricalData(
        contract,
        endDateTime="",
        durationStr="2 D",
        barSizeSetting="1 day",
        whatToShow="TRADES",
        useRTH=True,
        formatDate=1,
    )
    if daily:
        return float(daily[-1].close)

    return None


def get_symbol_market_context(symbol: str) -> dict[str, float | str | None]:
    _require_paper_mode()

    def operation(ib: IB) -> dict[str, float | str | None]:
        contract = _qualify_stock(ib, symbol)
        account_id = _primary_account(ib)
        price = _resolve_live_price(ib, contract, account_id)

        bars = ib.reqHistoricalData(
            contract,
            endDateTime="",
            durationStr="60 D",
            barSizeSetting="1 day",
            whatToShow="TRADES",
            useRTH=True,
            formatDate=1,
        )
        ma50 = None
        if len(bars) >= 50:
            ma50 = float(sum(bar.close for bar in bars[-50:]) / 50)
        if (price is None or price <= 0) and bars:
            price = float(bars[-1].close)

        return {"symbol": symbol.upper(), "price": price, "ma50": ma50}

    return run_ibkr_operation(operation)


def get_market_price(symbol: str) -> float | None:
    context = get_symbol_market_context(symbol)
    price = context.get("price")
    return float(price) if price and price > 0 else None


def get_50_day_moving_average(symbol: str) -> float | None:
    context = get_symbol_market_context(symbol)
    ma50 = context.get("ma50")
    return float(ma50) if ma50 and ma50 > 0 else None


def place_market_buy(symbol: str, dollar_amount: float) -> dict[str, Any]:
    _require_paper_mode()
    if dollar_amount <= 0:
        raise IbkrServiceError("invalid_amount", "Dollar amount must be positive.", 400)

    price = get_market_price(symbol)
    if price is None or price <= 0:
        raise IbkrServiceError("no_price", f"No market price available for {symbol.upper()}.", 503)

    quantity = int(dollar_amount // price)
    if quantity < 1:
        raise IbkrServiceError("invalid_quantity", f"${dollar_amount:.2f} is below one share at ${price:.2f}.", 400)

    def operation(ib: IB) -> dict[str, Any]:
        contract = _qualify_stock(ib, symbol)
        order = MarketOrder("BUY", quantity)
        order.tif = "DAY"
        order.outsideRth = False
        order.transmit = True
        trade = ib.placeOrder(contract, order)
        ib.sleep(1)
        status = trade.orderStatus
        return {
            "symbol": symbol.upper(),
            "action": "BUY",
            "quantity": float(quantity),
            "estimatedPrice": price,
            "estimatedValue": float(quantity * price),
            "orderId": int(trade.order.orderId or 0),
            "status": status.status,
            "filled": float(status.filled),
            "remaining": float(status.remaining),
            "avgFillPrice": float(status.avgFillPrice or 0),
        }

    return run_ibkr_operation(operation)


def place_market_sell_quantity(symbol: str, quantity: float) -> dict[str, Any]:
    _require_paper_mode()
    if quantity <= 0:
        raise IbkrServiceError("invalid_quantity", "Sell quantity must be positive.", 400)

    sell_qty = int(quantity)
    if sell_qty < 1:
        raise IbkrServiceError("invalid_quantity", "Sell quantity must be at least 1 share.", 400)

    def operation(ib: IB) -> dict[str, Any]:
        contract = _qualify_stock(ib, symbol)
        order = MarketOrder("SELL", sell_qty)
        order.tif = "DAY"
        order.outsideRth = False
        order.transmit = True
        trade = ib.placeOrder(contract, order)
        ib.sleep(1)
        status = trade.orderStatus
        return {
            "symbol": symbol.upper(),
            "action": "SELL",
            "quantity": float(sell_qty),
            "orderId": int(trade.order.orderId or 0),
            "status": status.status,
            "filled": float(status.filled),
            "remaining": float(status.remaining),
            "avgFillPrice": float(status.avgFillPrice or 0),
        }

    return run_ibkr_operation(operation)
