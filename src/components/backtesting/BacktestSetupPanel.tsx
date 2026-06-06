import { Play } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { BACKTEST_STRATEGY_OPTIONS, BACKTEST_SYMBOL_OPTIONS } from '@/data/backtestingAnalytics'
import type { BacktestSetupForm } from '@/types/backtesting'
import { cn } from '@/lib/utils'

interface BacktestSetupPanelProps {
  form: BacktestSetupForm
  isRunning: boolean
  onChange: (form: BacktestSetupForm) => void
  onRun: () => void
}

export function BacktestSetupPanel({
  form,
  isRunning,
  onChange,
  onRun,
}: BacktestSetupPanelProps) {
  const update = <K extends keyof BacktestSetupForm>(key: K, value: BacktestSetupForm[K]) => {
    onChange({ ...form, [key]: value })
  }

  const toggleSymbol = (symbol: string) => {
    const next = form.symbols.includes(symbol)
      ? form.symbols.filter((s) => s !== symbol)
      : [...form.symbols, symbol]
    update('symbols', next.length > 0 ? next : [symbol])
  }

  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Backtest Setup"
        description="Configure strategy, universe, and simulation parameters"
      />

      <div className="space-y-3">
        <Field label="Strategy">
          <select
            value={form.strategyId}
            onChange={(e) => update('strategyId', e.target.value)}
            className={inputClass}
          >
            {BACKTEST_STRATEGY_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Symbols">
          <div className="flex flex-wrap gap-1.5">
            {BACKTEST_SYMBOL_OPTIONS.map((symbol) => {
              const active = form.symbols.includes(symbol)
              return (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => toggleSymbol(symbol)}
                  className={cn(
                    'rounded-md border px-2 py-1 font-mono text-xs font-semibold transition-colors',
                    active
                      ? 'border-ai/30 bg-ai/10 text-ai'
                      : 'border-border-subtle text-text-muted hover:border-ai/20',
                  )}
                >
                  {symbol}
                </button>
              )
            })}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => update('startDate', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="End Date">
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => update('endDate', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Initial Capital">
            <input
              type="number"
              value={form.initialCapital}
              onChange={(e) => update('initialCapital', Number(e.target.value) || 0)}
              className={inputClass}
            />
          </Field>
          <Field label="Position Size">
            <input
              type="number"
              value={form.positionSize}
              onChange={(e) => update('positionSize', Number(e.target.value) || 0)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Commission (bps)">
            <input
              type="number"
              value={form.commissionBps}
              onChange={(e) => update('commissionBps', Number(e.target.value) || 0)}
              className={inputClass}
            />
          </Field>
          <Field label="Slippage (bps)">
            <input
              type="number"
              value={form.slippageBps}
              onChange={(e) => update('slippageBps', Number(e.target.value) || 0)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="rounded-lg border border-border-subtle bg-surface/40 px-3 py-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-text-muted">Universe</span>
            <span className="font-mono text-text-primary">{form.symbols.join(', ')}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-text-muted">Est. cost per round trip</span>
            <span className="font-mono text-ai">
              {form.commissionBps + form.slippageBps} bps
            </span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-text-muted">Capital deployed / trade</span>
            <span className="font-mono text-text-primary">
              {((form.positionSize / form.initialCapital) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={isRunning || form.symbols.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-accent/30 border-t-on-accent" />
              Running Backtest…
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Backtest
            </>
          )}
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

const inputClass =
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2.5 font-mono text-sm text-text-primary focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20'
