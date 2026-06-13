import { FlaskConical, Lock, ShieldCheck } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { SettingsToggle } from '@/components/settings/SettingsToggle'
import type { IbkrAccountMode, TradingModeSettings as TradingModeSettingsType } from '@/types/settings'
import { cn } from '@/lib/utils'

interface TradingModeSettingsProps {
  settings: TradingModeSettingsType
  onChange: (settings: TradingModeSettingsType) => void
}

export function TradingModeSettings({ settings, onChange }: TradingModeSettingsProps) {
  const update = <K extends keyof TradingModeSettingsType>(
    key: K,
    value: TradingModeSettingsType[K],
  ) => {
    onChange({ ...settings, [key]: value })
  }

  const selectMode = (mode: IbkrAccountMode) => {
    if (mode === 'live' && settings.liveModeLocked) return
    onChange({
      ...settings,
      activeMode: mode,
      paperModeActive: mode === 'paper',
    })
  }

  return (
    <TerminalCard>
      <TerminalCardHeader
        title="Trading Mode"
        description="Choose paper or live account — bot strategies use the selected mode"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <ModeCard
          icon={FlaskConical}
          title="Paper Trading Mode"
          description="Simulated capital on IB Gateway port 4002"
          active={settings.activeMode === 'paper'}
          badge={settings.activeMode === 'paper' ? 'Active' : 'Available'}
          badgeClassName="bg-accent/10 text-accent border-accent/20"
          onSelect={() => selectMode('paper')}
        />
        <ModeCard
          icon={Lock}
          title="Live Trading Mode"
          description="Real capital on IB Gateway port 4001"
          active={settings.activeMode === 'live'}
          badge={settings.liveModeLocked ? 'Locked' : settings.activeMode === 'live' ? 'Active' : 'Available'}
          badgeClassName={
            settings.liveModeLocked
              ? 'bg-surface-elevated text-text-muted border-border-subtle'
              : 'bg-accent/10 text-accent border-accent/20'
          }
          locked={settings.liveModeLocked}
          onSelect={() => selectMode('live')}
        />
      </div>

      <div className="mt-4 divide-y divide-border-subtle border-t border-border-subtle pt-2">
        <SettingsToggle
          label="Allow live account connection"
          description="Unlock the Connect Live Account button (requires live IB Gateway)"
          enabled={!settings.liveModeLocked}
          onToggle={(enabled) => update('liveModeLocked', !enabled)}
        />
        <SettingsToggle
          label="Require confirmation before live trading"
          description="Extra approval step before any live order submission"
          enabled={settings.requireLiveConfirmation}
          onToggle={(v) => update('requireLiveConfirmation', v)}
        />
      </div>

      {settings.activeMode === 'paper' ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
          <p className="text-xs text-accent">
            Paper mode selected — strategies trade against your IBKR paper account buying power.
          </p>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/5 px-3 py-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-danger" />
          <p className="text-xs text-danger">
            Live mode selected — automated strategies will use real capital when the bot is running.
          </p>
        </div>
      )}
    </TerminalCard>
  )
}

function ModeCard({
  icon: Icon,
  title,
  description,
  active,
  badge,
  badgeClassName,
  locked = false,
  onSelect,
}: {
  icon: typeof FlaskConical
  title: string
  description: string
  active: boolean
  badge: string
  badgeClassName: string
  locked?: boolean
  onSelect?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={locked}
      className={cn(
        'rounded-lg border p-4 text-left transition-colors',
        active && !locked
          ? 'border-accent/30 bg-accent/5 ring-1 ring-accent/20'
          : 'border-border-subtle bg-surface/40 hover:border-ai/20',
        locked && 'cursor-not-allowed opacity-75',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2.5">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              active && !locked ? 'bg-accent/15 text-accent' : 'bg-surface-elevated text-text-muted',
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            <p className="mt-0.5 text-[10px] text-text-muted">{description}</p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase',
            badgeClassName,
          )}
        >
          {badge}
        </span>
      </div>
    </button>
  )
}
