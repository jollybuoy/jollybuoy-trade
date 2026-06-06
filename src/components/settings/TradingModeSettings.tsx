import { FlaskConical, Lock, ShieldCheck } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { SettingsToggle } from '@/components/settings/SettingsToggle'
import type { TradingModeSettings as TradingModeSettingsType } from '@/types/settings'
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

  return (
    <TerminalCard>
      <TerminalCardHeader
        title="Trading Mode"
        description="Execution environment and live trading safeguards"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <ModeCard
          icon={FlaskConical}
          title="Paper Trading Mode"
          description="Simulated fills with zero capital risk"
          active={settings.paperModeActive}
          badge="Active"
          badgeClassName="bg-accent/10 text-accent border-accent/20"
        />
        <ModeCard
          icon={Lock}
          title="Live Trading Mode"
          description="Requires broker onboarding and approval"
          active={!settings.liveModeLocked}
          badge={settings.liveModeLocked ? 'Locked' : 'Available'}
          badgeClassName={
            settings.liveModeLocked
              ? 'bg-surface-elevated text-text-muted border-border-subtle'
              : 'bg-accent/10 text-accent border-accent/20'
          }
          locked={settings.liveModeLocked}
        />
      </div>

      <div className="mt-4 divide-y divide-border-subtle border-t border-border-subtle pt-2">
        <SettingsToggle
          label="Require confirmation before live trading"
          description="Extra approval step before any live order submission"
          enabled={settings.requireLiveConfirmation}
          onToggle={(v) => update('requireLiveConfirmation', v)}
        />
      </div>

      {settings.paperModeActive && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
          <p className="text-xs text-accent">
            Paper mode is active — all automated strategies run in simulation only.
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
}: {
  icon: typeof FlaskConical
  title: string
  description: string
  active: boolean
  badge: string
  badgeClassName: string
  locked?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-colors',
        active && !locked
          ? 'border-accent/30 bg-accent/5'
          : 'border-border-subtle bg-surface/40',
        locked && 'opacity-75',
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
    </div>
  )
}
