import { useMemo } from 'react'
import { BotStatusCard } from '@/components/terminal/BotStatusCard'
import { RiskControlPanel } from '@/components/terminal/RiskControlPanel'
import { PerformanceChart } from '@/components/terminal/PerformanceChart'
import { OpenPositionsTable } from '@/components/terminal/OpenPositionsTable'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { StatCard } from '@/components/ui/StatCard'
import { AllocationChart, AllocationLegend } from '@/components/charts/PortfolioChart'
import { LiveQuoteStrip } from '@/components/market/LiveQuoteStrip'
import { MarketDataBanner } from '@/components/market/MarketDataBanner'
import { useIbkrData } from '@/hooks/useIbkrData'
import {
  formatIbkrCurrency,
  getIbkrDisconnectedMessage,
  mapIbkrPositionToDashboardPosition,
} from '@/services/ibkrMappers'
import {
  portfolioHistory,
  sectorAllocation,
  recentActivity,
  botStatus,
  riskControls,
} from '@/data/mockData'
import { formatDateTime, cn } from '@/lib/utils'
import { TrendingUp, Wallet, DollarSign, BrainCircuit } from 'lucide-react'

const activityColors: Record<string, string> = {
  trade: 'bg-accent',
  alert: 'bg-warning',
  strategy: 'bg-ai',
  system: 'bg-text-muted',
}

export function DashboardPage() {
  const { account, positions, loading, refreshing, error, status, lastUpdated, refresh } =
    useIbkrData({ refreshIntervalMs: 60_000 })

  const dashboardPositions = useMemo(
    () => positions.map(mapIbkrPositionToDashboardPosition),
    [positions],
  )

  const currency = account?.currency ?? 'USD'
  const connected = Boolean(status?.connected && account)

  return (
    <div className="terminal-grid space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent pulse-live" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
            IBKR Paper Trading Mode
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Command <span className="text-gradient-ai">Center</span>
        </h1>
      </div>

      <MarketDataBanner
        loading={loading && !account}
        refreshing={refreshing}
        errorMessage={connected ? null : getIbkrDisconnectedMessage(error ?? status?.error)}
        lastUpdated={lastUpdated}
        onRetry={() => void refresh()}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          variant="terminal"
          label="Net Liquidation"
          value={
            connected
              ? formatIbkrCurrency(account!.netLiquidation, currency)
              : loading
                ? '…'
                : '—'
          }
          change={
            connected
              ? `Available funds: ${formatIbkrCurrency(account!.availableFunds, currency)}`
              : 'Connect IB Gateway paper account'
          }
          changeValue={account?.unrealizedPnL ?? 0}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          variant="terminal"
          label="Unrealized P/L"
          value={
            connected
              ? formatIbkrCurrency(account!.unrealizedPnL, currency)
              : loading
                ? '…'
                : '—'
          }
          change={
            connected
              ? `Realized P/L: ${formatIbkrCurrency(account!.realizedPnL, currency)}`
              : 'Paper account only'
          }
          changeValue={account?.unrealizedPnL ?? 0}
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
          value={
            connected
              ? formatIbkrCurrency(account!.buyingPower, currency)
              : loading
                ? '…'
                : '—'
          }
          change={
            connected
              ? `Cash: ${formatIbkrCurrency(account!.totalCashValue, currency)}`
              : 'No live trading enabled'
          }
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      <LiveQuoteStrip />

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

      <OpenPositionsTable
        positions={dashboardPositions}
        loading={loading && !connected}
        emptyMessage="No open paper positions yet."
      />

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
          <TerminalCardHeader
            title="IBKR Paper Account"
            description={connected ? account!.accountId : 'Disconnected'}
          />
          <div className="space-y-3">
            {[
              {
                label: 'Gross Position Value',
                value: connected ? formatIbkrCurrency(account!.grossPositionValue, currency) : '—',
              },
              {
                label: 'Available Funds',
                value: connected ? formatIbkrCurrency(account!.availableFunds, currency) : '—',
              },
              {
                label: 'Excess Liquidity',
                value: connected ? formatIbkrCurrency(account!.excessLiquidity, currency) : '—',
              },
              {
                label: 'Realized P/L',
                value: connected ? formatIbkrCurrency(account!.realizedPnL, currency) : '—',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-border-subtle/60 bg-surface/40 px-3 py-2"
              >
                <span className="text-xs text-text-secondary">{item.label}</span>
                <span className="font-mono text-sm font-bold text-text-primary">{item.value}</span>
              </div>
            ))}
          </div>
        </TerminalCard>
      </div>
    </div>
  )
}
