import type { OHLCBar } from '@/services/market/types'

export type StrategySignal = 'BUY' | 'SELL' | 'HOLD'

export type StrategyRiskLevel = 'low' | 'medium' | 'high'

/** Input context passed to every strategy on each bar or tick evaluation. */
export interface StrategyContext {
  symbol: string
  bars: OHLCBar[]
  /** Latest bar index used for signal generation */
  index: number
}

export interface StrategySignalResult {
  signal: StrategySignal
  reason: string
  /** Optional metadata for logging / Supabase audit trail */
  metadata?: Record<string, number | string>
}

/**
 * Core strategy contract.
 * Future Python engine can mirror this interface for cross-language parity.
 */
export interface Strategy {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly riskLevel: StrategyRiskLevel
  generateSignal(context: StrategyContext): StrategySignalResult
}

export interface StrategyDefinition {
  id: string
  name: string
  description: string
  riskLevel: StrategyRiskLevel
  create: () => Strategy
}
