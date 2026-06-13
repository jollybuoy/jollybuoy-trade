import {
  BarChart3,
  Calendar,
  FileSpreadsheet,
  Shield,
  Target,
  TrendingUp,
} from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { REPORT_TYPE_CARDS } from '@/data/reportsAnalytics'
import type { ReportType } from '@/types/reports'
import { cn, formatDateTime } from '@/lib/utils'

interface ReportTypeCardsProps {
  selectedType: ReportType
  onSelect: (type: ReportType) => void
}

const cardIcons: Record<ReportType, typeof TrendingUp> = {
  daily_trading: TrendingUp,
  weekly_performance: BarChart3,
  monthly_portfolio: Calendar,
  strategy_performance: Target,
  risk: Shield,
  tax_ready: FileSpreadsheet,
}

export function ReportTypeCards({ selectedType, onSelect }: ReportTypeCardsProps) {
  return (
    <TerminalCard padding="sm">
      <TerminalCardHeader
        title="Report Types"
        description="Quick-select a report template to prefill the builder"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {REPORT_TYPE_CARDS.map((card) => {
          const Icon = cardIcons[card.id]
          const active = selectedType === card.id

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelect(card.id)}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                active
                  ? 'border-ai/30 bg-ai/10'
                  : 'border-border-subtle bg-surface/40 hover:border-ai/20 hover:bg-ai/5',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  active ? 'bg-ai/20 text-ai' : 'bg-surface-elevated text-text-muted',
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-2 text-xs font-semibold text-text-primary">{card.title}</p>
              <p className="mt-0.5 line-clamp-2 text-[10px] text-text-muted">{card.description}</p>
              <p className="mt-2 font-mono text-[9px] text-text-muted">
                Last: {formatDateTime(card.lastGenerated)}
              </p>
            </button>
          )
        })}
      </div>
    </TerminalCard>
  )
}
