export interface Mega7MarketStatus {
  open: boolean
  timezone: string
  currentTimeEt: string
  session: string
  reason: string
  message: string
}

export interface Mega7StrategyLog {
  timestamp: string
  level: string
  message: string
  symbol?: string
  action?: string
}

export interface Mega7StrategyStatus {
  name: string
  mode: 'paper'
  running: boolean
  paused: boolean
  emergencyStop: boolean
  autoTrading?: boolean
  cycleIntervalSeconds?: number
  profitBookPct?: number
  rebuyDipPct?: number
  lastCycleAt: string | null
  universe: string[]
  connected: boolean
  account: string | null
  market: Mega7MarketStatus
  logs: Mega7StrategyLog[]
}

export interface Mega7CycleResult {
  ok: boolean
  reason?: string
  market: Mega7MarketStatus
  results: Array<{ symbol: string; actions: unknown[] }>
  status: Mega7StrategyStatus
}
