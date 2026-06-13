import { RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { IbkrBackendBanner } from '@/components/ibkr/IbkrBackendBanner'
import { AccountPnLSummary } from '@/components/trade-history/AccountPnLSummary'
import { PendingOrdersTable } from '@/components/trade-history/PendingOrdersTable'
import { ExecutedOrdersTable } from '@/components/trade-history/ExecutedOrdersTable'
import { useIbkrData } from '@/hooks/useIbkrData'

export function TradeHistoryPage() {
  const {
    account,
    openOrders,
    executions,
    loading,
    error,
    connected,
    lastUpdated,
    refresh,
  } = useIbkrData()

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Trade History"
        description="Live pending orders, executed fills, and P/L from your connected IBKR account"
        action={
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-ai/30 bg-ai/10 px-4 py-2 text-sm font-medium text-ai transition-colors hover:bg-ai/20 disabled:opacity-50"
          >
            <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            Refresh
          </button>
        }
      />

      <IbkrBackendBanner
        loading={loading}
        error={error}
        connected={connected}
        lastUpdated={lastUpdated}
        onRetry={() => void refresh()}
      />

      <AccountPnLSummary
        account={account}
        pendingCount={openOrders.length}
        executedCount={executions.length}
        connected={connected}
      />

      <PendingOrdersTable orders={openOrders} loading={loading && !connected} />

      <ExecutedOrdersTable executions={executions} loading={loading && !connected} />
    </div>
  )
}
