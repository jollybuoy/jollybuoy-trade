# Trading Service — IB Gateway Connection Test

Minimal Python setup to verify connectivity to **Interactive Brokers Paper Trading** via IB Gateway.

## Prerequisites

- IB Gateway running in **Paper Trading** mode
- API settings:
  - **Socket Port:** `4002`
  - **Read-Only API:** Disabled
- Logged into your paper account in IB Gateway before running the test

## 1. Create a Python virtual environment

From the project root:

```bash
cd trading-service
python3 -m venv .venv
```

Activate the virtual environment:

**macOS / Linux**

```bash
source .venv/bin/activate
```

**Windows (PowerShell)**

```powershell
.venv\Scripts\Activate.ps1
```

You should see `(.venv)` in your shell prompt.

## 2. Install dependencies

With the virtual environment activated:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs `ib_insync`.

## 3. Run the connection test

Make sure IB Gateway is open, logged in, and listening on port **4002**, then run:

```bash
python test_ibkr.py
```

### Expected success output

```
Connecting to IB Gateway at 127.0.0.1:4002 (clientId=1)...
Connection status: Connected
Managed accounts: DUxxxxxxx
Account summary:
  BuyingPower: ...
  TotalCashValue: ...
  ...
Buying power: ...
Cash balance: ...

Disconnected cleanly.
```

### Common errors

| Message | Likely cause |
|--------|----------------|
| Connection refused | IB Gateway is not running, or port is not 4002 |
| Connection timed out | Gateway is open but API is disabled or blocked |
| Login expired / session invalid | IB Gateway login expired — log in again |

## 4. Run the local IBKR API for the React portal

With IB Gateway logged into Paper Trading on port **4002**:

```bash
uvicorn main:app --reload --port 8000
```

Endpoints:

- `GET /health`
- `GET /api/ibkr/status`
- `GET /api/ibkr/account`
- `GET /api/ibkr/positions`
- `GET /api/ibkr/open-orders`

The React app reads this service through `VITE_IBKR_API_URL=http://localhost:8000`.

This API is **read-only** and returns IBKR **paper account** data only.

## 5. Deactivate the virtual environment

When finished:

```bash
deactivate
```
