export type TradeHistoryStatus = 'filled' | 'partial' | 'cancelled' | 'open'

export type PnlFilter = 'all' | 'profit' | 'loss'

export interface TradeHistoryRecord {
  id: string
  timestamp: string
  symbol: string
  strategy: string
  side: 'buy' | 'sell'
  quantity: number
  entryPrice: number
  exitPrice: number
  realizedPnL: number
  returnPercent: number
  status: TradeHistoryStatus
}

export interface TradeAnalyticsSummary {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  averageProfit: number
  averageLoss: number
  profitFactor: number
  maxDrawdown: number
}

export interface TradeHistoryFilters {
  dateRange: '7d' | '30d' | '90d' | 'all'
  symbol: string
  strategy: string
  status: 'all' | TradeHistoryStatus
  pnlFilter: PnlFilter
}

export const DEFAULT_TRADE_FILTERS: TradeHistoryFilters = {
  dateRange: '30d',
  symbol: 'all',
  strategy: 'all',
  status: 'all',
  pnlFilter: 'all',
}

export interface DailyPnLPoint {
  date: string
  pnl: number
}

export interface StrategyPerformance {
  strategy: string
  pnl: number
  trades: number
}
