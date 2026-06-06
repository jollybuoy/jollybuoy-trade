import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { SYMBOL_OPTIONS } from '@/data/paperTrading'
import type { PaperOrderForm, PaperOrderSide, PaperOrderType } from '@/types/paperTrading'
import { cn, formatCurrency } from '@/lib/utils'

interface PaperOrderTicketProps {
  form: PaperOrderForm
  buyingPower: number
  onChange: (form: PaperOrderForm) => void
  onSubmit: () => void
}

export function PaperOrderTicket({
  form,
  buyingPower,
  onChange,
  onSubmit,
}: PaperOrderTicketProps) {
  const update = <K extends keyof PaperOrderForm>(key: K, value: PaperOrderForm[K]) => {
    onChange({ ...form, [key]: value })
  }

  const estTotal = form.quantity * form.limitPrice

  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Paper Order Ticket"
        description="Manual execution · Simulated fills only"
      />

      <div className="space-y-3">
        <Field label="Symbol">
          <select
            value={form.symbol}
            onChange={(e) => update('symbol', e.target.value)}
            className={inputClass}
          >
            {SYMBOL_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Side">
          <div className="grid grid-cols-2 gap-2">
            {(['buy', 'sell'] as PaperOrderSide[]).map((side) => (
              <button
                key={side}
                type="button"
                onClick={() => update('side', side)}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-colors',
                  form.side === side
                    ? side === 'buy'
                      ? 'border-accent/30 bg-accent/10 text-accent'
                      : 'border-danger/30 bg-danger/10 text-danger'
                    : 'border-border-subtle text-text-secondary hover:bg-surface-hover',
                )}
              >
                {side === 'buy' ? (
                  <ArrowUpCircle className="h-4 w-4" />
                ) : (
                  <ArrowDownCircle className="h-4 w-4" />
                )}
                {side === 'buy' ? 'Buy' : 'Sell'}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantity">
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => update('quantity', Number(e.target.value) || 0)}
              className={inputClass}
            />
          </Field>
          <Field label="Order Type">
            <select
              value={form.orderType}
              onChange={(e) => update('orderType', e.target.value as PaperOrderType)}
              className={inputClass}
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
              <option value="stop">Stop</option>
            </select>
          </Field>
        </div>

        <Field label="Limit Price">
          <input
            type="number"
            step="0.01"
            value={form.limitPrice}
            onChange={(e) => update('limitPrice', Number(e.target.value) || 0)}
            className={inputClass}
            disabled={form.orderType === 'market'}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Stop Loss">
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={form.stopLossPercent}
                onChange={(e) => update('stopLossPercent', Number(e.target.value) || 0)}
                className={cn(inputClass, 'pr-8')}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                %
              </span>
            </div>
          </Field>
          <Field label="Take Profit">
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={form.takeProfitPercent}
                onChange={(e) => update('takeProfitPercent', Number(e.target.value) || 0)}
                className={cn(inputClass, 'pr-8')}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                %
              </span>
            </div>
          </Field>
        </div>

        <div className="rounded-lg border border-border-subtle bg-surface/40 px-3 py-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Est. Total</span>
            <span className="font-mono font-semibold text-text-primary">
              {formatCurrency(estTotal)}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-text-muted">Buying Power</span>
            <span className="font-mono text-accent">{formatCurrency(buyingPower)}</span>
          </div>
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-text-muted">Risk/Reward</span>
            <span className="font-mono text-ai">
              1:{(form.takeProfitPercent / form.stopLossPercent).toFixed(1)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-muted"
        >
          Submit Paper Order
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
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2.5 font-mono text-sm text-text-primary focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20 disabled:opacity-50'
