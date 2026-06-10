from __future__ import annotations

import logging
import os
import threading
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from services.ibkr_order_service import (
    MEGA_7_SYMBOLS,
    get_positions,
    get_symbol_market_context,
    place_market_buy,
    place_market_sell_quantity,
)
from services.market_hours import get_market_status, is_us_market_open
from services.risk_guard import (
    set_emergency_stop,
    validate_daily_loss_limit,
    validate_emergency_stop,
    validate_max_allocation,
    validate_no_short_sell,
    validate_open_symbols_limit,
    validate_paper_mode,
)
from ibkr_connection_manager import get_manager

logger = logging.getLogger("strategy.mega7_harvest")

STRATEGY_NAME = "JollyBuoy Mega 7 Harvest Strategy"
UNIVERSE = sorted(MEGA_7_SYMBOLS)

INITIAL_BUY_DOLLARS = 1000.0
REBUY_DOLLARS = 500.0
COVER_SHORT_DOLLARS = 750.0
PROFIT_BOOK_PCT = float(os.getenv("STRATEGY_PROFIT_PCT", "0.6"))
STRONG_PROFIT_PCT = float(os.getenv("STRATEGY_STRONG_PROFIT_PCT", "1.2"))
REBUY_DIP_PCT = float(os.getenv("STRATEGY_REBUY_DIP_PCT", "0.4"))
HARVEST_SELL_FRACTION = float(os.getenv("STRATEGY_SELL_FRACTION", "0.35"))
STRATEGY_CYCLE_INTERVAL_SECONDS = int(os.getenv("STRATEGY_CYCLE_INTERVAL", "60"))


@dataclass
class SymbolState:
    last_sell_price: float | None = None
    last_buy_price: float | None = None
    last_action_at: str | None = None


@dataclass
class StrategyRuntime:
    running: bool = False
    paused: bool = True
    emergency_stop: bool = False
    last_cycle_at: str | None = None
    symbol_states: dict[str, SymbolState] = field(default_factory=dict)
    logs: deque[dict[str, Any]] = field(default_factory=lambda: deque(maxlen=200))


_runtime = StrategyRuntime()
_lock = threading.RLock()


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _log(level: str, message: str, **extra: Any) -> None:
    entry = {"timestamp": _utc_now(), "level": level, "message": message, **extra}
    with _lock:
        _runtime.logs.appendleft(entry)
    logger.info("%s — %s", level.upper(), message)


def _symbol_state(symbol: str) -> SymbolState:
    with _lock:
        if symbol not in _runtime.symbol_states:
            _runtime.symbol_states[symbol] = SymbolState()
        return _runtime.symbol_states[symbol]


def _unrealized_pct(position: dict[str, Any]) -> float:
    avg_cost = abs(position.get("averageCost") or 0)
    market_price = position.get("marketPrice") or 0
    if avg_cost <= 0 or market_price <= 0:
        return 0.0
    qty = float(position.get("quantity") or 0)
    if qty < 0:
        return ((avg_cost - market_price) / avg_cost) * 100
    return ((market_price - avg_cost) / avg_cost) * 100


def _open_symbol_count(positions: list[dict[str, Any]]) -> int:
    return len([p for p in positions if float(p.get("quantity", 0)) > 0])


def get_strategy_status() -> dict[str, Any]:
    manager = get_manager()
    market = get_market_status()
    with _lock:
        auto_trading = _runtime.running and not _runtime.paused and not _runtime.emergency_stop
        return {
            "name": STRATEGY_NAME,
            "mode": "paper",
            "running": _runtime.running,
            "paused": _runtime.paused,
            "emergencyStop": _runtime.emergency_stop,
            "lastCycleAt": _runtime.last_cycle_at,
            "universe": UNIVERSE,
            "connected": manager.is_connected() and manager.session_enabled,
            "account": manager.account,
            "market": market,
            "cycleIntervalSeconds": STRATEGY_CYCLE_INTERVAL_SECONDS,
            "autoTrading": auto_trading,
            "profitBookPct": PROFIT_BOOK_PCT,
            "rebuyDipPct": REBUY_DIP_PCT,
            "logs": list(_runtime.logs)[:50],
        }


