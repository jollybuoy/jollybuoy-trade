import { useMemo } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { IbkrAccountSummaryCards } from '@/components/ibkr/IbkrAccountSummaryCards'
import { IbkrBackendBanner } from '@/components/ibkr/IbkrBackendBanner'
import { PortfolioHoldingsTable } from '@/components/portfolio/PortfolioHoldingsTable'
import { PortfolioCsvUpload } from '@/components/portfolio/PortfolioCsvUpload'
import { useIbkrData } from '@/hooks/useIbkrData'
import { mapIbkrPositionToPortfolioHolding } from '@/services/ibkrMappers'

export function PortfolioPage() {
  const { account, positions, loading, error, connected, lastUpdated, refresh } = useIbkrData()

  const holdings = useMemo(
    () => positions.map(mapIbkrPositionToPortfolioHolding),
    [positions],
  )

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Portfolio"
        description="Live IBKR paper holdings and account summary"
        action={
          <div className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent">
            IBKR Paper Trading Mode
          </div>
        }
      />

      <IbkrBackendBanner
        loading={loading}
        error={error}
        connected={connected}
        lastUpdated={lastUpdated}
        onRetry={() => void refresh()}
      />

      <IbkrAccountSummaryCards
        account={account}
        loading={loading}
        connected={connected}
      />

      <PortfolioHoldingsTable
        holdings={holdings}
        totalPortfolioValue={account?.netLiquidation ?? 0}
        loading={loading && !connected}
        emptyMessage="No open IBKR paper positions found."
      />

      <PortfolioCsvUpload />
    </div>
  )
}
