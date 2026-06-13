import { Eye } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { PortfolioHolding } from '@/types/portfolio'
import { cn, formatCurrency, formatPercent, getChangeColor } from '@/lib/utils'

interface PortfolioHoldingsTableProps {
  holdings: PortfolioHolding[]
  totalPortfolioValue: number
  loading?: boolean
  emptyMessage?: string
}

export function PortfolioHoldingsTable({
  holdings,
  totalPortfolioValue,
  loading = false,
  emptyMessage = 'No holdings found.',
}: PortfolioHoldingsTableProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Holdings"
          description={`${holdings.length} positions in portfolio`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {[
                'Symbol',
                'Company',
                'Qty',
                'Avg Cost',
                'Current',
                'Market Value',
                'Unrealized P/L',
                'Allocation',
                'Action',
              ].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                    i > 1 && i < 8 && 'text-right',
                    i === 8 && 'text-center',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-text-secondary">
                  Loading IBKR paper holdings…
                </td>
              </tr>
            ) : holdings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-text-secondary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              holdings.map((holding) => {
              const marketValue = holding.quantity * holding.currentPrice
              const cost = holding.quantity * holding.avgCost
              const pnl = marketValue - cost
              const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0
              const allocation = (marketValue / totalPortfolioValue) * 100

              return (
                <tr
                  key={holding.id}
                  className="border-b border-border-subtle/40 transition-colors hover:bg-ai/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai/10 text-xs font-bold text-ai">
                        {holding.symbol.slice(0, 2)}
                      </div>
                      <span className="font-bold text-text-primary">{holding.symbol}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-text-primary">{holding.company}</p>
                    <p className="text-[10px] text-text-muted">{holding.sector}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{holding.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-text-secondary">
                    {formatCurrency(holding.avgCost)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {formatCurrency(holding.currentPrice)}
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-hover">
                        <div
                          className="h-full rounded-full bg-ai"
                          style={{ width: `${Math.min(allocation, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-text-secondary">
                        {allocation.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg border border-border-subtle px-2.5 py-1.5 text-[11px] font-medium text-text-secondary transition-colors hover:border-ai/30 hover:text-ai"
                    >
                      <Eye className="h-3 w-3" />
                      View
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
