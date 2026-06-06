import {
  TrendingUp,
  Wallet,
  DollarSign,
  BarChart3,
  Layers,
  Gauge,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { PaperAccountSummary } from '@/types/paperTrading'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface PaperAccountSummaryProps {
  account: PaperAccountSummary
}

export function PaperAccountSummaryCards({ account }: PaperAccountSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <StatCard
        variant="terminal"
        label="Account Equity"
        value={formatCurrency(account.equity)}
        change={`${formatPercent(account.dayPnLPercent)} today`}
        changeValue={account.dayPnLPercent}
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <StatCard
        variant="terminal"
        label="Cash Balance"
        value={formatCurrency(account.cashBalance)}
        icon={<Wallet className="h-4 w-4" />}
      />
      <StatCard
        variant="terminal"
        label="Buying Power"
        value={formatCurrency(account.buyingPower)}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <StatCard
        variant="terminal"
        label="Day P/L"
        value={formatCurrency(account.dayPnL)}
        change={formatPercent(account.dayPnLPercent)}
        changeValue={account.dayPnL}
        icon={<BarChart3 className="h-4 w-4" />}
      />
      <StatCard
        variant="terminal"
        label="Open Positions"
        value={String(account.openPositions)}
        icon={<Layers className="h-4 w-4" />}
      />
      <StatCard
        variant="terminal"
        label="Margin Used"
        value={formatCurrency(account.marginUsed)}
        icon={<Gauge className="h-4 w-4" />}
      />
    </div>
  )
}
