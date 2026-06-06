import { X } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { PaperPositionRow } from '@/types/paperTrading'
import { cn, formatCurrency, formatPercent, getChangeColor } from '@/lib/utils'

interface PaperPositionsTableProps {
  positions: PaperPositionRow[]
  onClose: (id: string) => void
}

export function PaperPositionsTable({ positions, onClose }: PaperPositionsTableProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Open Positions"
          description={`${positions.length} simulated holdings`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {[
                'Symbol',
                'Quantity',
                'Avg Price',
                'Current',
                'Market Value',
                'Unrealized P/L',
                'Action',
              ].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                    i > 0 && i < 6 && 'text-right',
                    i === 6 && 'text-center',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-text-secondary">
                  No open paper positions.
                </td>
              </tr>
            ) : (
              positions.map((pos) => {
                const marketValue = pos.quantity * pos.currentPrice
                const cost = pos.quantity * pos.avgPrice
                const pnl = marketValue - cost
                const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0

                return (
                  <tr
                    key={pos.id}
                    className="border-b border-border-subtle/40 transition-colors hover:bg-ai/5"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai/10 text-xs font-bold text-ai">
                          {pos.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary">{pos.symbol}</p>
                          <p className="text-[10px] text-text-muted">{pos.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">{pos.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-text-secondary">
                      {formatCurrency(pos.avgPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {formatCurrency(pos.currentPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-medium">
                      {formatCurrency(marketValue)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className={cn('font-mono text-sm font-medium', getChangeColor(pnl))}>
                        {formatCurrency(pnl)}
                      </p>
                      <p className={cn('font-mono text-[10px]', getChangeColor(pnl))}>
                        {formatPercent(pnlPercent)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onClose(pos.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2.5 py-1.5 text-[11px] font-medium text-danger transition-colors hover:bg-danger/20"
                      >
                        <X className="h-3 w-3" />
                        Close
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </TerminalCard>
  )
}
