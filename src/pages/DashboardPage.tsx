import { TrendingUp, Wallet, DollarSign, Activity } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { PortfolioChart, AllocationChart, AllocationLegend } from '@/components/charts/PortfolioChart'
import {
  portfolioSummary,
  marketIndices,
  portfolioHistory,
  positions,
  sectorAllocation,
  recentActivity,
} from '@/data/mockData'
import {
  formatCurrency,
  formatPercent,
  getChangeColor,
  getPositionPnL,
  formatDateTime,
} from '@/lib/utils'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const topPositions = positions.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Portfolio Value"
          value={formatCurrency(portfolioSummary.totalValue)}
          change={`${formatPercent(portfolioSummary.dayChangePercent)} (${formatCurrency(portfolioSummary.dayChange)}) today`}
          changeValue={portfolioSummary.dayChangePercent}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          label="Total P&L"
          value={formatCurrency(portfolioSummary.totalPnL)}
          change={formatPercent(portfolioSummary.totalPnLPercent) + ' all time'}
          changeValue={portfolioSummary.totalPnLPercent}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Cash Available"
          value={formatCurrency(portfolioSummary.cash)}
          change={`Buying power: ${formatCurrency(portfolioSummary.buyingPower)}`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Open Positions"
          value={String(positions.length)}
          change="Across 4 sectors"
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {marketIndices.map((index) => (
          <div
            key={index.name}
            className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-elevated px-4 py-2.5"
          >
            <span className="text-xs font-medium text-text-secondary">{index.name}</span>
            <span className="font-mono text-sm font-semibold text-text-primary">
              {index.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
            <span className={cn('text-xs font-medium', getChangeColor(index.changePercent))}>
              {formatPercent(index.changePercent)}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Portfolio Performance" description="Last 6 months" />
          <PortfolioChart data={portfolioHistory} />
        </Card>

        <Card>
          <CardHeader title="Sector Allocation" description="By market value" />
          <AllocationChart data={sectorAllocation} />
          <AllocationLegend data={sectorAllocation} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Top Holdings" description="Largest positions by value" />
          <DataTable
            data={topPositions}
            keyExtractor={(p) => p.symbol}
            columns={[
              {
                key: 'symbol',
                header: 'Symbol',
                render: (p) => (
                  <div>
                    <span className="font-semibold">{p.symbol}</span>
                    <span className="ml-2 text-text-secondary">{p.name}</span>
                  </div>
                ),
              },
              {
                key: 'shares',
                header: 'Shares',
                align: 'right',
                render: (p) => <span className="font-mono">{p.shares}</span>,
              },
              {
                key: 'price',
                header: 'Price',
                align: 'right',
                render: (p) => (
                  <span className="font-mono">{formatCurrency(p.currentPrice)}</span>
                ),
              },
              {
                key: 'pnl',
                header: 'P&L',
                align: 'right',
                render: (p) => {
                  const { pnl, pnlPercent } = getPositionPnL(p)
                  return (
                    <span className={cn('font-mono', getChangeColor(pnl))}>
                      {formatCurrency(pnl)} ({formatPercent(pnlPercent)})
                    </span>
                  )
                },
              },
            ]}
          />
        </Card>

        <Card>
          <CardHeader title="Recent Activity" />
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div>
                  <p className="text-sm text-text-primary">{activity.message}</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {formatDateTime(activity.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
