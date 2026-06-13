from __future__ import annotations

import logging
import os
import threading
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from typing import Any, Callable, TypeVar

from ib_insync import IB

HOST = os.getenv("IBKR_HOST", "127.0.0.1")
CONNECT_TIMEOUT = int(os.getenv("IBKR_CONNECT_TIMEOUT", "10"))
HEARTBEAT_INTERVAL_SECONDS = int(os.getenv("IBKR_HEARTBEAT_INTERVAL", "30"))

MODE_PORTS = {
    "paper": int(os.getenv("IBKR_PAPER_PORT", "4002")),
    "live": int(os.getenv("IBKR_LIVE_PORT", "4001")),
}

LOGIN_EXPIRED_CODES = {504, 1100, 1101, 1102, 10197}
READONLY_ERROR_CODES = {321, 103, 104}
CLIENT_ID_IN_USE_CODE = 326


def default_client_id() -> int:
    env_value = os.getenv("IBKR_CLIENT_ID")
    if env_value:
        return int(env_value)
    return 100 + (os.getpid() % 800)

logger = logging.getLogger("ibkr.connection")

T = TypeVar("T")


def ensure_event_loop() -> None:
    import asyncio

    try:
        asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class IbkrConnectionManager:
    """Singleton IB Gateway connection reused across all API requests."""

    _instance: IbkrConnectionManager | None = None
    _instance_lock = threading.Lock()

    def __init__(self) -> None:
        self._ib = IB()
        self._lock = threading.RLock()
        self._executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="ibkr-connection")
        self._session_enabled = False
        self._session_error: str | None = None
        self._error_handler_registered = False
        self._disconnect_handler_registered = False
        self._account: str | None = None
        self._last_heartbeat: str | None = None
        self._last_error: str | None = None
        self._client_id = default_client_id()
        self._host = HOST
        self._port = MODE_PORTS["paper"]
        self._mode = os.getenv("IBKR_MODE", "paper")

    @classmethod
    def get_instance(cls) -> IbkrConnectionManager:
        if cls._instance is None:
            with cls._instance_lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    @property
    def client_id(self) -> int:
        return self._client_id

    @property
    def host(self) -> str:
        return self._host

    @property
    def port(self) -> int:
        return self._port

    @property
    def mode(self) -> str:
        return self._mode

    @property
    def session_enabled(self) -> bool:
        return self._session_enabled

    @property
    def last_heartbeat(self) -> str | None:
        return self._last_heartbeat

    @property
    def account(self) -> str | None:
        return self._account

    @property
    def last_error(self) -> str | None:
        return self._last_error

    def is_connected(self) -> bool:
        return self._ib.isConnected()

    def _run_sync(self, fn: Callable[[], T], timeout: int | None = None) -> T:
        future = self._executor.submit(fn)
        return future.result(timeout=timeout or CONNECT_TIMEOUT + 30)

    def initialize(self) -> None:
        def task() -> None:
            ensure_event_loop()
            self._ensure_error_handler()

        self._run_sync(task, timeout=10)
        logger.info("IB connection manager initialized")

    def startup_connect(self) -> None:
        """Connect once when the FastAPI application starts."""
        self._session_enabled = True

        def task() -> None:
            ensure_event_loop()
            self._connect_once()

        try:
            self._run_sync(task)
        except Exception as exc:  # noqa: BLE001
            self._last_error = str(exc)
            logger.warning("Startup connect failed: %s", exc)

    def shutdown(self) -> None:
        def task() -> None:
            ensure_event_loop()
            with self._lock:
                if self._ib.isConnected():
                    self._ib.disconnect()
                    logger.info("disconnected")

        try:
            self._run_sync(task, timeout=10)
        finally:
            self._executor.shutdown(wait=False, cancel_futures=True)

    def enable_session(self, mode: str) -> None:
        normalized = mode.lower().strip()
        if normalized not in MODE_PORTS:
            raise ValueError(f"Unsupported mode: {mode}")

        def task() -> None:
            ensure_event_loop()
            with self._lock:
                port_changed = self._port != MODE_PORTS[normalized]
                self._mode = normalized
                self._port = MODE_PORTS[normalized]
                self._host = HOST
                self._session_enabled = True

                if port_changed and self._ib.isConnected():
                    self._disconnect_internal("mode_changed")
                    self._connect_once(reconnecting=True)
                elif not self._ib.isConnected():
                    self._connect_once()
                else:
                    self._touch_heartbeat()

        self._run_sync(task)

    def disable_session(self) -> None:
        def task() -> None:
            ensure_event_loop()
            with self._lock:
                self._session_enabled = False
                self._disconnect_internal("user_disconnected")
                self._account = None
                self._last_heartbeat = None

        self._run_sync(task, timeout=10)

    def heartbeat_check(self) -> dict[str, Any]:
        """Background task: verify connection and reconnect only when disconnected."""
        if not self._session_enabled:
            return self.status_payload()

        def task() -> dict[str, Any]:
            ensure_event_loop()
            with self._lock:
                if self._ib.isConnected():
                    if self._touch_heartbeat():
                        return self._status_locked()
                    self._disconnect_internal("heartbeat_failed")

                if not self._ib.isConnected():
                    try:
                        self._connect_once(reconnecting=True)
                    except Exception as exc:  # noqa: BLE001
                        self._last_error = str(exc)
                        logger.warning("Reconnect failed: %s", exc)

                return self._status_locked()

        return self._run_sync(task)

    def run(self, operation: Callable[[IB], T]) -> T:
        """Run an IB operation on the existing connection without reconnecting."""
        if not self._session_enabled:
            raise RuntimeError("IBKR account is disconnected. Connect in Settings.")

        def task() -> T:
            ensure_event_loop()
            with self._lock:
                if not self._ib.isConnected():
                    raise RuntimeError("IB Gateway connection is down. Reconnect is in progress.")
                return operation(self._ib)

        return self._run_sync(task)

    def status_payload(self) -> dict[str, Any]:
        with self._lock:
            return self._status_locked()

    def heartbeat_payload(self) -> dict[str, Any]:
        with self._lock:
            connected = self._ib.isConnected()
            payload = {
                "connected": connected,
                "clientId": self._client_id,
                "account": self._account,
                "lastHeartbeat": self._last_heartbeat,
                "mode": self._mode,
                "host": self._host,
                "port": self._port,
            }
            if self._last_error and not connected:
                payload["error"] = self._last_error
            return payload

    def _status_locked(self) -> dict[str, Any]:
        connected = self._session_enabled and self._ib.isConnected()
        payload: dict[str, Any] = {
            "connected": connected,
            "clientId": self._client_id,
            "account": self._account if connected else None,
            "lastHeartbeat": self._last_heartbeat if connected else None,
            "mode": self._mode,
            "host": self._host,
            "port": self._port,
        }

        if not self._session_enabled:
            payload["error"] = "Account disconnected. Click Connect in Settings."
            payload["errorCode"] = "user_disconnected"
        elif not connected:
            payload["error"] = self._last_error or "IB Gateway connection is down. Reconnect is in progress."
            payload["errorCode"] = "disconnected"
        elif self._session_error:
            payload["error"] = self._session_error
            payload["errorCode"] = "not_logged_in"

        return payload

    def _ensure_error_handler(self) -> None:
        if self._error_handler_registered:
            return

        def on_error(_req_id: int, error_code: int, error_string: str, _contract: Any) -> None:
            if error_code in LOGIN_EXPIRED_CODES:
                self._session_error = f"{error_code}: {error_string}"
            if error_code in READONLY_ERROR_CODES and "read-only" in error_string.lower():
                self._session_error = f"{error_code}: {error_string}"
            if error_code == CLIENT_ID_IN_USE_CODE:
                self._session_error = f"{error_code}: {error_string}"
                self._last_error = error_string

        self._ib.errorEvent += on_error
        self._error_handler_registered = True

    def _ensure_disconnect_handler(self) -> None:
        if self._disconnect_handler_registered:
            return

        def on_disconnected() -> None:
            self._last_error = "IB Gateway connection lost"
            logger.info("disconnected reason=ib_gateway_event")

        self._ib.disconnectedEvent += on_disconnected
        self._disconnect_handler_registered = True

    def _connect_once(self, *, reconnecting: bool = False) -> None:
        if self._ib.isConnected():
            self._touch_heartbeat()
            return

        self._ensure_error_handler()
        self._ensure_disconnect_handler()

        last_error: Exception | None = None
        for attempt in range(5):
            client_id = self._client_id
            self._session_error = None
            self._last_error = None

            if reconnecting or attempt > 0:
                logger.info(
                    "reconnecting host=%s port=%s clientId=%s mode=%s attempt=%s",
                    self._host,
                    self._port,
                    client_id,
                    self._mode,
                    attempt + 1,
                )

            try:
                if self._ib.isConnected():
                    self._disconnect_internal("connect_retry")

                self._ib.connect(
                    self._host,
                    self._port,
                    clientId=client_id,
                    timeout=CONNECT_TIMEOUT,
                )
                self._ib.sleep(0.5)

                if self._session_error:
                    raise RuntimeError(self._session_error)
                if not self._ib.isConnected():
                    raise RuntimeError("IB Gateway closed the connection during login")

                accounts = self._ib.managedAccounts()
                self._account = accounts[0] if accounts else None
                self._last_heartbeat = utc_now_iso()
                logger.info(
                    "connected host=%s port=%s clientId=%s account=%s",
                    self._host,
                    self._port,
                    client_id,
                    self._account,
                )
                return
            except Exception as exc:  # noqa: BLE001
                last_error = exc
                self._disconnect_internal("connect_failed")
                message = str(exc).lower()
                session_message = (self._session_error or "").lower()
                if (
                    "326" in session_message
                    or "client id" in session_message
                    or "client id" in message
                    or "already in use" in message
                ):
                    self._client_id = client_id + 1
                    logger.warning(
                        "client id %s in use, retrying with clientId=%s",
                        client_id,
                        self._client_id,
                    )
                    continue
                raise

        raise RuntimeError(str(last_error) if last_error else "Failed to connect to IB Gateway")

    def _disconnect_internal(self, reason: str) -> None:
        if self._ib.isConnected():
            self._ib.disconnect()
            logger.info("disconnected reason=%s", reason)

    def _touch_heartbeat(self) -> bool:
        try:
            self._ib.reqCurrentTime()
            accounts = self._ib.managedAccounts()
            self._account = accounts[0] if accounts else self._account
            self._last_heartbeat = utc_now_iso()
            self._last_error = None
            return True
        except Exception as exc:  # noqa: BLE001
            self._last_error = str(exc)
            return False


_manager = IbkrConnectionManager.get_instance()


def get_manager() -> IbkrConnectionManager:
    return _manager
