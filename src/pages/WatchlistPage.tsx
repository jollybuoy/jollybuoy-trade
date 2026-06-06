import { Plus, Star } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { watchlist } from '@/data/mockData'
import { formatCurrency, formatPercent, formatNumber, getChangeColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function WatchlistPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Watchlist"
        description="Monitor symbols you're tracking"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-muted"
          >
            <Plus className="h-4 w-4" />
            Add Symbol
          </button>
        }
      />

      <Card padding="none">
        <DataTable
          data={watchlist}
          keyExtractor={(item) => item.symbol}
          columns={[
            {
              key: 'symbol',
              header: 'Symbol',
              render: (item) => (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-warning" />
                  <div>
                    <p className="font-semibold">{item.symbol}</p>
                    <p className="text-xs text-text-secondary">{item.name}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'price',
              header: 'Last Price',
              align: 'right',
              render: (item) => (
                <span className="font-mono font-medium">{formatCurrency(item.price)}</span>
              ),
            },
            {
              key: 'change',
              header: 'Change',
              align: 'right',
              render: (item) => (
                <span className={cn('font-mono', getChangeColor(item.change))}>
                  {item.change > 0 ? '+' : ''}
                  {formatCurrency(item.change)}
                </span>
              ),
            },
            {
              key: 'changePercent',
              header: '% Change',
              align: 'right',
              render: (item) => (
                <span
                  className={cn(
                    'inline-flex rounded-md px-2 py-0.5 font-mono text-xs font-medium',
                    item.changePercent >= 0
                      ? 'bg-accent/10 text-accent'
                      : 'bg-danger/10 text-danger',
                  )}
                >
                  {formatPercent(item.changePercent)}
                </span>
              ),
            },
            {
              key: 'volume',
              header: 'Volume',
              align: 'right',
              render: (item) => (
                <span className="font-mono text-text-secondary">
                  {formatNumber(item.volume)}
                </span>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
