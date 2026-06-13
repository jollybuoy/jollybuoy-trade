export type StrategyType =
  | 'ai_momentum'
  | 'mean_reversion'
  | 'breakout'
  | 'options'
  | 'dividend_capture'
  | 'momentum'
  | 'swing_trading'
  | 'ai_strategy'
  | 'options_strategy'

export type StrategyStatus = 'running' | 'paused'

export type RiskLevel = 'low' | 'medium' | 'high'

export type ExecutionMode = 'paper' | 'live'

export interface DeployedStrategy {
  id: string
  name: string
  description: string
  status: StrategyStatus
  mode: ExecutionMode
  winRate: number
  totalPnL: number
  maxDrawdown: number
  riskLevel: RiskLevel
  symbols: string[]
  tradesPerDay: string
}

export interface CreateStrategyForm {
  name: string
  symbol: string
  type: StrategyType
  entryCondition: string
  exitCondition: string
  stopLossPercent: number
  takeProfitPercent: number
  maxPositionSize: number
  maxDailyLoss: number
}

export interface BacktestResults {
  totalReturn: number
  totalReturnPercent: number
  winRate: number
  profitFactor: number
  maxDrawdown: number
  totalTrades: number
  equityCurve: { date: string; value: number }[]
}

export interface StrategyTypeOption {
  id: StrategyType
  label: string
}

export interface ConditionOption {
  id: string
  label: string
}
