import { Pause, Play, OctagonAlert, Shield, Zap } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { PaperBotState, PaperBotStatus } from '@/types/paperTrading'
import { cn } from '@/lib/utils'

interface BotAutomationPanelProps {
  bot: PaperBotState
  onStart: () => void
  onPause: () => void
  onEmergencyStop: () => void
}

const riskStyles = {
  normal: { label: 'Normal', className: 'bg-accent/10 text-accent border-accent/20' },
  elevated: { label: 'Elevated', className: 'bg-warning/10 text-warning border-warning/20' },
  critical: { label: 'Critical', className: 'bg-danger/10 text-danger border-danger/20' },
}

export function BotAutomationPanel({
  bot,
  onStart,
  onPause,
  onEmergencyStop,
}: BotAutomationPanelProps) {
  const isRunning = bot.status === 'running'

  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Bot Automation"
        description="Paper trading bot controls"
        badge={<BotStatusBadge status={bot.status} />}
      />

      <div className="flex flex-wrap gap-2">
        <ControlButton
          icon={Play}
          label="Start Paper Bot"
          onClick={onStart}
          disabled={isRunning}
          variant="accent"
        />
        <ControlButton
          icon={Pause}
          label="Pause Paper Bot"
          onClick={onPause}
          disabled={!isRunning}
          variant="warning"
        />
        <ControlButton
          icon={OctagonAlert}
          label="Emergency Stop"
          onClick={onEmergencyStop}
          variant="danger"
        />
      </div>

      <div className="mt-4 space-y-3 border-t border-border-subtle pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Active Strategies
          </p>
          {bot.activeStrategies.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {bot.activeStrategies.map((strategy) => (
                <li
                  key={strategy}
                  className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface/40 px-3 py-2 text-xs text-text-primary"
                >
                  <Zap className="h-3 w-3 shrink-0 text-ai" />
                  {strategy}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-text-muted">No active strategies</p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface/40 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-text-muted" />
            <span className="text-xs text-text-secondary">Risk Status</span>
          </div>
          <span
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase',
              riskStyles[bot.riskStatus].className,
            )}
          >
            {riskStyles[bot.riskStatus].label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Metric label="Trades Today" value={String(bot.tradesToday)} />
          <Metric label="Bot State" value={bot.status} capitalize />
        </div>

        <div className="rounded-lg border border-ai/20 bg-ai/5 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ai">
            Last Action
          </p>
          <p className="mt-1 text-xs text-text-secondary">{bot.lastAction}</p>
        </div>
      </div>
    </TerminalCard>
  )
}

function BotStatusBadge({ status }: { status: PaperBotStatus }) {
  const styles: Record<PaperBotStatus, string> = {
    running: 'bg-accent/10 text-accent',
    paused: 'bg-warning/10 text-warning',
    stopped: 'bg-danger/10 text-danger',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase',
        styles[status],
      )}
    >
      {status === 'running' && (
        <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-live" />
      )}
      {status}
    </span>
  )
}

function ControlButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  variant,
}: {
  icon: typeof Play
  label: string
  onClick: () => void
  disabled?: boolean
  variant: 'accent' | 'warning' | 'danger'
}) {
  const variants = {
    accent: 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20',
    warning: 'border-warning/30 bg-warning/10 text-warning hover:bg-warning/20',
    danger: 'border-danger/30 bg-danger/10 text-danger hover:bg-danger/20',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        variants[variant],
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

function Metric({
  label,
  value,
  capitalize: cap,
}: {
  label: string
  value: string
  capitalize?: boolean
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/40 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-text-muted">{label}</p>
      <p className={cn('mt-0.5 font-mono text-sm font-bold text-text-primary', cap && 'capitalize')}>
        {value}
      </p>
    </div>
  )
}
