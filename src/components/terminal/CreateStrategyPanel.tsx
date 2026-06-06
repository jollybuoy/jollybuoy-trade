import { Plus, Play } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from './TerminalCard'
import {
  DEFAULT_CREATE_FORM,
  ENTRY_CONDITIONS,
  EXIT_CONDITIONS,
  STRATEGY_TYPE_OPTIONS,
  SYMBOL_OPTIONS,
} from '@/data/strategyBuilder'
import type { CreateStrategyForm } from '@/types/strategy'
import { cn } from '@/lib/utils'

interface CreateStrategyPanelProps {
  form: CreateStrategyForm
  onChange: (form: CreateStrategyForm) => void
  onCreate: () => void
  onBacktest: () => void
}

export function CreateStrategyPanel({
  form,
  onChange,
  onCreate,
  onBacktest,
}: CreateStrategyPanelProps) {
  const update = <K extends keyof CreateStrategyForm>(key: K, value: CreateStrategyForm[K]) => {
    onChange({ ...form, [key]: value })
  }

  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Create Strategy"
        description="Configure rules and risk parameters"
        action={
          <button
            type="button"
            onClick={() => onChange({ ...DEFAULT_CREATE_FORM })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Reset
          </button>
        }
      />

      <div className="space-y-4">
        <Field label="Strategy Name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="My AI Momentum Strategy"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Symbol">
            <select
              value={form.symbol}
              onChange={(e) => update('symbol', e.target.value)}
              className={inputClass}
            >
              {SYMBOL_OPTIONS.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Strategy Type">
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value as CreateStrategyForm['type'])}
              className={inputClass}
            >
              {STRATEGY_TYPE_OPTIONS.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Entry Condition">
            <select
              value={form.entryCondition}
              onChange={(e) => update('entryCondition', e.target.value)}
              className={inputClass}
            >
              {ENTRY_CONDITIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Exit Condition">
            <select
              value={form.exitCondition}
              onChange={(e) => update('exitCondition', e.target.value)}
              className={inputClass}
            >
              {EXIT_CONDITIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stop Loss">
            <NumberInput
              value={form.stopLossPercent}
              onChange={(v) => update('stopLossPercent', v)}
              suffix="%"
              step={0.5}
            />
          </Field>
          <Field label="Take Profit">
            <NumberInput
              value={form.takeProfitPercent}
              onChange={(v) => update('takeProfitPercent', v)}
              suffix="%"
              step={0.5}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Max Position Size">
            <NumberInput
              value={form.maxPositionSize}
              onChange={(v) => update('maxPositionSize', v)}
              prefix="$"
            />
          </Field>
          <Field label="Max Daily Loss">
            <NumberInput
              value={form.maxDailyLoss}
              onChange={(v) => update('maxDailyLoss', v)}
              prefix="$"
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border-subtle pt-4">
          <button
            type="button"
            onClick={onBacktest}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-ai/30 bg-ai/10 px-4 py-2.5 text-sm font-medium text-ai transition-colors hover:bg-ai/20 sm:flex-none"
          >
            <Play className="h-4 w-4" />
            Run Backtest
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-muted sm:flex-none"
          >
            <Plus className="h-4 w-4" />
            Create Strategy
          </button>
        </div>
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

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  step?: number
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={cn(inputClass, prefix && 'pl-7', suffix && 'pr-8')}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
          {suffix}
        </span>
      )}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2.5 text-sm text-text-primary focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20'
