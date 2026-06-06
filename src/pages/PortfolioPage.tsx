import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { PortfolioChart, AllocationChart, AllocationLegend } from '@/components/charts/PortfolioChart'
import { positions, portfolioSummary, portfolioHistory, sectorAllocation } from '@/data/mockData'
import {
  formatCurrency,
  formatPercent,
  getChangeColor,
  getPositionPnL,
  getPositionValue,
} from '@/lib/utils'
import { cn } from '@/lib/utils'

export function PortfolioPage() {
  const totalInvested = positions.reduce((sum, p) => sum + p.shares * p.avgCost, 0)
  const totalMarketValue = positions.reduce((sum, p) => sum + getPositionValue(p), 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        description="Track your holdings, allocation, and performance"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Value"
          value={formatCurrency(portfolioSummary.totalValue)}
          change={`${formatPercent(portfolioSummary.dayChangePercent)} today`}
          changeValue={portfolioSummary.dayChangePercent}
        />
        <StatCard
          label="Invested"
          value={formatCurrency(totalInvested)}
        />
        <StatCard
          label="Market Value"
          value={formatCurrency(totalMarketValue)}
        />
        <StatCard
          label="Unrealized P&L"
          value={formatCurrency(portfolioSummary.totalPnL)}
          change={formatPercent(portfolioSummary.totalPnLPercent)}
          changeValue={portfolioSummary.totalPnLPercent}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Performance History" />
          <PortfolioChart data={portfolioHistory} />
        </Card>

        <Card>
          <CardHeader title="Allocation" />
          <AllocationChart data={sectorAllocation} />
          <AllocationLegend data={sectorAllocation} />
        </Card>
      </div>

      <Card padding="none">
        <div className="border-b border-border-subtle p-5">
          <CardHeader title="All Positions" description={`${positions.length} holdings`} />
        </div>
        <DataTable
          data={positions}
          keyExtractor={(p) => p.symbol}
          columns={[
            {
              key: 'symbol',
              header: 'Symbol',
              render: (p) => (
                <div>
                  <p className="font-semibold">{p.symbol}</p>
                  <p className="text-xs text-text-secondary">{p.name}</p>
                </div>
              ),
            },
            { key: 'sector', header: 'Sector', render: (p) => p.sector },
            {
              key: 'shares',
              header: 'Shares',
              align: 'right',
              render: (p) => <span className="font-mono">{p.shares}</span>,
            },
            {
              key: 'avgCost',
              header: 'Avg Cost',
              align: 'right',
              render: (p) => <span className="font-mono">{formatCurrency(p.avgCost)}</span>,
            },
            {
              key: 'currentPrice',
              header: 'Current',
              align: 'right',
              render: (p) => (
                <span className="font-mono">{formatCurrency(p.currentPrice)}</span>
              ),
            },
            {
              key: 'value',
              header: 'Market Value',
              align: 'right',
              render: (p) => (
                <span className="font-mono">{formatCurrency(getPositionValue(p))}</span>
              ),
            },
            {
              key: 'pnl',
              header: 'P&L',
              align: 'right',
              render: (p) => {
                const { pnl, pnlPercent } = getPositionPnL(p)
                return (
                  <div className={cn('font-mono', getChangeColor(pnl))}>
                    <p>{formatCurrency(pnl)}</p>
                    <p className="text-xs">{formatPercent(pnlPercent)}</p>
                  </div>
                )
              },
            },
          ]}
        />
      </Card>
    </div>
  )
}
