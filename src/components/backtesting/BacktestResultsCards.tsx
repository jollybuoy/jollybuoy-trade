import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { BacktestMetrics } from '@/types/backtesting'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

interface BacktestResultsCardsProps {
  metrics: BacktestMetrics
}

export function BacktestResultsCards({ metrics }: BacktestResultsCardsProps) {
  const cards = [
    {
      label: 'Total Return',
      value: formatCurrency(metrics.totalReturn),
      sub: formatPercent(metrics.totalReturnPercent),
      tone: 'positive' as const,
    },
    {
      label: 'Win Rate',
      value: `${metrics.winRate.toFixed(1)}%`,
      tone: 'ai' as const,
    },
    {
      label: 'Profit Factor',
      value: metrics.profitFactor.toFixed(2),
      tone: 'ai' as const,
    },
    {
      label: 'Max Drawdown',
      value: `−${metrics.maxDrawdown.toFixed(1)}%`,
      tone: 'negative' as const,
    },
    {
      label: 'Sharpe Ratio',
      value: metrics.sharpeRatio.toFixed(2),
      tone: 'default' as const,
    },
    {
      label: 'Total Trades',
      value: String(metrics.totalTrades),
      tone: 'default' as const,
    },
  ]

  return (
    <TerminalCard padding="sm">
      <TerminalCardHeader
        title="Backtest Results"
        description="Simulated performance metrics — mock data only"
        badge={
          <span className="rounded-md border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent">
            Complete
          </span>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-border-subtle bg-surface/40 px-3 py-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {card.label}
            </p>
            <p
              className={cn(
                'mt-1 font-mono text-lg font-bold',
                card.tone === 'positive' && 'text-accent',
                card.tone === 'negative' && 'text-danger',
                card.tone === 'ai' && 'text-ai',
                card.tone === 'default' && 'text-text-primary',
              )}
            >
              {card.value}
            </p>
            {card.sub && (
              <p className="font-mono text-[10px] text-accent">{card.sub}</p>
            )}
          </div>
        ))}
      </div>
    </TerminalCard>
  )
}
