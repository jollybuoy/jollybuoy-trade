import { AlertTriangle, BrainCircuit, Sparkles, TrendingUp } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { AiInsight } from '@/types/scanner'
import { cn } from '@/lib/utils'

const insightStyles = {
  setup: {
    icon: TrendingUp,
    border: 'border-accent/20',
    bg: 'bg-accent/5',
    iconColor: 'text-accent',
  },
  activity: {
    icon: Sparkles,
    border: 'border-ai/20',
    bg: 'bg-ai/5',
    iconColor: 'text-ai',
  },
  risk: {
    icon: AlertTriangle,
    border: 'border-warning/20',
    bg: 'bg-warning/5',
    iconColor: 'text-warning',
  },
}

interface AiInsightPanelProps {
  insights: AiInsight[]
}

export function AiInsightPanel({ insights }: AiInsightPanelProps) {
  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="AI Insights"
        description="Real-time market intelligence"
        badge={
          <span className="inline-flex items-center gap-1 rounded bg-ai/10 px-1.5 py-0.5 text-[10px] font-medium text-ai">
            <BrainCircuit className="h-3 w-3" />
            LIVE
          </span>
        }
      />

      <div className="space-y-3">
        {insights.map((insight) => {
          const style = insightStyles[insight.type]
          const Icon = style.icon

          return (
            <div
              key={insight.id}
              className={cn(
                'rounded-xl border p-4 transition-colors',
                style.border,
                style.bg,
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('rounded-lg bg-surface/60 p-2', style.iconColor)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{insight.title}</p>
                  {insight.symbol && (
                    <span className="mt-1 inline-block rounded bg-surface-hover px-1.5 py-0.5 font-mono text-[10px] font-bold text-ai">
                      {insight.symbol}
                    </span>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {insight.body}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </TerminalCard>
  )
}
