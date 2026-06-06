import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { ExplainedTrade } from '@/types/aiAssistant'
import { cn, formatDateTime } from '@/lib/utils'

interface TradeExplanationPanelProps {
  trades: ExplainedTrade[]
}

export function TradeExplanationPanel({ trades }: TradeExplanationPanelProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Trade Explanations"
          description="Simulated reasoning for your last 5 paper trades"
        />
      </div>

      <div className="divide-y divide-border-subtle/60">
        {trades.map((trade) => (
          <div key={trade.id} className="p-5 transition-colors hover:bg-ai/5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    trade.side === 'buy' ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger',
                  )}
                >
                  {trade.side === 'buy' ? (
                    <ArrowUpCircle className="h-5 w-5" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary">{trade.symbol}</span>
                    <span
                      className={cn(
                        'rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                        trade.side === 'buy'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-danger/10 text-danger',
                      )}
                    >
                      {trade.side}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted">
                    {formatDateTime(trade.date)} · {trade.strategy}
                  </p>
                </div>
              </div>
              <RiskScoreBadge score={trade.riskScore} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ReasonBlock label="Entry Reason" text={trade.entryReason} />
              <ReasonBlock label="Exit Reason" text={trade.exitReason} />
            </div>
          </div>
        ))}
      </div>
    </TerminalCard>
  )
}

function ReasonBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/40 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-text-secondary">{text}</p>
    </div>
  )
}

function RiskScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 70 ? 'danger' : score >= 50 ? 'warning' : 'accent'

  const colors = {
    danger: 'border-danger/20 bg-danger/10 text-danger',
    warning: 'border-warning/20 bg-warning/10 text-warning',
    accent: 'border-accent/20 bg-accent/10 text-accent',
  }

  return (
    <div className={cn('rounded-lg border px-3 py-2 text-center', colors[tone])}>
      <p className="text-[10px] font-semibold uppercase tracking-wider">Risk Score</p>
      <p className="font-mono text-lg font-bold">{score}</p>
    </div>
  )
}
