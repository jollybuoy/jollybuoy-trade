import { Eye, Plus } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { ScannerRow, ScannerSignal } from '@/types/scanner'
import { cn, formatCurrency, formatPercent, formatNumber } from '@/lib/utils'

interface ScannerTableProps {
  rows: ScannerRow[]
  resultCount: number
}

const signalStyles: Record<
  ScannerSignal,
  { label: string; className: string }
> = {
  buy: { label: 'Buy', className: 'bg-accent/10 text-accent border-accent/20' },
  watch: { label: 'Watch', className: 'bg-warning/10 text-warning border-warning/20' },
  avoid: { label: 'Avoid', className: 'bg-danger/10 text-danger border-danger/20' },
}

export function ScannerTable({ rows, resultCount }: ScannerTableProps) {
  return (
    <TerminalCard padding="none" className="overflow-hidden">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Scan Results"
          description={`${resultCount} symbols match your filters`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {[
                'Symbol',
                'Company',
                'Price',
                'Change %',
                'Volume',
                'Rel Vol',
                'RSI',
                'AI Score',
                'Signal',
                'Action',
              ].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                    i > 1 && i < 9 && 'text-right',
                    i === 9 && 'text-center',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-sm text-text-secondary">
                  No symbols match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.symbol}
                  className="border-b border-border-subtle/40 transition-colors hover:bg-ai/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai/10 text-xs font-bold text-ai">
                        {row.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">{row.symbol}</p>
                        <p className="text-[10px] text-text-muted">{row.market}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-[140px] truncate text-sm text-text-secondary">
                      {row.company}
                    </p>
                    <p className="text-[10px] text-text-muted">{row.sector}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-medium">
                    {formatCurrency(row.price)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        'inline-flex rounded-md px-2 py-0.5 font-mono text-xs font-medium',
                        row.changePercent >= 0 ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger',
                      )}
                    >
                      {formatPercent(row.changePercent)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-text-secondary">
                    {formatNumber(row.volume)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        'font-mono text-xs font-medium',
                        row.relativeVolume >= 2 ? 'text-ai' : 'text-text-secondary',
                      )}
                    >
                      {row.relativeVolume.toFixed(1)}×
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RsiBadge value={row.rsi} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AiScoreRing score={row.aiScore} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <SignalBadge signal={row.signal} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        className="rounded-lg border border-border-subtle p-1.5 text-text-secondary hover:border-ai/30 hover:text-ai"
                        aria-label={`Add ${row.symbol} to watchlist`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-border-subtle p-1.5 text-text-secondary hover:border-info/30 hover:text-info"
                        aria-label={`View ${row.symbol} details`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </TerminalCard>
  )
}

function RsiBadge({ value }: { value: number }) {
  const color =
    value >= 70 ? 'text-danger' : value <= 30 ? 'text-accent' : 'text-text-secondary'
  return <span className={cn('font-mono text-xs font-medium', color)}>{value}</span>
}

function AiScoreRing({ score }: { score: number }) {
  const stroke = score >= 85 ? '#22d3a5' : score >= 75 ? '#5b9dff' : '#f5a623'

  return (
    <div className="relative ml-auto flex h-9 w-9 items-center justify-center">
      <svg className="absolute inset-0 h-9 w-9 -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="var(--color-chart-grid)"
          strokeWidth="2.5"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeDasharray={`${(score / 100) * 88} 88`}
          strokeLinecap="round"
        />
      </svg>
      <span className="font-mono text-[10px] font-bold">{score}</span>
    </div>
  )
}

function SignalBadge({ signal }: { signal: ScannerSignal }) {
  const { label, className } = signalStyles[signal]
  return (
    <span
      className={cn(
        'inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase',
        className,
      )}
    >
      {label}
    </span>
  )
}
