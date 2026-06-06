import { AlertTriangle, BrainCircuit, CheckCircle2, XCircle } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { BacktestAiSummary } from '@/types/backtesting'
import { cn } from '@/lib/utils'

interface BacktestAiSummaryPanelProps {
  summary: BacktestAiSummary
}

export function BacktestAiSummaryPanel({ summary }: BacktestAiSummaryPanelProps) {
  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="AI Summary"
        description="Automated analysis of backtest performance"
        badge={
          <span className="inline-flex items-center gap-1 rounded-md border border-ai/20 bg-ai/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-ai">
            <BrainCircuit className="h-3 w-3" />
            Insights
          </span>
        }
      />

      <div className="space-y-4">
        <InsightBlock
          icon={CheckCircle2}
          title="What Worked"
          items={summary.worked}
          tone="accent"
        />
        <InsightBlock
          icon={XCircle}
          title="What Failed"
          items={summary.failed}
          tone="danger"
        />

        <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-warning">
                Risk Warning
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                {summary.riskWarning}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-ai/20 bg-ai/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ai">
            Suggested Improvement
          </p>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            {summary.suggestedImprovement}
          </p>
        </div>
      </div>
    </TerminalCard>
  )
}

function InsightBlock({
  icon: Icon,
  title,
  items,
  tone,
}: {
  icon: typeof CheckCircle2
  title: string
  items: string[]
  tone: 'accent' | 'danger'
}) {
  const color = tone === 'accent' ? 'text-accent' : 'text-danger'
  const border = tone === 'accent' ? 'border-accent/20 bg-accent/5' : 'border-danger/20 bg-danger/5'

  return (
    <div className={cn('rounded-lg border p-3', border)}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className={cn('h-4 w-4', color)} />
        <p className={cn('text-[10px] font-semibold uppercase tracking-wider', color)}>
          {title}
        </p>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-relaxed text-text-secondary">
            <span className={cn('mt-1.5 h-1 w-1 shrink-0 rounded-full', tone === 'accent' ? 'bg-accent' : 'bg-danger')} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
