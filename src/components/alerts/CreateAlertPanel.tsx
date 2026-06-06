import { Save } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { ALERT_SYMBOL_OPTIONS } from '@/data/alertsAnalytics'
import {
  DEFAULT_CREATE_ALERT_FORM,
  ALERT_TYPE_LABELS,
  NOTIFICATION_METHOD_LABELS,
  type AlertType,
  type CreateAlertForm,
  type NotificationMethod,
} from '@/types/alerts'
import { cn } from '@/lib/utils'

interface CreateAlertPanelProps {
  form: CreateAlertForm
  onChange: (form: CreateAlertForm) => void
  onSave: () => void
  saveMessage?: string | null
}

export function CreateAlertPanel({ form, onChange, onSave, saveMessage }: CreateAlertPanelProps) {
  const update = <K extends keyof CreateAlertForm>(key: K, value: CreateAlertForm[K]) => {
    onChange({ ...form, [key]: value })
  }

  const thresholdLabel = getThresholdLabel(form.alertType)
  const showSymbol = form.alertType !== 'strategy_trigger'

  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Create Alert"
        description="Configure a new price, risk, or strategy notification"
      />

      <div className="space-y-3">
        {showSymbol && (
          <Field label="Symbol">
            <select
              value={form.symbol}
              onChange={(e) => update('symbol', e.target.value)}
              className={inputClass}
            >
              {ALERT_SYMBOL_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Alert Type">
          <select
            value={form.alertType}
            onChange={(e) => update('alertType', e.target.value as AlertType)}
            className={inputClass}
          >
            {(Object.entries(ALERT_TYPE_LABELS) as [AlertType, string][]).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={thresholdLabel}>
          <input
            type="text"
            value={form.threshold}
            onChange={(e) => update('threshold', e.target.value)}
            placeholder={getThresholdPlaceholder(form.alertType)}
            className={inputClass}
          />
        </Field>

        <Field label="Notification Method">
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(NOTIFICATION_METHOD_LABELS) as [NotificationMethod, string][]).map(
              ([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => update('notificationMethod', id)}
                  className={cn(
                    'rounded-lg border py-2 text-xs font-medium transition-colors',
                    form.notificationMethod === id
                      ? 'border-ai/30 bg-ai/10 text-ai'
                      : 'border-border-subtle text-text-secondary hover:bg-surface-hover',
                  )}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </Field>

        {saveMessage && (
          <div className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-xs text-accent">
            {saveMessage}
          </div>
        )}

        <button
          type="button"
          onClick={onSave}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-muted"
        >
          <Save className="h-4 w-4" />
          Save Alert
        </button>
      </div>
    </TerminalCard>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function getThresholdLabel(type: AlertType): string {
  switch (type) {
    case 'price_above':
    case 'price_below':
      return 'Price Level ($)'
    case 'rsi_level':
      return 'RSI Level'
    case 'volume_spike':
      return 'Volume Multiplier (×)'
    case 'ai_signal':
      return 'Minimum AI Score'
    case 'earnings_event':
      return 'Days Before Earnings'
    case 'strategy_trigger':
      return 'Trigger Condition'
    default:
      return 'Threshold'
  }
}

function getThresholdPlaceholder(type: AlertType): string {
  switch (type) {
    case 'price_above':
    case 'price_below':
      return '900.00'
    case 'rsi_level':
      return '30'
    case 'volume_spike':
      return '2'
    case 'ai_signal':
      return '85'
    case 'earnings_event':
      return '3'
    case 'strategy_trigger':
      return '3 consecutive losses'
    default:
      return ''
  }
}

export { DEFAULT_CREATE_ALERT_FORM }

const inputClass =
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2.5 font-mono text-sm text-text-primary focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20'
