import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Wallet,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { IbkrAccount } from '@/types/ibkr'
import { formatCurrency } from '@/lib/utils'

interface AccountPnLSummaryProps {
  account: IbkrAccount | null
  pendingCount: number
  executedCount: number
  connected: boolean
}

export function AccountPnLSummary({
  account,
  pendingCount,
  executedCount,
  connected,
}: AccountPnLSummaryProps) {
  const realized = account?.realizedPnL ?? 0
  const unrealized = account?.unrealizedPnL ?? 0
  const total = realized + unrealized

  const cards = [
    {
      label: 'Realized P/L',
      value: connected ? formatCurrency(realized) : '—',
      changeValue: realized,
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      label: 'Unrealized P/L',
      value: connected ? formatCurrency(unrealized) : '—',
      changeValue: unrealized,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: 'Total P/L',
      value: connected ? formatCurrency(total) : '—',
      changeValue: total,
      icon: total >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />,
    },
    {
      label: 'Pending Orders',
      value: connected ? String(pendingCount) : '—',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: 'Executed Fills',
      value: connected ? String(executedCount) : '—',
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      label: 'Net Liquidation',
      value: connected && account ? formatCurrency(account.netLiquidation) : '—',
      icon: <Wallet className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          variant="terminal"
          label={card.label}
          value={card.value}
          changeValue={card.changeValue}
          icon={card.icon}
        />
      ))}
    </div>
  )
}
