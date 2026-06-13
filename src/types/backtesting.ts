export interface BacktestSetupForm {
  strategyId: string
  symbols: string[]
  startDate: string
  endDate: string
  initialCapital: number
  positionSize: number
  commissionBps: number
  slippageBps: number
}

export interface BacktestMetrics {
  totalReturn: number
  totalReturnPercent: number
  winRate: number
  profitFactor: number
  maxDrawdown: number
  sharpeRatio: number
  totalTrades: number
}

export interface BacktestTrade {
  id: string
  date: string
  symbol: string
  entry: number
  exit: number
  pnl: number
  returnPercent: number
  strategy: string
}

export interface EquityPoint {
  date: string
  value: number
}

export interface DrawdownPoint {
  date: string
  drawdown: number
}

export interface MonthlyReturnPoint {
  month: string
  returnPercent: number
}

export interface StrategyComparisonPoint {
  strategy: string
  returnPercent: number
}

export interface BacktestAiSummary {
  worked: string[]
  failed: string[]
  riskWarning: string
  suggestedImprovement: string
}

export interface AdvancedBacktestResults {
  metrics: BacktestMetrics
  equityCurve: EquityPoint[]
  drawdownSeries: DrawdownPoint[]
  monthlyReturns: MonthlyReturnPoint[]
  strategyComparison: StrategyComparisonPoint[]
  trades: BacktestTrade[]
  aiSummary: BacktestAiSummary
}

export const DEFAULT_BACKTEST_SETUP: BacktestSetupForm = {
  strategyId: 'strat-ai-momentum',
  symbols: ['AAPL', 'NVDA', 'MSFT'],
  startDate: '2025-01-01',
  endDate: '2026-06-01',
  initialCapital: 100_000,
  positionSize: 10_000,
  commissionBps: 5,
  slippageBps: 3,
}
