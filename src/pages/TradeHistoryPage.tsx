import { Download } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/Badge'
import { tradeHistory } from '@/data/mockData'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export function TradeHistoryPage() {
  const totalVolume = tradeHistory
    .filter((t) => t.status === 'filled' || t.status === 'partial')
    .reduce((sum, t) => sum + t.total, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trade History"
        description="Complete record of all executed trades"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
            Total Trades
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">{tradeHistory.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
            Filled Trades
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">
            {tradeHistory.filter((t) => t.status === 'filled').length}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
            Total Volume
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">{formatCurrency(totalVolume)}</p>
        </Card>
      </div>

      <Card padding="none">
        <DataTable
          data={tradeHistory}
          keyExtractor={(t) => t.id}
          columns={[
            {
              key: 'timestamp',
              header: 'Date',
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
              render: (t) => <span className="font-mono">{formatCurrency(t.total)}</span>,
            },
            {
              key: 'strategy',
              header: 'Strategy',
              render: (t) => (
                <span className="text-text-secondary">{t.strategy ?? 'Manual'}</span>
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
