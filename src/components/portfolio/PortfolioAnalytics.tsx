import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Shield } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { AllocationLegend } from '@/components/charts/PortfolioChart'
import type { AllocationSlice, MoverItem, RiskExposure } from '@/types/portfolio'
import { chartStyles } from '@/lib/chartStyles'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

const CHART_COLORS = ['#22d3a5', '#5b9dff', '#f5a623', '#ff5c5c', '#64748b', '#22d3ee']

interface PortfolioAnalyticsProps {
  sectorAllocation: AllocationSlice[]
  assetAllocation: AllocationSlice[]
  topWinners: MoverItem[]
  topLosers: MoverItem[]
  riskExposure: RiskExposure
}

export function PortfolioAnalytics({
  sectorAllocation,
  assetAllocation,
  topWinners,
  topLosers,
  riskExposure,
}: PortfolioAnalyticsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AllocationCard title="Sector Allocation" data={sectorAllocation} />
      <AllocationCard title="Asset Allocation" data={assetAllocation} />

      <MoversCard title="Top Winners" items={topWinners} type="winner" />
      <MoversCard title="Top Losers" items={topLosers} type="loser" />

      <TerminalCard className="lg:col-span-2" glow="ai">
        <TerminalCardHeader
          title="Risk Exposure"
          description="Portfolio concentration and market sensitivity"
          badge={
            <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
              <Shield className="h-3 w-3" />
              MODERATE
            </span>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <RiskMetric label="Portfolio Beta" value={riskExposure.portfolioBeta.toFixed(2)} />
          <RiskMetric
            label="Max Single Position"
            value={`${riskExposure.maxSinglePosition.toFixed(1)}%`}
            warning={riskExposure.maxSinglePosition > 15}
          />
          <RiskMetric
            label="Top Sector Weight"
            value={`${riskExposure.topSectorConcentration.toFixed(1)}%`}
            warning={riskExposure.topSectorConcentration > 50}
          />
          <RiskMetric
            label="Tech Exposure"
            value={`${riskExposure.techExposure.toFixed(1)}%`}
          />
          <RiskMetric
            label="International"
            value={`${riskExposure.internationalExposure.toFixed(1)}%`}
          />
        </div>
      </TerminalCard>
    </div>
  )
}

function AllocationCard({ title, data }: { title: string; data: AllocationSlice[] }) {
  return (
    <TerminalCard>
      <TerminalCardHeader title={title} />
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            {...chartStyles.tooltip}
            formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Allocation']}
          />
        </PieChart>
      </ResponsiveContainer>
      <AllocationLegend data={data} />
    </TerminalCard>
  )
}

function MoversCard({
  title,
  items,
  type,
}: {
  title: string
  items: MoverItem[]
  type: 'winner' | 'loser'
}) {
  const Icon = type === 'winner' ? TrendingUp : TrendingDown

  return (
    <TerminalCard>
      <TerminalCardHeader title={title} />
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.symbol}
            className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface/40 px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-hover text-[10px] font-bold text-text-muted">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-text-primary">{item.symbol}</p>
                <p className="text-[10px] text-text-muted">{item.company}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  'flex items-center justify-end gap-1 font-mono text-sm font-bold',
                  item.pnl >= 0 ? 'text-accent' : 'text-danger',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {formatCurrency(item.pnl)}
              </p>
              <p className={cn('font-mono text-[10px]', item.pnl >= 0 ? 'text-accent' : 'text-danger')}>
                {formatPercent(item.pnlPercent)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </TerminalCard>
  )
}

function RiskMetric({
  label,
  value,
  warning,
}: {
  label: string
  value: string
  warning?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2.5',
        warning ? 'border-warning/30 bg-warning/5' : 'border-border-subtle bg-surface/40',
      )}
    >
      <p className="text-[10px] uppercase tracking-wider text-text-muted">{label}</p>
      <p
        className={cn(
          'mt-0.5 font-mono text-lg font-bold',
          warning ? 'text-warning' : 'text-text-primary',
        )}
      >
        {value}
      </p>
    </div>
  )
}
