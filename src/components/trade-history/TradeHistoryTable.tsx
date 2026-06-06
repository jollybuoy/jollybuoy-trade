import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { StatusBadge } from '@/components/ui/Badge'
import type { TradeHistoryRecord } from '@/types/tradeHistory'
import { cn, formatCurrency, formatDateTime, formatPercent, getChangeColor } from '@/lib/utils'

interface TradeHistoryTableProps {
  trades: TradeHistoryRecord[]
}

export function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Trade History"
          description={`${trades.length} records matching filters`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {[
                'Date/Time',
                'Symbol',
                'Strategy',
                'Side',
                'Qty',
                'Entry',
                'Exit',
                'Realized P/L',
                'Return %',
                'Status',
              ].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                    i > 3 && i < 9 && 'text-right',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-sm text-text-secondary">
                  No trades match the current filters.
                </td>
              </tr>
            ) : (
              trades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-border-subtle/40 transition-colors hover:bg-ai/5"
                >
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                    {formatDateTime(trade.timestamp)}
                  </td>
                  <td className="px-4 py-3 font-bold text-ai">{trade.symbol}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{trade.strategy}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={trade.side} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{trade.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {formatCurrency(trade.entryPrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {formatCurrency(trade.exitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        'font-mono text-sm font-medium',
                        getChangeColor(trade.realizedPnL),
                      )}
                    >
                      {formatCurrency(trade.realizedPnL)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        'inline-flex rounded-md px-2 py-0.5 font-mono text-xs font-medium',
                        trade.returnPercent >= 0
                          ? 'bg-accent/10 text-accent'
                          : 'bg-danger/10 text-danger',
                      )}
                    >
                      {formatPercent(trade.returnPercent)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={trade.status} />
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
