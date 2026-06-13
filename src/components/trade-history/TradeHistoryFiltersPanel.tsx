import { RotateCcw } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { STRATEGY_OPTIONS, STATUS_OPTIONS, SYMBOL_OPTIONS } from '@/data/tradeHistoryAnalytics'
import { DEFAULT_TRADE_FILTERS, type PnlFilter, type TradeHistoryFilters } from '@/types/tradeHistory'

interface TradeHistoryFiltersPanelProps {
  filters: TradeHistoryFilters
  onChange: (filters: TradeHistoryFilters) => void
}

export function TradeHistoryFiltersPanel({
  filters,
  onChange,
}: TradeHistoryFiltersPanelProps) {
  const update = <K extends keyof TradeHistoryFilters>(key: K, value: TradeHistoryFilters[K]) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <TerminalCard padding="sm">
      <TerminalCardHeader
        title="Filters"
        description="Refine trade history and analytics"
        action={
          <button
            type="button"
            onClick={() => onChange(DEFAULT_TRADE_FILTERS)}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-text-muted hover:text-ai"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        }
      />

      <div className="space-y-3">
        <Field label="Date Range">
          <div className="flex flex-wrap gap-2">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <Chip
                key={range}
                active={filters.dateRange === range}
                onClick={() => update('dateRange', range)}
                label={range === 'all' ? 'All Time' : range.toUpperCase()}
              />
            ))}
          </div>
        </Field>

        <Field label="Symbol">
          <select
            value={filters.symbol}
            onChange={(e) => update('symbol', e.target.value)}
            className={selectClass}
          >
            {SYMBOL_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Symbols' : s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Strategy">
          <select
            value={filters.strategy}
            onChange={(e) => update('strategy', e.target.value)}
            className={selectClass}
          >
            {STRATEGY_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Strategies' : s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select
            value={filters.status}
            onChange={(e) =>
              update('status', e.target.value as TradeHistoryFilters['status'])
            }
            className={selectClass}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="P/L Result">
          <div className="flex gap-2">
            {(['all', 'profit', 'loss'] as PnlFilter[]).map((p) => (
              <Chip
                key={p}
                active={filters.pnlFilter === p}
                onClick={() => update('pnlFilter', p)}
                label={p === 'all' ? 'All' : p === 'profit' ? 'Profit' : 'Loss'}
              />
            ))}
          </div>
        </Field>
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

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
        active
          ? 'border border-ai/30 bg-ai/10 text-ai'
          : 'border border-border-subtle text-text-secondary hover:bg-surface-hover'
      }`}
    >
      {label}
    </button>
  )
}

const selectClass =
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2 text-xs text-text-primary focus:border-ai/40 focus:outline-none'
