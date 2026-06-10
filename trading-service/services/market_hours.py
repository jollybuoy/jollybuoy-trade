from __future__ import annotations

from datetime import datetime, time
from zoneinfo import ZoneInfo

US_EASTERN = ZoneInfo("America/New_York")
MARKET_OPEN = time(9, 30)
MARKET_CLOSE = time(16, 0)
WEEKDAYS = {0, 1, 2, 3, 4}


def _now_et() -> datetime:
    return datetime.now(US_EASTERN)


def is_us_market_open(now: datetime | None = None) -> bool:
    current = now.astimezone(US_EASTERN) if now else _now_et()
    if current.weekday() not in WEEKDAYS:
        return False
    current_time = current.time()
    return MARKET_OPEN <= current_time < MARKET_CLOSE


def get_market_status(now: datetime | None = None) -> dict[str, str | bool]:
    current = now.astimezone(US_EASTERN) if now else _now_et()
    open_now = is_us_market_open(current)

    if current.weekday() not in WEEKDAYS:
        reason = "Market closed — weekend."
    elif current.time() < MARKET_OPEN:
        reason = "Market closed — opens 9:30 AM ET."
    elif current.time() >= MARKET_CLOSE:
        reason = "Market closed — after 4:00 PM ET."
    else:
        reason = "US regular session open (9:30 AM – 4:00 PM ET)."

    return {
        "open": open_now,
        "timezone": "America/New_York",
        "currentTimeEt": current.strftime("%Y-%m-%d %H:%M:%S %Z"),
        "session": "regular",
        "reason": reason if not open_now else "US market open.",
        "message": "Market closed — strategy paused." if not open_now else "Market open.",
    }
