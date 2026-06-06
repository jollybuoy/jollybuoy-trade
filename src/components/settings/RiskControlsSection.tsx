import { OctagonAlert, Shield } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { SettingsToggle } from '@/components/settings/SettingsToggle'
import type { RiskControlSettings } from '@/types/settings'
import { cn, formatCurrency } from '@/lib/utils'

interface RiskControlsSectionProps {
  settings: RiskControlSettings
  onChange: (settings: RiskControlSettings) => void
  onEmergencyStop: () => void
  onResetEmergencyStop: () => void
}

export function RiskControlsSection({
  settings,
  onChange,
  onEmergencyStop,
  onResetEmergencyStop,
}: RiskControlsSectionProps) {
  const update = <K extends keyof RiskControlSettings>(
    key: K,
    value: RiskControlSettings[K],
  ) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <TerminalCard>
      <TerminalCardHeader
        title="Risk Controls"
        description="Hard limits and circuit breakers for automated trading"
        badge={
          <span
            className={cn(
              'flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase',
              settings.emergencyStopActive
                ? 'border-danger/20 bg-danger/10 text-danger'
                : 'border-accent/20 bg-accent/10 text-accent',
            )}
          >
            <Shield className="h-3 w-3" />
            {settings.emergencyStopActive ? 'HALTED' : 'ARMED'}
          </span>
        }
      />

      {settings.emergencyStopActive && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <OctagonAlert className="h-4 w-4 shrink-0 text-danger" />
            <p className="text-sm font-medium text-danger">
              Emergency stop active — all trading automation is halted.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetEmergencyStop}
            className="shrink-0 rounded-lg border border-danger/30 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10"
          >
            Reset
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RiskField
          label="Max Daily Loss"
          value={settings.maxDailyLoss}
          onChange={(v) => update('maxDailyLoss', v)}
          prefix="$"
        />
        <RiskField
          label="Max Trade Size"
          value={settings.maxTradeSize}
          onChange={(v) => update('maxTradeSize', v)}
          prefix="$"
        />
        <RiskField
          label="Max Open Positions"
          value={settings.maxOpenPositions}
          onChange={(v) => update('maxOpenPositions', v)}
        />
        <RiskField
          label="Stop After Losses"
          value={settings.stopAfterLosses}
          onChange={(v) => update('stopAfterLosses', v)}
          suffix=" trades"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border-subtle bg-surface/40 p-4">
          <SettingsToggle
            label="Block options trading"
            description="Prevent automated or manual options orders"
            enabled={settings.blockOptionsTrading}
            onToggle={(v) => update('blockOptionsTrading', v)}
            disabled={settings.emergencyStopActive}
          />
        </div>

        <div className="flex flex-col justify-center rounded-lg border border-danger/20 bg-danger/5 p-4">
          <p className="text-sm font-semibold text-text-primary">Emergency Stop</p>
          <p className="mt-1 text-[10px] text-text-muted">
            Immediately halt all bots, pending orders, and strategy execution.
          </p>
          <button
            type="button"
            onClick={onEmergencyStop}
            disabled={settings.emergencyStopActive}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <OctagonAlert className="h-4 w-4" />
            Emergency Stop
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 rounded-lg border border-border-subtle bg-surface/30 px-4 py-3 sm:grid-cols-3">
        <RiskSummary label="Daily loss cap" value={formatCurrency(settings.maxDailyLoss)} />
        <RiskSummary label="Per-trade cap" value={formatCurrency(settings.maxTradeSize)} />
        <RiskSummary
          label="Loss streak limit"
          value={`${settings.stopAfterLosses} consecutive`}
        />
      </div>
    </TerminalCard>
  )
}

function RiskField({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <div className="relative mt-1.5">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={cn(
            inputClass,
            prefix && 'pl-7',
            suffix && 'pr-14',
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function RiskSummary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-text-muted">{label}</p>
      <p className="font-mono text-sm font-semibold text-text-primary">{value}</p>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2.5 font-mono text-sm text-text-primary focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20'
