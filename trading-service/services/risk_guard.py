from __future__ import annotations

import threading
from dataclasses import dataclass, field
from datetime import date

MAX_ALLOCATION_PER_STOCK = 3000.0
MAX_DAILY_REALIZED_LOSS = 250.0
MAX_OPEN_SYMBOLS = 7


@dataclass
class RiskGuardState:
    emergency_stop_active: bool = False
    daily_realized_pnl: float = 0.0
    daily_pnl_date: str = field(default_factory=lambda: date.today().isoformat())


_state = RiskGuardState()
_lock = threading.Lock()


def _reset_daily_if_needed() -> None:
    today = date.today().isoformat()
    if _state.daily_pnl_date != today:
        _state.daily_pnl_date = today
        _state.daily_realized_pnl = 0.0


def set_emergency_stop(active: bool) -> None:
    with _lock:
        _state.emergency_stop_active = active


def is_emergency_stop_active() -> bool:
    with _lock:
        return _state.emergency_stop_active


def record_realized_pnl(amount: float) -> None:
    with _lock:
        _reset_daily_if_needed()
        _state.daily_realized_pnl += amount


def validate_emergency_stop() -> tuple[bool, str | None]:
    with _lock:
        if _state.emergency_stop_active:
            return False, "Emergency stop active — all execution halted."
    return True, None


def validate_daily_loss_limit() -> tuple[bool, str | None]:
    with _lock:
        _reset_daily_if_needed()
        if _state.daily_realized_pnl <= -MAX_DAILY_REALIZED_LOSS:
            return False, f"Daily realized loss limit reached (${MAX_DAILY_REALIZED_LOSS:.0f})."
    return True, None


def validate_max_allocation(
    symbol: str,
    order_value: float,
    current_market_value: float,
) -> tuple[bool, str | None]:
    projected = current_market_value + order_value
    if projected > MAX_ALLOCATION_PER_STOCK:
        return (
            False,
            f"{symbol} allocation would exceed ${MAX_ALLOCATION_PER_STOCK:.0f} "
            f"(current ${current_market_value:.2f} + order ${order_value:.2f}).",
        )
    return True, None


def validate_open_symbols_limit(open_symbol_count: int, symbol_has_position: bool) -> tuple[bool, str | None]:
    if symbol_has_position:
        return True, None
    if open_symbol_count >= MAX_OPEN_SYMBOLS:
        return False, f"Max open symbols limit reached ({MAX_OPEN_SYMBOLS})."
    return True, None


def validate_no_short_sell(symbol: str, sell_quantity: float, owned_quantity: float) -> tuple[bool, str | None]:
    if sell_quantity <= 0:
        return False, f"{symbol} sell quantity must be positive."
    if sell_quantity > owned_quantity:
        return False, f"{symbol} sell blocked — would short ({sell_quantity} > {owned_quantity} owned)."
    return True, None


def validate_paper_mode(mode: str) -> tuple[bool, str | None]:
    if mode.lower() != "paper":
        return False, "Strategy is paper-only. Live trading is blocked."
    return True, None


def get_risk_status() -> dict[str, float | bool | str]:
    with _lock:
        _reset_daily_if_needed()
        return {
            "emergencyStopActive": _state.emergency_stop_active,
            "dailyRealizedPnL": _state.daily_realized_pnl,
            "dailyPnLDate": _state.daily_pnl_date,
            "maxAllocationPerStock": MAX_ALLOCATION_PER_STOCK,
            "maxDailyRealizedLoss": MAX_DAILY_REALIZED_LOSS,
            "maxOpenSymbols": MAX_OPEN_SYMBOLS,
        }
