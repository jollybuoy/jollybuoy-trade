import { Bell, Newspaper, TrendingUp, Volume2 } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { WatchlistAlertSettings } from '@/types/watchlist'
import { cn } from '@/lib/utils'

interface WatchlistAlertSettingsPanelProps {
  settings: WatchlistAlertSettings
  onChange: (settings: WatchlistAlertSettings) => void
}

export function WatchlistAlertSettingsPanel({
  settings,
  onChange,
}: WatchlistAlertSettingsPanelProps) {
  const update = <K extends keyof WatchlistAlertSettings>(
    key: K,
    value: WatchlistAlertSettings[K],
  ) => {
    onChange({ ...settings, [key]: value })
  }

  const activeCount = [
    settings.priceAlert,
    settings.rsiAlert,
    settings.volumeSpikeAlert,
    settings.newsAlert,
    settings.earningsAlert,
  ].filter(Boolean).length

  return (
    <TerminalCard>
      <TerminalCardHeader
        title="Alert Settings"
        description="Configure notifications for watchlist symbols"
        badge={
          <span className="rounded-md border border-warning/20 bg-warning/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-warning">
            {activeCount} active
          </span>
        }
      />

      <div className="space-y-3">
        <AlertToggle
          icon={TrendingUp}
          label="Price Alert"
          description="Notify when price moves beyond threshold"
          enabled={settings.priceAlert}
          onToggle={(v) => update('priceAlert', v)}
        >
          <Field label="Threshold %">
            <input
              type="number"
              step="0.5"
              value={settings.priceThreshold}
              onChange={(e) => update('priceThreshold', Number(e.target.value) || 0)}
              disabled={!settings.priceAlert}
              className={inputClass}
            />
          </Field>
        </AlertToggle>

        <AlertToggle
          icon={Bell}
          label="RSI Alert"
          description="Oversold / overbought RSI crossings"
          enabled={settings.rsiAlert}
          onToggle={(v) => update('rsiAlert', v)}
        >
          <div className="grid grid-cols-2 gap-2">
            <Field label="Oversold">
              <input
                type="number"
                value={settings.rsiOversold}
                onChange={(e) => update('rsiOversold', Number(e.target.value) || 0)}
                disabled={!settings.rsiAlert}
                className={inputClass}
              />
            </Field>
            <Field label="Overbought">
              <input
                type="number"
                value={settings.rsiOverbought}
                onChange={(e) => update('rsiOverbought', Number(e.target.value) || 0)}
                disabled={!settings.rsiAlert}
                className={inputClass}
              />
            </Field>
          </div>
        </AlertToggle>

        <AlertToggle
          icon={Volume2}
          label="Volume Spike Alert"
          description="Unusual volume vs 20-day average"
          enabled={settings.volumeSpikeAlert}
          onToggle={(v) => update('volumeSpikeAlert', v)}
        >
          <Field label="Multiplier ×">
            <input
              type="number"
              step="0.1"
              value={settings.volumeSpikeMultiplier}
              onChange={(e) => update('volumeSpikeMultiplier', Number(e.target.value) || 0)}
              disabled={!settings.volumeSpikeAlert}
              className={inputClass}
            />
          </Field>
        </AlertToggle>

        <AlertToggle
          icon={Newspaper}
          label="News Alert"
          description="Headline and sentiment changes"
          enabled={settings.newsAlert}
          onToggle={(v) => update('newsAlert', v)}
        />

        <AlertToggle
          icon={Bell}
          label="Earnings Alert"
          description="Pre/post earnings date reminders"
          enabled={settings.earningsAlert}
          onToggle={(v) => update('earningsAlert', v)}
        />
      </div>
    </TerminalCard>
  )
}

function AlertToggle({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
  children,
}: {
  icon: typeof Bell
  label: string
  description: string
  enabled: boolean
  onToggle: (value: boolean) => void
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-3 transition-colors',
        enabled ? 'border-ai/20 bg-ai/5' : 'border-border-subtle bg-surface/30',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2.5">
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
              enabled ? 'bg-ai/15 text-ai' : 'bg-surface-elevated text-text-muted',
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{label}</p>
            <p className="text-[10px] text-text-muted">{description}</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggle(!enabled)}
          className={cn(
            'relative h-6 w-11 shrink-0 rounded-full transition-colors',
            enabled ? 'bg-accent' : 'bg-surface-elevated',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              enabled ? 'translate-x-5' : 'translate-x-0.5',
            )}
          />
        </button>
      </div>
      {enabled && children && <div className="mt-3 border-t border-border-subtle/60 pt-3">{children}</div>}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2 font-mono text-xs text-text-primary focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20 disabled:opacity-50'
