import type {
  TradeAnalyticsSummary,
  TradeHistoryFilters,
  TradeHistoryRecord,
} from '@/types/tradeHistory'

const DATE_RANGE_DAYS: Record<TradeHistoryFilters['dateRange'], number | null> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  all: null,
}

export function filterTrades(
  trades: TradeHistoryRecord[],
  filters: TradeHistoryFilters,
): TradeHistoryRecord[] {
  const now = new Date('2026-06-06T12:00:00Z')
  const rangeDays = DATE_RANGE_DAYS[filters.dateRange]

  return trades.filter((trade) => {
    if (rangeDays !== null) {
      const tradeDate = new Date(trade.timestamp)
      const diffDays = (now.getTime() - tradeDate.getTime()) / (1000 * 60 * 60 * 24)
      if (diffDays > rangeDays) return false
    }

    if (filters.symbol !== 'all' && trade.symbol !== filters.symbol) return false
    if (filters.strategy !== 'all' && trade.strategy !== filters.strategy) return false
    if (filters.status !== 'all' && trade.status !== filters.status) return false
    if (filters.pnlFilter === 'profit' && trade.realizedPnL <= 0) return false
    if (filters.pnlFilter === 'loss' && trade.realizedPnL >= 0) return false

    return true
  })
}

export function computeAnalytics(trades: TradeHistoryRecord[]): TradeAnalyticsSummary {
  const closedTrades = trades.filter((t) => t.status !== 'cancelled')
  const winners = closedTrades.filter((t) => t.realizedPnL > 0)
  const losers = closedTrades.filter((t) => t.realizedPnL < 0)

  const totalProfit = winners.reduce((sum, t) => sum + t.realizedPnL, 0)
  const totalLoss = Math.abs(losers.reduce((sum, t) => sum + t.realizedPnL, 0))

  const averageProfit = winners.length > 0 ? totalProfit / winners.length : 0
  const averageLoss = losers.length > 0 ? totalLoss / losers.length : 0
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 999 : 0

  return {
    totalTrades: closedTrades.length,
    winningTrades: winners.length,
    losingTrades: losers.length,
    winRate: closedTrades.length > 0 ? (winners.length / closedTrades.length) * 100 : 0,
    averageProfit,
    averageLoss,
    profitFactor,
    maxDrawdown: 8.4,
  }
}
