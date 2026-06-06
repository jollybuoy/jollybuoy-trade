import {
  Eye,
  OctagonAlert,
  Pause,
  ShieldAlert,
  TrendingDown,
} from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { AiActionSuggestion } from '@/types/aiAssistant'
import { cn } from '@/lib/utils'

interface AiActionSuggestionsProps {
  suggestions: AiActionSuggestion[]
  onAction: (suggestion: AiActionSuggestion) => void
}

const actionIcons = {
  pause_strategy: Pause,
  reduce_size: TrendingDown,
  add_stop_loss: ShieldAlert,
  review_trades: Eye,
}

const priorityStyles = {
  high: 'border-danger/20 bg-danger/5 text-danger',
  medium: 'border-warning/20 bg-warning/5 text-warning',
  low: 'border-border-subtle bg-surface/40 text-text-muted',
}

export function AiActionSuggestions({ suggestions, onAction }: AiActionSuggestionsProps) {
  return (
    <TerminalCard>
      <TerminalCardHeader
        title="AI Action Suggestions"
        description="Optional workflow steps — simulated only"
        badge={
          <span className="inline-flex items-center gap-1 rounded-md border border-warning/20 bg-warning/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-warning">
            <OctagonAlert className="h-3 w-3" />
            Not advice
          </span>
        }
      />

      <div className="space-y-2">
        {suggestions.map((suggestion) => {
          const Icon = actionIcons[suggestion.actionType]

          return (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => onAction(suggestion)}
              className="flex w-full items-start gap-3 rounded-lg border border-border-subtle bg-surface/30 p-3 text-left transition-colors hover:border-ai/30 hover:bg-ai/5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ai/10 text-ai">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary">
                    {suggestion.label}
                  </p>
                  <span
                    className={cn(
                      'rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                      priorityStyles[suggestion.priority],
                    )}
                  >
                    {suggestion.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  {suggestion.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-text-muted">
        Suggestions are generated from mock data. Review your risk settings and paper account
        before making changes. Not financial advice.
      </p>
    </TerminalCard>
  )
}
