import { Filter, RotateCcw } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { SECTOR_OPTIONS, STRATEGY_MATCH_OPTIONS } from '@/data/marketScanner'
import { DEFAULT_SCANNER_FILTERS, type ScannerFilters } from '@/types/scanner'

interface ScannerFiltersPanelProps {
  filters: ScannerFilters
  onChange: (filters: ScannerFilters) => void
}

export function ScannerFiltersPanel({ filters, onChange }: ScannerFiltersPanelProps) {
  const update = <K extends keyof ScannerFilters>(key: K, value: ScannerFilters[K]) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <TerminalCard padding="sm">
      <TerminalCardHeader
        title="Filters"
        description="Narrow scan results"
        action={
          <button
            type="button"
            onClick={() => onChange(DEFAULT_SCANNER_FILTERS)}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-text-muted hover:text-ai"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        }
      />

      <div className="space-y-3">
        <FilterField label="Market">
          <div className="flex gap-2">
            {(['all', 'US', 'CA'] as const).map((m) => (
              <FilterChip
                key={m}
                active={filters.market === m}
                onClick={() => update('market', m)}
                label={m === 'all' ? 'All' : m}
              />
            ))}
          </div>
        </FilterField>

        <FilterField label="Sector">
          <select
            value={filters.sector}
            onChange={(e) => update('sector', e.target.value)}
            className={selectClass}
          >
            {SECTOR_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Sectors' : s}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Price Range">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => update('priceMin', Number(e.target.value) || 0)}
              placeholder="Min"
              className={inputClass}
            />
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => update('priceMax', Number(e.target.value) || 0)}
              placeholder="Max"
              className={inputClass}
            />
          </div>
        </FilterField>

        <FilterField label="Min Volume">
          <input
            type="number"
            value={filters.minVolume}
            onChange={(e) => update('minVolume', Number(e.target.value) || 0)}
            placeholder="0"
            className={inputClass}
          />
        </FilterField>

        <FilterField label="Signal Type">
          <div className="flex flex-wrap gap-2">
            {(['all', 'buy', 'watch', 'avoid'] as const).map((s) => (
              <FilterChip
                key={s}
                active={filters.signal === s}
                onClick={() => update('signal', s)}
                label={s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              />
            ))}
          </div>
        </FilterField>

        <FilterField label="Strategy Match">
          <select
            value={filters.strategyMatch}
            onChange={(e) => update('strategyMatch', e.target.value)}
            className={selectClass}
          >
            {STRATEGY_MATCH_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Strategies' : s}
              </option>
            ))}
          </select>
        </FilterField>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-3 text-[10px] text-text-muted">
        <Filter className="h-3 w-3" />
        Filters apply instantly to scan results
      </div>
    </TerminalCard>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function FilterChip({
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

const inputClass =
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2 font-mono text-xs text-text-primary focus:border-ai/40 focus:outline-none'

const selectClass =
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2 text-xs text-text-primary focus:border-ai/40 focus:outline-none'
