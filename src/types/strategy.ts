export type StrategyType =
  | 'momentum'
  | 'mean_reversion'
  | 'breakout'
  | 'swing_trading'
  | 'ai_strategy'
  | 'options_strategy'

export type EntryRule =
  | 'rsi'
  | 'macd'
  | 'ma_cross'
  | 'price_breakout'
  | 'volume_spike'

export type ExecutionMode = 'paper' | 'live'

export interface StrategyRiskConfig {
  positionSize: number
  stopLossPercent: number
  takeProfitPercent: number
  maxDailyLoss: number
}

export interface StrategyConfig {
  name: string
  type: StrategyType
  entryRules: EntryRule[]
  risk: StrategyRiskConfig
  executionMode: ExecutionMode
}

export interface BacktestResults {
  totalReturn: number
  totalReturnPercent: number
  winRate: number
  profitFactor: number
  maxDrawdown: number
  totalTrades: number
  sharpeRatio: number
  avgWin: number
  avgLoss: number
  equityCurve: { date: string; value: number }[]
}

export interface StrategyTypeOption {
  id: StrategyType
  label: string
  description: string
  tag: string
}

export interface EntryRuleOption {
  id: EntryRule
  label: string
  description: string
  defaultParams: string
}
