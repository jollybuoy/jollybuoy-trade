import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { BacktestTrade } from '@/types/backtesting'
import { cn, formatCurrency, formatDate, formatPercent } from '@/lib/utils'

interface BacktestTradesTableProps {
  trades: BacktestTrade[]
}

export function BacktestTradesTable({ trades }: BacktestTradesTableProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Backtest Trades"
          description={`${trades.length} simulated trades shown (sample)`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {['Date', 'Symbol', 'Entry', 'Exit', 'P/L', 'Return %', 'Strategy'].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                    i > 0 && i < 6 && 'text-right',
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
                className="border-b border-border-subtle/40 transition-colors hover:bg-ai/5"
              >
                <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                  {formatDate(trade.date)}
                </td>
                <td className="px-4 py-3">
                  <span className="font-bold text-text-primary">{trade.symbol}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {formatCurrency(trade.entry)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {formatCurrency(trade.exit)}
                </td>
                <td
                  className={cn(
                    'px-4 py-3 text-right font-mono text-sm font-semibold',
                    trade.pnl >= 0 ? 'text-accent' : 'text-danger',
                  )}
                >
                  {formatCurrency(trade.pnl)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={cn(
                      'inline-flex rounded-md px-2 py-0.5 font-mono text-xs font-medium',
                      trade.returnPercent >= 0 ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger',
                    )}
                  >
                    {formatPercent(trade.returnPercent)}
                  </span>
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
