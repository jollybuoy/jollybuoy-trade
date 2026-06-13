import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { StatusBadge } from '@/components/ui/Badge'
import type { IbkrExecution } from '@/types/ibkr'
import { cn, formatCurrency, formatDateTime } from '@/lib/utils'

interface ExecutedOrdersTableProps {
  executions: IbkrExecution[]
  loading?: boolean
}

export function ExecutedOrdersTable({ executions, loading = false }: ExecutedOrdersTableProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Executed Orders"
          description="Fill history from your connected IBKR account (current session)"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {['Time', 'Symbol', 'Side', 'Qty', 'Price', 'Commission', 'Exchange'].map(
                (h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                      i >= 3 && i <= 5 && 'text-right',
                    )}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-text-secondary">
                  Loading executions…
                </td>
              </tr>
            ) : executions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-text-secondary">
                  No executed fills returned for this session. Fills appear after orders complete.
                </td>
              </tr>
            ) : (
              executions.map((fill) => (
                <tr
                  key={fill.execId}
                  className="border-b border-border-subtle/40 transition-colors hover:bg-accent/5"
                >
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                    {formatDateTime(fill.timestamp)}
                  </td>
                  <td className="px-4 py-3 font-bold text-ai">{fill.symbol}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={
                        fill.side.toUpperCase().startsWith('B') || fill.side.toUpperCase() === 'BOT'
                          ? 'buy'
                          : 'sell'
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{fill.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {formatCurrency(fill.price)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-text-muted">
                    {formatCurrency(fill.commission)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{fill.exchange}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </TerminalCard>
  )
}
