import { useMemo } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MarketDataBanner } from '@/components/market/MarketDataBanner'
import { PortfolioSummaryCards } from '@/components/portfolio/PortfolioSummaryCards'
import { PortfolioHoldingsTable } from '@/components/portfolio/PortfolioHoldingsTable'
import { PortfolioAnalytics } from '@/components/portfolio/PortfolioAnalytics'
import { PortfolioCsvUpload } from '@/components/portfolio/PortfolioCsvUpload'
import { useIbkrData } from '@/hooks/useIbkrData'
import {
  getIbkrDisconnectedMessage,
  mapIbkrAccountToPortfolioSummary,
  mapIbkrPositionToPortfolioHolding,
} from '@/services/ibkrMappers'
import {
  ASSET_ALLOCATION,
  RISK_EXPOSURE,
  SECTOR_ALLOCATION,
  TOP_LOSERS,
  TOP_WINNERS,
} from '@/data/portfolioAnalytics'
import type { PortfolioSummary } from '@/types/portfolio'

const EMPTY_SUMMARY: PortfolioSummary = {
  totalValue: 0,
  cashBalance: 0,
  investedValue: 0,
  unrealizedPnL: 0,
  unrealizedPnLPercent: 0,
  realizedPnL: 0,
  dayChangePercent: 0,
  dayChange: 0,
}

export function PortfolioPage() {
  const { account, positions, loading, refreshing, error, status, lastUpdated, refresh } =
    useIbkrData({ refreshIntervalMs: 60_000 })

  const summary = account ? mapIbkrAccountToPortfolioSummary(account) : EMPTY_SUMMARY
  const holdings = useMemo(
    () => positions.map(mapIbkrPositionToPortfolioHolding),
    [positions],
  )
  const connected = Boolean(status?.connected && account)

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Portfolio"
        description="Live IBKR paper holdings, allocation, and account summary"
        action={
          <div className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent">
            IBKR Paper Trading Mode
          </div>
        }
      />

      <MarketDataBanner
        loading={loading && !account}
        refreshing={refreshing}
        errorMessage={connected ? null : getIbkrDisconnectedMessage(error ?? status?.error)}
        lastUpdated={lastUpdated}
        onRetry={() => void refresh()}
      />

      <PortfolioSummaryCards summary={connected ? summary : EMPTY_SUMMARY} />

      <PortfolioAnalytics
        sectorAllocation={connected && holdings.length > 0 ? SECTOR_ALLOCATION : []}
        assetAllocation={connected && holdings.length > 0 ? ASSET_ALLOCATION : []}
        topWinners={connected && holdings.length > 0 ? TOP_WINNERS : []}
        topLosers={connected && holdings.length > 0 ? TOP_LOSERS : []}
        riskExposure={connected && holdings.length > 0 ? RISK_EXPOSURE : RISK_EXPOSURE}
      />

      <PortfolioHoldingsTable
        holdings={holdings}
        totalPortfolioValue={summary.totalValue}
        loading={loading && !connected}
        emptyMessage="No paper positions found. Place a paper trade from IBKR/TWS or later from JollyBuoy Trade."
      />

      <PortfolioCsvUpload />
    </div>
  )
}