def is_strategy_active() -> bool:
    with _lock:
        return _runtime.running and not _runtime.paused and not _runtime.emergency_stop


def should_run_scheduled_cycle() -> bool:
    return is_strategy_active() and is_us_market_open()


def auto_start_if_paper() -> dict[str, Any]:
    manager = get_manager()
    if manager.mode.lower() != "paper" or not manager.is_connected():
        return get_strategy_status()

    status = start_strategy()
    if is_us_market_open():
        _log("info", "Strategy auto-started — active profit rotation begins in background.")
    else:
        _log("info", "Strategy auto-started — waiting for US market hours.")
    return status


def start_strategy() -> dict[str, Any]:
    with _lock:
        if _runtime.emergency_stop:
            _log("warn", "Start blocked — emergency stop is active.")
            return get_strategy_status()
        _runtime.running = True
        _runtime.paused = False
    _log(
        "info",
        f"Active profit rotation ON — scans every {STRATEGY_CYCLE_INTERVAL_SECONDS}s, "
        f"books +{PROFIT_BOOK_PCT}% / +{STRONG_PROFIT_PCT}%, rebuys on -{REBUY_DIP_PCT}% dips.",
    )
    return get_strategy_status()


def pause_strategy() -> dict[str, Any]:
    with _lock:
        _runtime.running = False
        _runtime.paused = True
    _log("info", "Strategy paused.")
    return get_strategy_status()


def emergency_stop_strategy() -> dict[str, Any]:
    set_emergency_stop(True)
    with _lock:
        _runtime.emergency_stop = True
        _runtime.running = False
        _runtime.paused = True
    _log("warn", "Emergency stop activated — all execution halted.")
    return get_strategy_status()


def _guard_cycle() -> tuple[bool, str | None]:
    manager = get_manager()
    ok, reason = validate_paper_mode(manager.mode)
    if not ok:
        _log("warn", reason or "Paper mode check failed.")
        return False, reason

    ok, reason = validate_emergency_stop()
    if not ok:
        _log("warn", reason or "Emergency stop active.")
        return False, reason

    with _lock:
        if _runtime.emergency_stop:
            msg = "Emergency stop active — all execution halted."
            _log("warn", msg)
            return False, msg

    if not manager.is_connected() or not manager.session_enabled:
        msg = "IBKR paper account is not connected."
        _log("warn", msg)
        return False, msg

    if not is_us_market_open():
        market = get_market_status()
        msg = market["message"]
        _log("info", str(msg))
        return False, str(msg)

    ok, reason = validate_daily_loss_limit()
    if not ok:
        _log("warn", reason or "Daily loss limit reached.")
        return False, reason

    return True, None


def should_initial_buy(
    symbol: str,
    position: dict[str, Any] | None,
    market_context: dict[str, float | str | None],
    open_positions: list[dict[str, Any]],
) -> tuple[bool, str | None]:
    if position and float(position.get("quantity", 0)) > 0:
        return False, "Long position already open."

    price = market_context.get("price")
    if price is None or float(price) <= 0:
        return False, "Market price unavailable."

    ok, reason = validate_open_symbols_limit(_open_symbol_count(open_positions), symbol_has_position=False)
    if not ok:
        return False, reason

    ok, reason = validate_max_allocation(symbol, INITIAL_BUY_DOLLARS, 0.0)
    if not ok:
        return False, reason

    return True, None


def should_rebuy_after_profit(
    symbol: str,
    position: dict[str, Any] | None,
    market_context: dict[str, float | str | None],
) -> tuple[bool, str | None]:
    state = _symbol_state(symbol)
    if state.last_sell_price is None:
        return False, "No prior profit-booking sell recorded."

    price = market_context.get("price")
    if price is None or float(price) <= 0:
        return False, "Market price unavailable."

    price = float(price)
    dip_pct = ((state.last_sell_price - price) / state.last_sell_price) * 100
    if dip_pct < REBUY_DIP_PCT:
        return False, f"Waiting for -{REBUY_DIP_PCT:.1f}% dip from last sell ({dip_pct:.2f}% so far)."

    current_value = abs(float(position.get("marketValue") or 0)) if position else 0.0
    ok, reason = validate_max_allocation(symbol, REBUY_DOLLARS, current_value)
    if not ok:
        return False, reason

    return True, None


