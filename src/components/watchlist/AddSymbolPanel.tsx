import { useMemo, useState } from 'react'
import { Check, Plus, Search } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { SEARCHABLE_SYMBOLS, WATCHLIST_GROUPS } from '@/data/watchlistAnalytics'
import type { AddSymbolForm, WatchlistGroupId } from '@/types/watchlist'
import { cn } from '@/lib/utils'

interface AddSymbolPanelProps {
  form: AddSymbolForm
  selectedWatchlistId: WatchlistGroupId
  onChange: (form: AddSymbolForm) => void
  onSubmit: () => void
  lastAdded?: string | null
}

export function AddSymbolPanel({
  form,
  selectedWatchlistId,
  onChange,
  onSubmit,
  lastAdded,
}: AddSymbolPanelProps) {
  const [query, setQuery] = useState('')

  const update = <K extends keyof AddSymbolForm>(key: K, value: AddSymbolForm[K]) => {
    onChange({ ...form, [key]: value })
  }

  const matches = useMemo(() => {
    const q = query.trim().toUpperCase()
    if (!q) return SEARCHABLE_SYMBOLS.slice(0, 6)
    return SEARCHABLE_SYMBOLS.filter(
      (s) => s.symbol.includes(q) || s.company.toUpperCase().includes(q),
    ).slice(0, 8)
  }, [query])

  const selectSymbol = (symbol: string) => {
    update('symbol', symbol)
    setQuery(symbol)
  }

  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Add Symbol"
        description="Search and add to your selected watchlist"
      />

      <div className="space-y-3">
        <Field label="Search Symbol">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by symbol or company..."
              className={cn(inputClass, 'pl-9')}
            />
          </div>
          {matches.length > 0 && (
            <div className="mt-2 max-h-36 overflow-y-auto rounded-lg border border-border-subtle bg-surface/40">
              {matches.map((item) => (
                <button
                  key={item.symbol}
                  type="button"
                  onClick={() => selectSymbol(item.symbol)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-ai/5',
                    form.symbol === item.symbol && 'bg-ai/10',
                  )}
                >
                  <span className="font-semibold text-text-primary">{item.symbol}</span>
                  <span className="truncate pl-2 text-xs text-text-muted">{item.company}</span>
                </button>
              ))}
            </div>
          )}
        </Field>

        <Field label="Add to Watchlist">
          <select
            value={form.watchlistId}
            onChange={(e) => update('watchlistId', e.target.value as WatchlistGroupId)}
            className={inputClass}
          >
            {WATCHLIST_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          {form.watchlistId !== selectedWatchlistId && (
            <p className="mt-1 text-[10px] text-text-muted">
              Currently viewing a different list — symbol will be added to{' '}
              {WATCHLIST_GROUPS.find((g) => g.id === form.watchlistId)?.name}.
            </p>
          )}
        </Field>

        <Field label="Notes">
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={3}
            placeholder="Thesis, catalysts, or entry plan..."
            className={cn(inputClass, 'resize-none font-sans')}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Target Buy Price">
            <input
              type="number"
              step="0.01"
              value={form.targetBuyPrice}
              onChange={(e) =>
                update('targetBuyPrice', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="0.00"
              className={inputClass}
            />
          </Field>
          <Field label="Target Sell Price">
            <input
              type="number"
              step="0.01"
              value={form.targetSellPrice}
              onChange={(e) =>
                update('targetSellPrice', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="0.00"
              className={inputClass}
            />
          </Field>
        </div>

        {lastAdded && (
          <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-xs text-accent">
            <Check className="h-3.5 w-3.5 shrink-0" />
            {lastAdded} added to watchlist (mock)
          </div>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!form.symbol}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add to Watchlist
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
