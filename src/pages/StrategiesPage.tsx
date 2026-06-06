import { Play, Pause, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { TerminalCard } from '@/components/terminal/TerminalCard'
import { AdvancedStrategyBuilder } from '@/components/terminal/AdvancedStrategyBuilder'
import { StatusBadge } from '@/components/ui/Badge'
import { strategies } from '@/data/mockData'
import { formatCurrency, formatDateTime, cn } from '@/lib/utils'

export function StrategiesPage() {
  return (
    <div className="terminal-grid space-y-8">
      <PageHeader
        title="Strategy Builder"
        description="Design entry logic, risk parameters, and backtest before deployment"
      />

      <AdvancedStrategyBuilder />

      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-ai" />
          <h2 className="text-sm font-semibold text-text-primary">Deployed Strategies</h2>
          <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium text-text-muted">
            {strategies.length} total
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {strategies.map((strategy) => (
            <TerminalCard
              key={strategy.id}
              className={cn(
                'transition-colors hover:border-ai/15',
                strategy.status === 'active' && 'border-accent/20',
              )}
            >
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
                      className="rounded-lg border border-border-subtle p-2 text-text-secondary hover:border-warning/30 hover:text-warning"
                      aria-label="Pause strategy"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  ) : strategy.status !== 'draft' ? (
                    <button
                      type="button"
                      className="rounded-lg border border-border-subtle p-2 text-text-secondary hover:border-accent/30 hover:text-accent"
                      aria-label="Start strategy"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3 border-t border-border-subtle pt-4">
                <Metric label="Win Rate" value={strategy.winRate > 0 ? `${strategy.winRate}%` : '—'} />
                <Metric label="Trades" value={String(strategy.totalTrades)} />
                <Metric
                  label="P&L"
                  value={strategy.pnl > 0 ? formatCurrency(strategy.pnl) : '—'}
                  highlight
                />
                <Metric label="Type" value={strategy.type.replace('_', ' ')} small />
              </div>

              <p className="mt-3 font-mono text-[10px] text-text-muted">
                Last run: {formatDateTime(strategy.lastRun)}
              </p>
            </TerminalCard>
          ))}
        </div>
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  highlight,
  small,
}: {
  label: string
  value: string
  highlight?: boolean
  small?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-text-muted">{label}</p>
      <p
        className={cn(
          'mt-0.5 font-mono font-semibold capitalize',
          small ? 'text-[11px]' : 'text-sm',
          highlight ? 'text-accent' : 'text-text-primary',
        )}
      >
        {value}
      </p>
    </div>
  )
}
