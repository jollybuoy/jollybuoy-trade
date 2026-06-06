import { useMemo } from 'react'
import { BotStatusCard } from '@/components/terminal/BotStatusCard'
import { RiskControlPanel } from '@/components/terminal/RiskControlPanel'
import { OpenPositionsTable } from '@/components/terminal/OpenPositionsTable'
import { LiveQuoteStrip } from '@/components/market/LiveQuoteStrip'
import { IbkrAccountSummaryCards } from '@/components/ibkr/IbkrAccountSummaryCards'
import { IbkrBackendBanner } from '@/components/ibkr/IbkrBackendBanner'
import { useIbkrData } from '@/hooks/useIbkrData'
import { mapIbkrPositionToDashboardPosition } from '@/services/ibkrMappers'
import { botStatus, riskControls } from '@/data/mockData'

export function DashboardPage() {
  const { account, positions, loading, error, connected, lastUpdated, refresh } = useIbkrData()

  const dashboardPositions = useMemo(
    () => positions.map(mapIbkrPositionToDashboardPosition),
    [positions],
  )

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

      <LiveQuoteStrip />

      <div className="grid gap-6 xl:grid-cols-3">
        <BotStatusCard bot={botStatus} />
        <RiskControlPanel risk={riskControls} />
      </div>

      <OpenPositionsTable
        positions={dashboardPositions}
        loading={loading && !connected}
        emptyMessage="No open IBKR paper positions found."
      />
    </div>
  )
}
