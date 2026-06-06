import {
  TrendingUp,
  Wallet,
  PiggyBank,
  ArrowUpCircle,
  CheckCircle2,
  Activity,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { PortfolioSummary } from '@/types/portfolio'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface PortfolioSummaryCardsProps {
  summary: PortfolioSummary
}

export function PortfolioSummaryCards({ summary }: PortfolioSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <StatCard
        variant="terminal"
        label="Total Portfolio Value"
        value={formatCurrency(summary.totalValue)}
        change={`${formatPercent(summary.dayChangePercent)} today`}
        changeValue={summary.dayChangePercent}
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <StatCard
        variant="terminal"
        label="Cash Balance"
        value={formatCurrency(summary.cashBalance)}
        icon={<Wallet className="h-4 w-4" />}
      />
      <StatCard
        variant="terminal"
        label="Invested Value"
        value={formatCurrency(summary.investedValue)}
        icon={<PiggyBank className="h-4 w-4" />}
      />
      <StatCard
        variant="terminal"
        label="Unrealized P/L"
        value={formatCurrency(summary.unrealizedPnL)}
        change={formatPercent(summary.unrealizedPnLPercent)}
        changeValue={summary.unrealizedPnLPercent}
        icon={<ArrowUpCircle className="h-4 w-4" />}
      />
      <StatCard
        variant="terminal"
        label="Realized P/L"
        value={formatCurrency(summary.realizedPnL)}
        changeValue={summary.realizedPnL}
        icon={<CheckCircle2 className="h-4 w-4" />}
      />
      <StatCard
        variant="terminal"
        label="Day Change"
        value={formatPercent(summary.dayChangePercent)}
        change={formatCurrency(summary.dayChange)}
        changeValue={summary.dayChangePercent}
        icon={<Activity className="h-4 w-4" />}
      />
    </div>
  )
}
