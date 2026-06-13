import { Bot, Cpu, Zap } from 'lucide-react'
import { TerminalCard } from './TerminalCard'
import type { BotStatus } from '@/types'
import { cn } from '@/lib/utils'

interface BotStatusCardProps {
  bot: BotStatus
}

export function BotStatusCard({ bot }: BotStatusCardProps) {
  const isRunning = bot.status === 'running'

  return (
    <TerminalCard glow="ai" className="relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-ai/10">
            <Bot className="h-5 w-5 text-ai" />
            {isRunning && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              AI Trading Bot
            </p>
            <h3 className="text-gradient-ai text-lg font-semibold">{bot.name}</h3>
          </div>
        </div>
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
            isRunning ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning',
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', isRunning ? 'bg-accent pulse-live' : 'bg-warning')} />
          {bot.status.toUpperCase()}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Uptime" value={bot.uptime} />
        <Metric label="Signals Today" value={String(bot.signalsToday)} highlight />
        <Metric label="Confidence" value={`${bot.confidence}%`} />
        <Metric label="Model" value={bot.model} small />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-3 py-2.5">
        <Zap className="h-3.5 w-3.5 shrink-0 text-ai" />
        <p className="truncate text-xs text-text-secondary">
          Last signal: <span className="font-medium text-text-primary">{bot.lastSignal}</span>
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-muted">
        <Cpu className="h-3 w-3" />
        Neural inference active · Paper mode
      </div>
    </TerminalCard>
  )
}

function Metric({
  label,
  value,
  highlight,
  small,
}: {
  label: string
  value: string
  highlight?: boolean
  small?: boolean
}) {
  return (
    <div className="rounded-lg border border-border-subtle/60 bg-surface/40 px-3 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">{label}</p>
      <p
        className={cn(
          'mt-0.5 font-mono font-semibold',
          small ? 'text-[11px] leading-tight' : 'text-sm',
          highlight ? 'text-ai' : 'text-text-primary',
        )}
      >
        {value}
      </p>
    </div>
  )
}
