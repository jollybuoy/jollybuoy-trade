import { AlertTriangle, BrainCircuit, Eye, Target } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { NewsAiSummary } from '@/types/newsEvents'

interface NewsAiSummaryPanelProps {
  summary: NewsAiSummary
}

export function NewsAiSummaryPanel({ summary }: NewsAiSummaryPanelProps) {
  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="AI Summary"
        description="Simulated event and news intelligence — not financial advice"
        badge={
          <span className="inline-flex items-center gap-1 rounded-md border border-ai/20 bg-ai/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-ai">
            <BrainCircuit className="h-3 w-3" />
            Mock AI
          </span>
        }
      />

      <div className="space-y-4">
        <SummaryBlock
          icon={AlertTriangle}
          title="Today's Biggest Market Risk"
          content={summary.biggestRisk}
        />

        <div className="rounded-lg border border-ai/20 bg-ai/5 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-ai" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ai">
              Events That May Affect Open Positions
            </p>
          </div>
          <ul className="space-y-2">
            {summary.positionImpact.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-xs leading-relaxed text-text-secondary"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ai" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Eye className="h-4 w-4 text-accent" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">
              Stocks to Watch Tomorrow
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {summary.stocksToWatch.map((symbol) => (
              <span
                key={symbol}
                className="rounded-md border border-accent/20 bg-accent/10 px-2 py-1 font-mono text-xs font-bold text-accent"
              >
                {symbol}
              </span>
            ))}
          </div>
        </div>
      </div>
    </TerminalCard>
  )
}

function SummaryBlock({
  icon: Icon,
  title,
  content,
}: {
  icon: typeof AlertTriangle
  title: string
  content: string
}) {
  return (
    <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-warning">
            {title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">{content}</p>
        </div>
      </div>
    </div>
  )
}
