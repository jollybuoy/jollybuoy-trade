import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/Badge'
import { paperTrades, paperAccount } from '@/data/mockData'
import { formatCurrency, formatPercent, formatDateTime } from '@/lib/utils'

export function PaperTradingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Paper Trading"
        description="Practice trading with virtual money — no risk"
        action={
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/20"
            >
              <ArrowDownCircle className="h-4 w-4" />
              Sell
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-accent-muted"
            >
              <ArrowUpCircle className="h-4 w-4" />
              Buy
            </button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Account Equity"
          value={formatCurrency(paperAccount.equity)}
          change={`${formatPercent(paperAccount.dayPnLPercent)} today`}
          changeValue={paperAccount.dayPnLPercent}
        />
        <StatCard label="Cash Balance" value={formatCurrency(paperAccount.balance)} />
        <StatCard
          label="Day P&L"
          value={formatCurrency(paperAccount.dayPnL)}
          changeValue={paperAccount.dayPnL}
          change={formatPercent(paperAccount.dayPnLPercent)}
        />
        <StatCard
          label="Open Positions"
          value={String(paperAccount.openPositions)}
        />
      </div>

      <Card padding="none">
        <div className="border-b border-border-subtle p-5">
          <CardHeader title="Recent Paper Trades" description="Simulated order history" />
        </div>
        <DataTable
          data={paperTrades}
          keyExtractor={(t) => t.id}
          columns={[
            {
              key: 'timestamp',
              header: 'Time',
              render: (t) => (
                <span className="text-text-secondary">{formatDateTime(t.timestamp)}</span>
              ),
            },
            {
              key: 'symbol',
              header: 'Symbol',
              render: (t) => <span className="font-semibold">{t.symbol}</span>,
            },
            {
              key: 'side',
              header: 'Side',
              render: (t) => <StatusBadge status={t.side} />,
            },
            {
              key: 'quantity',
              header: 'Qty',
              align: 'right',
              render: (t) => <span className="font-mono">{t.quantity}</span>,
            },
            {
              key: 'price',
              header: 'Price',
              align: 'right',
              render: (t) => <span className="font-mono">{formatCurrency(t.price)}</span>,
            },
            {
              key: 'total',
              header: 'Total',
              align: 'right',
              render: (t) => (
                <span className="font-mono">{formatCurrency(t.quantity * t.price)}</span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              align: 'right',
              render: (t) => <StatusBadge status={t.status} />,
            },
          ]}
        />
      </Card>
    </div>
  )
}
