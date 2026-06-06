import {
  Filter,
  BarChart3,
  TrendingUp,
  ArrowUpCircle,
  Shield,
  Plus,
  GripVertical,
  Play,
  Save,
} from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from './TerminalCard'
import type { StrategyBlock } from '@/types'
import { cn } from '@/lib/utils'

const iconMap: Record<string, typeof Filter> = {
  filter: Filter,
  'bar-chart': BarChart3,
  'trending-up': TrendingUp,
  'arrow-up': ArrowUpCircle,
  shield: Shield,
}

const typeStyles = {
  condition: 'border-info/30 bg-info/5 text-info',
  filter: 'border-ai/30 bg-ai/5 text-ai',
  action: 'border-accent/30 bg-accent/5 text-accent',
}

interface StrategyBuilderProps {
  blocks: StrategyBlock[]
}

export function StrategyBuilder({ blocks }: StrategyBuilderProps) {
  return (
    <TerminalCard glow="ai" className="relative">
      <TerminalCardHeader
        title="Strategy Builder"
        description="Drag-and-drop logic blocks · AI-assisted"
        action={
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <Save className="h-3.5 w-3.5" />
              Save Draft
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-surface transition-colors hover:bg-accent-muted"
            >
              <Play className="h-3.5 w-3.5" />
              Backtest
            </button>
          </div>
        }
      />

      <div className="relative rounded-xl border border-dashed border-border bg-surface/40 p-4">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-ai/40 via-ai/10 to-transparent" />

        <div className="space-y-3 pl-6">
          {blocks.map((block, index) => {
            const Icon = iconMap[block.icon] ?? Filter
            return (
              <div key={block.id} className="relative flex items-stretch gap-3">
                <div className="absolute -left-6 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-ai/30 bg-surface-elevated text-[10px] font-bold text-ai">
                  {index + 1}
                </div>

                <div
                  className={cn(
                    'flex flex-1 items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:border-opacity-60',
                    typeStyles[block.type],
                  )}
                >
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab opacity-40" />
                  <div className={`rounded-md p-1.5 ${typeStyles[block.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{block.label}</p>
                    <p className="text-[11px] opacity-70">{block.value}</p>
                  </div>
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider opacity-60">
                    {block.type}
                  </span>
                </div>
              </div>
            )
          })}

          <button
            type="button"
            className="ml-0 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border-subtle py-3 text-xs font-medium text-text-muted transition-colors hover:border-ai/30 hover:text-ai"
          >
            <Plus className="h-4 w-4" />
            Add Block
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Entry Rules', count: 2, color: 'text-info' },
          { label: 'Filters', count: 1, color: 'text-ai' },
          { label: 'Exit Rules', count: 2, color: 'text-accent' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-border-subtle bg-surface/40 px-3 py-2 text-center"
          >
            <p className={`font-mono text-lg font-bold ${s.color}`}>{s.count}</p>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </TerminalCard>
  )
}
