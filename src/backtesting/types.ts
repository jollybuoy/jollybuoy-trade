import type { Strategy } from '@/strategies/types'

/** Engine-level backtest types (distinct from UI `src/types/backtesting.ts`). */

export interface BacktestRunInput {
  strategy: Strategy
  symbol: string
  startDate: string
  endDate: string
  initialCapital: number
  /** Fraction of capital deployed per BUY signal (0–1) */
  positionSizePct?: number
}

export interface BacktestRunResult {
  symbol: string
  strategyId: string
  startDate: string
  endDate: string
  initialCapital: number
  finalCapital: number
  totalReturn: number
  totalReturnPercent: number
  winRate: number
  totalTrades: number
  maxDrawdown: number
  maxDrawdownPercent: number
  equityCurve: { date: string; equity: number }[]
}

export interface SimulatedTrade {
  entryDate: string
  exitDate: string
  entryPrice: number
  exitPrice: number
  quantity: number
  pnl: number
  returnPercent: number
}
