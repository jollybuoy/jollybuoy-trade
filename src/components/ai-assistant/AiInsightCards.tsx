import {
  AlertTriangle,
  BrainCircuit,
  TrendingDown,
  TrendingUp,
  Shield,
} from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { AiInsightCard } from '@/types/aiAssistant'
import { cn } from '@/lib/utils'

interface AiInsightCardsProps {
  cards: AiInsightCard[]
}

const toneStyles = {
  neutral: {
    icon: Shield,
    border: 'border-border-subtle',
    bg: 'bg-surface/40',
    value: 'text-text-primary',
  },
  positive: {
    icon: TrendingUp,
    border: 'border-accent/20',
    bg: 'bg-accent/5',
    value: 'text-accent',
  },
  negative: {
    icon: TrendingDown,
    border: 'border-danger/20',
    bg: 'bg-danger/5',
    value: 'text-danger',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-warning/20',
    bg: 'bg-warning/5',
    value: 'text-warning',
  },
  ai: {
    icon: BrainCircuit,
    border: 'border-ai/20',
    bg: 'bg-ai/5',
    value: 'text-ai',
  },
}

export function AiInsightCards({ cards }: AiInsightCardsProps) {
  return (
    <TerminalCard padding="sm">
      <TerminalCardHeader
        title="AI Insight Cards"
        description="Simulated snapshot of portfolio and market context"
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {cards.map((card) => {
          const style = toneStyles[card.tone]
          const Icon = style.icon

          return (
            <div
              key={card.id}
              className={cn('rounded-lg border p-3', style.border, style.bg)}
            >
              <div className="flex items-start gap-2.5">
                <div className={cn('rounded-lg bg-surface/60 p-1.5', style.value)}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    {card.title}
                  </p>
                  <p className={cn('mt-0.5 font-mono text-base font-bold', style.value)}>
                    {card.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                    {card.detail}
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
