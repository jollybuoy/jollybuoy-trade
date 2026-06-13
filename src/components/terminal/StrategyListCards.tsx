import { FlaskConical, Pause, Play } from 'lucide-react'
import { TerminalCard } from './TerminalCard'
import type { DeployedStrategy, StrategyStatus } from '@/types/strategy'
import { cn, formatCurrency } from '@/lib/utils'

interface StrategyListCardsProps {
  strategies: DeployedStrategy[]
  onToggleStatus: (id: string) => void
}

const riskStyles: Record<DeployedStrategy['riskLevel'], string> = {
  low: 'bg-accent/10 text-accent border-accent/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-danger/10 text-danger border-danger/20',
}

export function StrategyListCards({ strategies, onToggleStatus }: StrategyListCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onToggle={() => onToggleStatus(strategy.id)}
        />
      ))}
    </div>
  )
}

function StrategyCard({
  strategy,
  onToggle,
}: {
  strategy: DeployedStrategy
  onToggle: () => void
}) {
  const isRunning = strategy.status === 'running'

  return (
    <TerminalCard
      className={cn(
        'transition-all hover:border-ai/15',
        isRunning && 'border-accent/20 terminal-glow-accent',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-text-primary">{strategy.name}</h3>
          {'description' in strategy && strategy.description && (
            <p className="mt-1 text-[11px] leading-relaxed text-text-muted">{strategy.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill status={strategy.status} />
            <span className="inline-flex items-center gap-1 rounded-full border border-info/20 bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
              <FlaskConical className="h-3 w-3" />
              {strategy.mode === 'live' ? 'Live Trading' : 'Paper Trading'}
            </span>
            <span
              className={cn(
                'rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize',
                riskStyles[strategy.riskLevel],
              )}
            >
              {strategy.riskLevel} risk
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
            isRunning
              ? 'border border-warning/30 bg-warning/10 text-warning hover:bg-warning/20'
              : 'border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20',
          )}
        >
          {isRunning ? (
            <>
              <Pause className="h-3.5 w-3.5" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              Start
            </>
          )}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border-subtle pt-4">
        <Metric label="Win Rate" value={`${strategy.winRate}%`} highlight />
        <Metric
          label="Session P/L"
          value={formatCurrency(strategy.totalPnL)}
          positive={strategy.totalPnL >= 0}
        />
        <Metric
          label="Trades/Day"
          value={'tradesPerDay' in strategy ? String(strategy.tradesPerDay) : '—'}
        />
      </div>
    </TerminalCard>
  )
}

function StatusPill({ status }: { status: StrategyStatus }) {
  const isRunning = status === 'running'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
        isRunning ? 'bg-accent/10 text-accent' : 'bg-surface-hover text-text-muted',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isRunning ? 'bg-accent pulse-live' : 'bg-text-muted',
        )}
      />
      {isRunning ? 'Running' : 'Paused'}
    </span>
  )
}

function Metric({
  label,
  value,
  highlight,
  positive,
  negative,
}: {
  label: string
  value: string
  highlight?: boolean
  positive?: boolean
  negative?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-text-muted">{label}</p>
      <p
        className={cn(
          'mt-0.5 font-mono text-sm font-bold',
          highlight && 'text-ai',
          positive && 'text-accent',
          negative && 'text-danger',
          !highlight && !positive && !negative && 'text-text-primary',
        )}
      >
        {value}
      </p>
    </div>
  )
}
