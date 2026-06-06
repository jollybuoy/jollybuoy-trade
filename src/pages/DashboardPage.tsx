import { BotStatusCard } from '@/components/terminal/BotStatusCard'
import { RiskControlPanel } from '@/components/terminal/RiskControlPanel'
import { PerformanceChart } from '@/components/terminal/PerformanceChart'
import { OpenPositionsTable } from '@/components/terminal/OpenPositionsTable'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { StatCard } from '@/components/ui/StatCard'
import { AllocationChart, AllocationLegend } from '@/components/charts/PortfolioChart'
import {
  portfolioSummary,
  marketIndices,
  portfolioHistory,
  positions,
  sectorAllocation,
  recentActivity,
  botStatus,
  riskControls,
} from '@/data/mockData'
import {
  formatCurrency,
  formatPercent,
  getChangeColor,
  formatDateTime,
  cn,
} from '@/lib/utils'
import { TrendingUp, Wallet, DollarSign, BrainCircuit, Activity } from 'lucide-react'

const activityColors: Record<string, string> = {
  trade: 'bg-accent',
  alert: 'bg-warning',
  strategy: 'bg-ai',
  system: 'bg-text-muted',
}

export function DashboardPage() {
  return (
    <div className="terminal-grid space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent pulse-live" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
            Live Terminal · Paper Mode
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Command <span className="text-gradient-ai">Center</span>
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          variant="terminal"
          label="Portfolio Value"
          value={formatCurrency(portfolioSummary.totalValue)}
          change={`${formatPercent(portfolioSummary.dayChangePercent)} (${formatCurrency(portfolioSummary.dayChange)}) today`}
          changeValue={portfolioSummary.dayChangePercent}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          variant="terminal"
          label="Total P&L"
          value={formatCurrency(portfolioSummary.totalPnL)}
          change={`${formatPercent(portfolioSummary.totalPnLPercent)} all time`}
          changeValue={portfolioSummary.totalPnLPercent}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          variant="terminal"
          label="AI Signals"
          value="12"
          change="3 high-confidence today"
          icon={<BrainCircuit className="h-4 w-4" />}
        />
        <StatCard
          variant="terminal"
          label="Buying Power"
          value={formatCurrency(portfolioSummary.buyingPower)}
          change={`Cash: ${formatCurrency(portfolioSummary.cash)}`}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {marketIndices.map((index) => (
          <div
            key={index.name}
            className="flex shrink-0 items-center gap-3 rounded-lg border border-border-subtle bg-surface-elevated/80 px-4 py-2 terminal-glow"
          >
            <Activity className="h-3 w-3 text-ai" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {index.name}
            </span>
            <span className="font-mono text-sm font-bold text-text-primary">
              {index.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
            <span className={cn('font-mono text-xs font-medium', getChangeColor(index.changePercent))}>
              {formatPercent(index.changePercent)}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <BotStatusCard bot={botStatus} />
        <RiskControlPanel risk={riskControls} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <PerformanceChart data={portfolioHistory} />

        <TerminalCard>
          <TerminalCardHeader title="Sector Allocation" description="By market value" />
          <AllocationChart data={sectorAllocation} />
          <AllocationLegend data={sectorAllocation} />
        </TerminalCard>
      </div>

      <OpenPositionsTable positions={positions} />

      <div className="grid gap-6 lg:grid-cols-3">
        <TerminalCard className="lg:col-span-2">
          <TerminalCardHeader title="AI Activity Feed" description="Real-time system events" />
          <div className="space-y-1">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-hover/50"
              >
                <div
                  className={cn(
                    'mt-1 h-2 w-2 shrink-0 rounded-full',
                    activityColors[activity.type] ?? 'bg-text-muted',
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm text-text-primary">{activity.message}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-text-muted">
                    {formatDateTime(activity.time)}
                  </p>
                </div>
                <span className="rounded bg-surface-hover px-1.5 py-0.5 text-[10px] uppercase text-text-muted">
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </TerminalCard>

        <TerminalCard glow="ai">
          <TerminalCardHeader title="Quick Stats" />
          <div className="space-y-3">
            {[
              { label: 'Win Rate (30d)', value: '68.4%', color: 'text-accent' },
              { label: 'Sharpe Ratio', value: '1.82', color: 'text-ai' },
              { label: 'Max Drawdown', value: '-3.2%', color: 'text-warning' },
              { label: 'Active Strategies', value: '2 / 4', color: 'text-text-primary' },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between rounded-lg border border-border-subtle/60 bg-surface/40 px-3 py-2"
              >
                <span className="text-xs text-text-secondary">{s.label}</span>
                <span className={cn('font-mono text-sm font-bold', s.color)}>{s.value}</span>
              </div>
            ))}
          </div>
        </TerminalCard>
      </div>
    </div>
  )
}
