import { Filter, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/Badge'
import { scannerResults } from '@/data/mockData'
import { formatCurrency, formatPercent, formatNumber, getChangeColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

const filters = ['All Signals', 'Breakout', 'Momentum', 'Oversold', 'Volume Spike']

export function MarketScannerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Scanner"
        description="AI-powered scan results across the market"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
          >
            <RefreshCw className="h-4 w-4" />
            Run Scan
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-text-muted" />
        {filters.map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              index === 0
                ? 'bg-accent/10 text-accent'
                : 'bg-surface-elevated text-text-secondary hover:bg-surface-hover hover:text-text-primary',
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <Card padding="none">
        <DataTable
          data={scannerResults}
          keyExtractor={(item) => item.symbol}
          columns={[
            {
              key: 'score',
              header: 'Score',
              render: (item) => (
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold',
                      item.score >= 85
                        ? 'bg-accent/10 text-accent'
                        : item.score >= 75
                          ? 'bg-info/10 text-info'
                          : 'bg-warning/10 text-warning',
                    )}
                  >
                    {item.score}
                  </div>
                </div>
              ),
            },
            {
              key: 'symbol',
              header: 'Symbol',
              render: (item) => (
                <div>
                  <p className="font-semibold">{item.symbol}</p>
                  <p className="text-xs text-text-secondary">{item.name}</p>
                </div>
              ),
            },
            {
              key: 'signal',
              header: 'Signal',
              render: (item) => <StatusBadge status={item.signal} />,
            },
            {
              key: 'price',
              header: 'Price',
              align: 'right',
              render: (item) => (
                <span className="font-mono">{formatCurrency(item.price)}</span>
              ),
            },
            {
              key: 'changePercent',
              header: '% Change',
              align: 'right',
              render: (item) => (
                <span className={cn('font-mono', getChangeColor(item.changePercent))}>
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
