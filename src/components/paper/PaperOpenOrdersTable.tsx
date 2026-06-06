import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { IbkrOpenOrder } from '@/types/ibkr'
import { cn } from '@/lib/utils'

interface PaperOpenOrdersTableProps {
  orders: IbkrOpenOrder[]
  loading?: boolean
}

export function PaperOpenOrdersTable({ orders, loading = false }: PaperOpenOrdersTableProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Open Orders"
          description="Live IBKR paper orders from Gateway"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {[
                'Order ID',
                'Symbol',
                'Action',
                'Qty',
                'Type',
                'Status',
                'Filled',
                'Remaining',
              ].map((header, index) => (
                <th
                  key={header}
                  className={cn(
                    'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                    index > 0 && 'text-right',
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-text-secondary">
                  Loading IBKR open orders…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-text-secondary">
                  No open paper orders.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-b border-border-subtle/40 transition-colors hover:bg-ai/5"
                >
                  <td className="px-4 py-3 font-mono text-sm">{order.orderId}</td>
                  <td className="px-4 py-3 text-right font-bold text-text-primary">{order.symbol}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{order.action}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{order.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{order.orderType}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{order.status}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{order.filled}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{order.remaining}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </TerminalCard>
  )
}
