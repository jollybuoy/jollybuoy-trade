import { Layers } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { WatchlistGroup, WatchlistGroupId } from '@/types/watchlist'
import { cn } from '@/lib/utils'

interface WatchlistGroupsProps {
  groups: WatchlistGroup[]
  selectedId: WatchlistGroupId
  onSelect: (id: WatchlistGroupId) => void
}

export function WatchlistGroups({ groups, selectedId, onSelect }: WatchlistGroupsProps) {
  return (
    <TerminalCard padding="sm">
      <TerminalCardHeader
        title="Watchlist Groups"
        description="Switch between curated lists and your custom symbols"
        badge={
          <span className="inline-flex items-center gap-1 rounded-md border border-ai/20 bg-ai/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-ai">
            <Layers className="h-3 w-3" />
            {groups.length} lists
          </span>
        }
      />

      <div className="flex flex-wrap gap-2">
        {groups.map((group) => {
          const active = group.id === selectedId
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onSelect(group.id)}
              className={cn(
                'rounded-lg border px-3 py-2 text-left transition-colors',
                active
                  ? 'border-ai/30 bg-ai/10 text-text-primary'
                  : 'border-border-subtle bg-surface/40 text-text-secondary hover:border-ai/20 hover:bg-ai/5',
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{group.name}</span>
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold',
                    active ? 'bg-ai/20 text-ai' : 'bg-surface-elevated text-text-muted',
                  )}
                >
                  {group.symbolCount}
                </span>
              </div>
              <p className="mt-0.5 max-w-[180px] truncate text-[10px] text-text-muted">
                {group.description}
              </p>
            </button>
          )
        })}
      </div>
    </TerminalCard>
  )
}
