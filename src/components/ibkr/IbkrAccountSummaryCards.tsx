import {
  TrendingUp,
  Wallet,
  DollarSign,
  PiggyBank,
  BarChart3,
  CheckCircle2,
  Layers,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { IbkrAccount } from '@/types/ibkr'
import { formatIbkrCurrency } from '@/services/ibkrMappers'

interface IbkrAccountSummaryCardsProps {
  account: IbkrAccount | null
  loading?: boolean
  connected?: boolean
  openPositions?: number
}

function displayValue(connected: boolean, loading: boolean, value: string): string {
  if (loading) return '…'
  if (!connected) return '—'
  return value
}

export function IbkrAccountSummaryCards({
  account,
  loading = false,
  connected = false,
  openPositions,
}: IbkrAccountSummaryCardsProps) {
  const currency = account?.currency ?? 'USD'

  const cards =
    connected && account
      ? [
          {
            label: 'Net Liquidation',
            value: formatIbkrCurrency(account.netLiquidation, currency),
            change: `Available funds: ${formatIbkrCurrency(account.availableFunds, currency)}`,
            changeValue: account.unrealizedPnL,
            icon: <TrendingUp className="h-4 w-4" />,
          },
          {
            label: 'Cash Balance',
            value: formatIbkrCurrency(account.totalCashValue, currency),
            icon: <Wallet className="h-4 w-4" />,
          },
          {
            label: 'Buying Power',
            value: formatIbkrCurrency(account.buyingPower, currency),
            icon: <DollarSign className="h-4 w-4" />,
          },
          {
            label: 'Gross Position Value',
            value: formatIbkrCurrency(account.grossPositionValue, currency),
            icon: <PiggyBank className="h-4 w-4" />,
          },
          {
            label: 'Unrealized P/L',
            value: formatIbkrCurrency(account.unrealizedPnL, currency),
            changeValue: account.unrealizedPnL,
            icon: <BarChart3 className="h-4 w-4" />,
          },
          {
            label: 'Realized P/L',
            value: formatIbkrCurrency(account.realizedPnL, currency),
            changeValue: account.realizedPnL,
            icon: <CheckCircle2 className="h-4 w-4" />,
          },
        ]
      : [
          { label: 'Net Liquidation', icon: <TrendingUp className="h-4 w-4" /> },
          { label: 'Cash Balance', icon: <Wallet className="h-4 w-4" /> },
          { label: 'Buying Power', icon: <DollarSign className="h-4 w-4" /> },
          { label: 'Gross Position Value', icon: <PiggyBank className="h-4 w-4" /> },
          { label: 'Unrealized P/L', icon: <BarChart3 className="h-4 w-4" /> },
          { label: 'Realized P/L', icon: <CheckCircle2 className="h-4 w-4" /> },
        ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          variant="terminal"
          label={card.label}
          value={displayValue(connected, loading, 'value' in card ? card.value : '—')}
          change={'change' in card ? card.change : undefined}
          changeValue={'changeValue' in card ? card.changeValue : undefined}
          icon={card.icon}
        />
      ))}
      {openPositions !== undefined && (
        <StatCard
          variant="terminal"
          label="Open Positions"
          value={displayValue(connected, loading, String(openPositions))}
          icon={<Layers className="h-4 w-4" />}
        />
      )}
    </div>
  )
}