def should_take_profit(position: dict[str, Any]) -> tuple[str | None, str | None]:
    qty = float(position.get("quantity") or 0)
    if qty <= 0:
        return None, "No long shares to sell."

    pct = _unrealized_pct(position)
    if pct >= STRONG_PROFIT_PCT:
        return "strong", None
    if pct >= PROFIT_BOOK_PCT:
        return "standard", None

    return None, f"Unrealized gain {pct:.2f}% — waiting for +{PROFIT_BOOK_PCT}% to book profit."


def execute_cover_short(
    symbol: str,
    position: dict[str, Any],
    market_context: dict[str, float | str | None],
) -> dict[str, Any] | None:
    short_qty = abs(float(position.get("quantity") or 0))
    if short_qty <= 0:
        return None

    price = market_context.get("price")
    if price is None or float(price) <= 0:
        _log("info", f"{symbol} cover skipped — no price.", symbol=symbol, action="skip_buy")
        return None

    try:
        result = place_market_buy(symbol, COVER_SHORT_DOLLARS)
        _log(
            "info",
            f"{symbol} covering short — bought {result['quantity']} shares (~${COVER_SHORT_DOLLARS:.0f}).",
            symbol=symbol,
            action="cover_short",
            order=result,
        )
        return result
    except Exception as exc:  # noqa: BLE001
        _log("error", f"{symbol} cover buy rejected — {exc}", symbol=symbol, action="order_rejected")
        return None


def execute_initial_buy(
    symbol: str,
    position: dict[str, Any] | None,
    market_context: dict[str, float | str | None],
    open_positions: list[dict[str, Any]],
) -> dict[str, Any] | None:
    should_buy, reason = should_initial_buy(symbol, position, market_context, open_positions)
    if not should_buy:
        _log("info", f"{symbol} buy skipped — {reason}", symbol=symbol, action="skip_buy")
        return None

    try:
        result = place_market_buy(symbol, INITIAL_BUY_DOLLARS)
        state = _symbol_state(symbol)
        fill = float(result.get("avgFillPrice") or market_context.get("price") or 0)
        if fill > 0:
            state.last_buy_price = fill
        state.last_action_at = _utc_now()
        _log(
            "info",
            f"{symbol} entry buy — {result['quantity']} shares (~${INITIAL_BUY_DOLLARS:.0f}).",
            symbol=symbol,
            action="buy",
            order=result,
        )
        return result
    except Exception as exc:  # noqa: BLE001
        _log("error", f"{symbol} buy rejected — {exc}", symbol=symbol, action="order_rejected")
        return None


def execute_profit_book(
    symbol: str,
    stage: str,
    position: dict[str, Any],
) -> dict[str, Any] | None:
    owned = float(position["quantity"])
    sell_qty = max(1, int(owned * HARVEST_SELL_FRACTION))
    sell_qty = min(sell_qty, int(owned))

    ok, reason = validate_no_short_sell(symbol, sell_qty, owned)
    if not ok:
        _log("warn", f"{symbol} profit book blocked — {reason}", symbol=symbol, action="skip_sell")
        return None

    try:
        result = place_market_sell_quantity(symbol, sell_qty)
        state = _symbol_state(symbol)
        fill_price = float(result.get("avgFillPrice") or position.get("marketPrice") or 0)
        if fill_price > 0:
            state.last_sell_price = fill_price
        state.last_action_at = _utc_now()
        pct = _unrealized_pct(position)
        _log(
            "info",
            f"{symbol} profit booked ({stage}, +{pct:.2f}%) — sold {sell_qty} shares at ~${fill_price:.2f}.",
            symbol=symbol,
            action="sell",
            order=result,
        )
        return result
    except Exception as exc:  # noqa: BLE001
        _log("error", f"{symbol} sell rejected — {exc}", symbol=symbol, action="order_rejected")
        return None


