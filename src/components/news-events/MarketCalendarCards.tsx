import {
  Banknote,
  BarChart3,
  Building2,
  Calendar,
  Landmark,
  Rocket,
  Scissors,
  TrendingUp,
} from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { MarketCalendarSummary } from '@/types/newsEvents'
import { cn } from '@/lib/utils'

interface MarketCalendarCardsProps {
  summary: MarketCalendarSummary
}

const cardConfig = [
  { key: 'earningsToday' as const, label: 'Earnings Today', icon: TrendingUp, tone: 'accent' },
  { key: 'iposThisWeek' as const, label: 'IPOs This Week', icon: Rocket, tone: 'ai' },
  { key: 'fedEvents' as const, label: 'Fed Events', icon: Landmark, tone: 'warning' },
  { key: 'cpiInflation' as const, label: 'CPI / Inflation', icon: BarChart3, tone: 'danger' },
  { key: 'jobsReport' as const, label: 'Jobs Report', icon: Building2, tone: 'warning' },
  { key: 'stockSplits' as const, label: 'Stock Splits', icon: Scissors, tone: 'neutral' },
  { key: 'dividendDates' as const, label: 'Dividend Dates', icon: Banknote, tone: 'neutral' },
]

const toneStyles = {
  accent: { box: 'border-accent/20 bg-accent/5', value: 'text-accent', icon: 'text-accent' },
  ai: { box: 'border-ai/20 bg-ai/5', value: 'text-ai', icon: 'text-ai' },
  warning: { box: 'border-warning/20 bg-warning/5', value: 'text-warning', icon: 'text-warning' },
  danger: { box: 'border-danger/20 bg-danger/5', value: 'text-danger', icon: 'text-danger' },
  neutral: { box: 'border-border-subtle bg-surface/40', value: 'text-text-primary', icon: 'text-text-muted' },
}

export function MarketCalendarCards({ summary }: MarketCalendarCardsProps) {
  return (
    <TerminalCard padding="sm">
      <TerminalCardHeader
        title="Market Calendar"
        description="Upcoming macro, corporate, and dividend events (mock)"
        badge={
          <span className="inline-flex items-center gap-1 rounded-md border border-ai/20 bg-ai/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-ai">
            <Calendar className="h-3 w-3" />
            Jun 6–10
          </span>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {cardConfig.map(({ key, label, icon: Icon, tone }) => {
          const style = toneStyles[tone as keyof typeof toneStyles]
          return (
            <div key={key} className={cn('rounded-lg border p-3', style.box)}>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  {label}
                </p>
                <Icon className={cn('h-3.5 w-3.5', style.icon)} />
              </div>
              <p className={cn('mt-1.5 font-mono text-xl font-bold', style.value)}>
                {summary[key]}
              </p>
            </div>
          )
        })}
      </div>
    </TerminalCard>
  )
}
