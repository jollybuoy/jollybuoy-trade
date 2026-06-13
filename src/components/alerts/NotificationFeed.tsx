import {
  AlertTriangle,
  ArrowRightLeft,
  Bot,
  PauseCircle,
  ShieldAlert,
} from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { NotificationFeedItem, NotificationFeedType } from '@/types/alerts'
import { cn, formatDateTime } from '@/lib/utils'

interface NotificationFeedProps {
  items: NotificationFeedItem[]
}

const feedStyles: Record<
  NotificationFeedType,
  { icon: typeof Bot; className: string }
> = {
  bot_started: { icon: Bot, className: 'bg-ai/10 text-ai border-ai/20' },
  trade_executed: { icon: ArrowRightLeft, className: 'bg-accent/10 text-accent border-accent/20' },
  stop_loss: { icon: ShieldAlert, className: 'bg-danger/10 text-danger border-danger/20' },
  risk_limit: { icon: AlertTriangle, className: 'bg-warning/10 text-warning border-warning/20' },
  strategy_paused: { icon: PauseCircle, className: 'bg-surface-elevated text-text-secondary border-border-subtle' },
}

export function NotificationFeed({ items }: NotificationFeedProps) {
  return (
    <TerminalCard>
      <TerminalCardHeader
        title="Notification Feed"
        description="Recent simulated events from paper trading and automation"
        badge={
          <span className="rounded-md border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent">
            Live feed (mock)
          </span>
        }
      />

      <div className="space-y-2">
        {items.map((item) => {
          const style = feedStyles[item.type]
          const Icon = style.icon

          return (
            <div
              key={item.id}
              className="flex gap-3 rounded-lg border border-border-subtle/60 bg-surface/30 p-3 transition-colors hover:bg-ai/5"
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                  style.className,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <span className="font-mono text-[10px] text-text-muted">
                    {formatDateTime(item.timestamp)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                  {item.message}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </TerminalCard>
  )
}