def execute_rebuy(
    symbol: str,
    position: dict[str, Any] | None,
    market_context: dict[str, float | str | None],
) -> dict[str, Any] | None:
    should_buy, reason = should_rebuy_after_profit(symbol, position, market_context)
    if not should_buy:
        _log("info", f"{symbol} rebuy skipped — {reason}", symbol=symbol, action="skip_buy")
        return None

    try:
        result = place_market_buy(symbol, REBUY_DOLLARS)
        state = _symbol_state(symbol)
        fill = float(result.get("avgFillPrice") or market_context.get("price") or 0)
        if fill > 0:
            state.last_buy_price = fill
        state.last_action_at = _utc_now()
        _log(
            "info",
            f"{symbol} rebuy after dip — {result['quantity']} shares (~${REBUY_DOLLARS:.0f}).",
            symbol=symbol,
            action="buy",
            order=result,
        )
        return result
    except Exception as exc:  # noqa: BLE001
        _log("error", f"{symbol} rebuy rejected — {exc}", symbol=symbol, action="order_rejected")
        return None


def evaluate_symbol(
    symbol: str,
    position: dict[str, Any] | None,
    market_context: dict[str, float | str | None],
    open_positions: list[dict[str, Any]],
) -> dict[str, Any]:
    _log("info", f"Evaluating {symbol}.", symbol=symbol, action="evaluate")
    summary: dict[str, Any] = {"symbol": symbol, "actions": []}

    qty = float(position["quantity"]) if position else 0.0

    if qty < 0:
        cover = execute_cover_short(symbol, position, market_context)
        if cover:
            summary["actions"].append({"type": "cover_short", "order": cover})
        return summary

    if qty <= 0:
        rebuy = execute_rebuy(symbol, position, market_context)
        if rebuy:
            summary["actions"].append({"type": "rebuy", "order": rebuy})
            return summary
        buy = execute_initial_buy(symbol, position, market_context, open_positions)
        if buy:
            summary["actions"].append({"type": "entry_buy", "order": buy})
        return summary

    profit_stage, profit_reason = should_take_profit(position)
    if profit_stage:
        sell = execute_profit_book(symbol, profit_stage, position)
        if sell:
            summary["actions"].append({"type": f"profit_book_{profit_stage}", "order": sell})
    elif profit_reason:
        _log("info", f"{symbol} hold — {profit_reason}", symbol=symbol, action="hold")

    open_positions = get_positions()
    position = next((p for p in open_positions if p["symbol"] == symbol), None)
    rebuy = execute_rebuy(symbol, position, market_context)
    if rebuy:
        summary["actions"].append({"type": "rebuy", "order": rebuy})

    return summary


def run_strategy_cycle() -> dict[str, Any]:
    market = get_market_status()
    _log("info", f"Market status: {market['reason']}", action="market_check", market=market)

    allowed, block_reason = _guard_cycle()
    if not allowed:
        with _lock:
            _runtime.last_cycle_at = _utc_now()
        return {
            "ok": False,
            "reason": block_reason,
            "market": market,
            "results": [],
            "status": get_strategy_status(),
        }

    open_positions = get_positions()
    results: list[dict[str, Any]] = []
    for symbol in UNIVERSE:
        position = next((p for p in open_positions if p["symbol"] == symbol), None)
        market_context = get_symbol_market_context(symbol)
        results.append(evaluate_symbol(symbol, position, market_context, open_positions))
        open_positions = get_positions()

    with _lock:
        _runtime.last_cycle_at = _utc_now()

    actions_taken = sum(len(r.get("actions", [])) for r in results)
    _log(
        "info",
        f"Cycle complete — {actions_taken} order(s) across {len(UNIVERSE)} symbols.",
        action="cycle_complete",
    )
    return {
        "ok": True,
        "market": market,
        "results": results,
        "status": get_strategy_status(),
    }
