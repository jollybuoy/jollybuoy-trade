import { Plus, Play, Pause } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { strategies } from '@/data/mockData'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export function StrategiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategies"
        description="Manage your automated trading strategies"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-accent-muted"
          >
            <Plus className="h-4 w-4" />
            New Strategy
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {strategies.map((strategy) => (
          <Card key={strategy.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-primary">{strategy.name}</h3>
                  <StatusBadge status={strategy.status} />
                </div>
                <p className="mt-1 text-sm text-text-secondary">{strategy.description}</p>
              </div>
              <div className="flex gap-1">
                {strategy.status === 'active' ? (
                  <button
                    type="button"
                    className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-warning"
                    aria-label="Pause strategy"
                  >
                    <Pause className="h-4 w-4" />
                  </button>
                ) : strategy.status !== 'draft' ? (
                  <button
                    type="button"
                    className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-accent"
                    aria-label="Start strategy"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border-subtle pt-4">
              <div>
                <p className="text-xs text-text-muted">Win Rate</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-text-primary">
                  {strategy.winRate > 0 ? `${strategy.winRate}%` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Trades</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-text-primary">
                  {strategy.totalTrades}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">P&L</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-accent">
                  {strategy.pnl > 0 ? formatCurrency(strategy.pnl) : '—'}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-text-muted">
              Last run: {formatDateTime(strategy.lastRun)}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Strategy Types"
          description="Available strategy templates for your portfolio"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'Momentum', desc: 'Ride trending stocks with volume' },
            { name: 'Mean Reversion', desc: 'Buy dips, sell rips on RSI' },
            { name: 'Breakout', desc: 'Enter on resistance breaks' },
            { name: 'AI Sentiment', desc: 'NLP-driven signal generation' },
          ].map((type) => (
            <div
              key={type.name}
              className="rounded-lg border border-border-subtle bg-surface-hover/50 p-4 transition-colors hover:border-border hover:bg-surface-hover"
            >
              <p className="font-medium text-text-primary">{type.name}</p>
              <p className="mt-1 text-xs text-text-secondary">{type.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
