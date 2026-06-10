import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { StatusBadge } from '@/components/ui/Badge'
import type { IbkrOpenOrder } from '@/types/ibkr'
import { cn } from '@/lib/utils'

interface PendingOrdersTableProps {
  orders: IbkrOpenOrder[]
  loading?: boolean
}

export function PendingOrdersTable({ orders, loading = false }: PendingOrdersTableProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Pending Orders"
          description="Open orders from your connected IBKR account"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {['Order ID', 'Symbol', 'Side', 'Type', 'Qty', 'Filled', 'Remaining', 'Status'].map(
                (h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                      i >= 4 && 'text-right',
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
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-text-secondary">
                  Loading orders…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-text-secondary">
                  No pending orders on this account.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-b border-border-subtle/40 transition-colors hover:bg-warning/5"
                >
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{order.orderId}</td>
                  <td className="px-4 py-3 font-bold text-ai">{order.symbol}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.action.toLowerCase() === 'buy' ? 'buy' : 'sell'} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{order.orderType}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{order.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{order.filled}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{order.remaining}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status.toLowerCase()} />
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
