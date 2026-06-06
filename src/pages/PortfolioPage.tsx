import { PageHeader } from '@/components/ui/PageHeader'
import { PortfolioSummaryCards } from '@/components/portfolio/PortfolioSummaryCards'
import { PortfolioHoldingsTable } from '@/components/portfolio/PortfolioHoldingsTable'
import { PortfolioAnalytics } from '@/components/portfolio/PortfolioAnalytics'
import { PortfolioCsvUpload } from '@/components/portfolio/PortfolioCsvUpload'
import {
  ASSET_ALLOCATION,
  PORTFOLIO_HOLDINGS,
  PORTFOLIO_SUMMARY,
  RISK_EXPOSURE,
  SECTOR_ALLOCATION,
  TOP_LOSERS,
  TOP_WINNERS,
} from '@/data/portfolioAnalytics'

export function PortfolioPage() {
  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Portfolio"
        description="Holdings, allocation, risk exposure, and CSV import"
      />

      <PortfolioSummaryCards summary={PORTFOLIO_SUMMARY} />

      <PortfolioAnalytics
        sectorAllocation={SECTOR_ALLOCATION}
        assetAllocation={ASSET_ALLOCATION}
        topWinners={TOP_WINNERS}
        topLosers={TOP_LOSERS}
        riskExposure={RISK_EXPOSURE}
      />

      <PortfolioHoldingsTable
        holdings={PORTFOLIO_HOLDINGS}
        totalPortfolioValue={PORTFOLIO_SUMMARY.totalValue}
      />

      <PortfolioCsvUpload />
    </div>
  )
}
