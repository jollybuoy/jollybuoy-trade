import {
  TrendingUp,
  TrendingDown,
  Target,
  Percent,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart3,
  Activity,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { TradeAnalyticsSummary } from '@/types/tradeHistory'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface TradeAnalyticsCardsProps {
  analytics: TradeAnalyticsSummary
}

export function TradeAnalyticsCards({ analytics }: TradeAnalyticsCardsProps) {
  const winShare =
    analytics.totalTrades > 0
      ? formatPercent((analytics.winningTrades / analytics.totalTrades) * 100, false)
      : '0%'

  const cards = [
    {
      label: 'Total Trades',
      value: String(analytics.totalTrades),
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: 'Winning Trades',
      value: String(analytics.winningTrades),
      change: `${winShare} of total`,
      changeValue: analytics.winningTrades,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: 'Losing Trades',
      value: String(analytics.losingTrades),
      changeValue: -analytics.losingTrades,
      icon: <TrendingDown className="h-4 w-4" />,
    },
    {
      label: 'Win Rate',
      value: `${analytics.winRate.toFixed(1)}%`,
      icon: <Target className="h-4 w-4" />,
    },
    {
      label: 'Average Profit',
      value: formatCurrency(analytics.averageProfit),
      changeValue: analytics.averageProfit,
      icon: <ArrowUpCircle className="h-4 w-4" />,
    },
    {
      label: 'Average Loss',
      value: formatCurrency(analytics.averageLoss),
      changeValue: -Math.abs(analytics.averageLoss),
      icon: <ArrowDownCircle className="h-4 w-4" />,
    },
    {
      label: 'Profit Factor',
      value: analytics.profitFactor.toFixed(2),
      icon: <Percent className="h-4 w-4" />,
    },
    {
      label: 'Max Drawdown',
      value: `−${analytics.maxDrawdown.toFixed(1)}%`,
      changeValue: -analytics.maxDrawdown,
      icon: <Activity className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          variant="terminal"
          label={card.label}
          value={card.value}
          change={card.change}
          changeValue={card.changeValue}
          icon={card.icon}
        />
      ))}
    </div>
  )
}
