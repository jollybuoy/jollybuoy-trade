import { Filter, RefreshCw, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { TerminalCard } from '@/components/terminal/TerminalCard'
import { MarketScannerWidgets } from '@/components/terminal/MarketScannerWidgets'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/Badge'
import { scannerResults, scannerStats } from '@/data/mockData'
import { formatCurrency, formatPercent, formatNumber, cn } from '@/lib/utils'

const filters = ['All Signals', 'Breakout', 'Momentum', 'Oversold', 'Volume Spike']

const signalHeatmap = [
  { signal: 'Breakout', count: 8, intensity: 85 },
  { signal: 'Momentum', count: 6, intensity: 72 },
  { signal: 'Oversold', count: 5, intensity: 58 },
  { signal: 'Vol Spike', count: 9, intensity: 91 },
]

export function MarketScannerPage() {
  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Market Scanner"
        description="AI-powered multi-factor scan across 4,800+ symbols"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-ai/30 bg-ai/10 px-4 py-2 text-sm font-medium text-ai transition-colors hover:bg-ai/20"
          >
            <RefreshCw className="h-4 w-4" />
            Run Scan
          </button>
        }
      />

      <MarketScannerWidgets stats={scannerStats} />

      <div className="grid gap-6 lg:grid-cols-4">
        <TerminalCard className="lg:col-span-1" padding="sm">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ai" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Signal Heatmap
            </h3>
          </div>
          <div className="space-y-2">
            {signalHeatmap.map((item) => (
              <div key={item.signal}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-text-secondary">{item.signal}</span>
                  <span className="font-mono text-text-primary">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-hover">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ai/60 to-accent/80"
                    style={{ width: `${item.intensity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </TerminalCard>

        <TerminalCard className="lg:col-span-3" padding="sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-text-muted" />
            {filters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  index === 0
                    ? 'bg-ai/10 text-ai border border-ai/20'
                    : 'border border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <DataTable
              data={scannerResults}
              keyExtractor={(item) => item.symbol}
              columns={[
                {
                  key: 'score',
                  header: 'AI Score',
                  render: (item) => (
                    <div className="relative flex h-10 w-10 items-center justify-center">
                      <svg className="absolute inset-0 h-10 w-10 -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke="#141b24"
                          strokeWidth="3"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke={item.score >= 85 ? '#22d3a5' : item.score >= 75 ? '#5b9dff' : '#f5a623'}
                          strokeWidth="3"
                          strokeDasharray={`${(item.score / 100) * 100.5} 100.5`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="font-mono text-xs font-bold">{item.score}</span>
                    </div>
                  ),
                },
                {
                  key: 'symbol',
                  header: 'Symbol',
                  render: (item) => (
                    <div>
                      <p className="font-bold text-text-primary">{item.symbol}</p>
                      <p className="text-[11px] text-text-muted">{item.name}</p>
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
                    <span className="font-mono font-medium">{formatCurrency(item.price)}</span>
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
                        item.changePercent >= 0 ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger',
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
                    <span className="font-mono text-xs text-text-secondary">
                      {formatNumber(item.volume)}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </TerminalCard>
      </div>
    </div>
  )
}
