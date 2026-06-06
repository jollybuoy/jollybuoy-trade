import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { StatusBadge } from '@/components/ui/Badge'
import type { PaperTradeRecord } from '@/types/paperTrading'
import { cn, formatCurrency, formatDateTime, getChangeColor } from '@/lib/utils'

interface RecentPaperTradesProps {
  trades: PaperTradeRecord[]
}

export function RecentPaperTrades({ trades }: RecentPaperTradesProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Recent Paper Trades"
          description="Closed and open simulated executions"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {[
                'Time',
                'Symbol',
                'Side',
                'Qty',
                'Entry',
                'Exit',
                'P/L',
                'Strategy',
              ].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                    i > 2 && i < 7 && 'text-right',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className="border-b border-border-subtle/40 transition-colors hover:bg-surface-hover/30"
              >
                <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                  {formatDateTime(trade.timestamp)}
                </td>
                <td className="px-4 py-3 font-bold text-ai">{trade.symbol}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={trade.side} />
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">{trade.quantity}</td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {formatCurrency(trade.entryPrice)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-text-secondary">
                  {trade.exitPrice !== null ? formatCurrency(trade.exitPrice) : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  {trade.pnl !== null ? (
                    <span className={cn('font-mono text-sm font-medium', getChangeColor(trade.pnl))}>
                      {formatCurrency(trade.pnl)}
                    </span>
                  ) : (
                    <span className="text-xs text-text-muted">Open</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{trade.strategy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TerminalCard>
  )
}
