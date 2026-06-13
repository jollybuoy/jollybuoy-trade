import { useMemo } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { IbkrAccountSummaryCards } from '@/components/ibkr/IbkrAccountSummaryCards'
import { IbkrBackendBanner } from '@/components/ibkr/IbkrBackendBanner'
import { PortfolioHoldingsTable } from '@/components/portfolio/PortfolioHoldingsTable'
import { useIbkrData } from '@/hooks/useIbkrData'
import { loadAccountSettings } from '@/lib/settingsStorage'
import { mapIbkrPositionToPortfolioHolding } from '@/services/ibkrMappers'

export function PortfolioPage() {
  const { account, positions, loading, error, connected, accountId, lastUpdated, refresh } =
    useIbkrData()
  const settings = loadAccountSettings()

  const holdings = useMemo(
    () => positions.map(mapIbkrPositionToPortfolioHolding),
    [positions],
  )

  const modeLabel = settings.brokerSession.linkedMode === 'live' ? 'Live' : 'Paper'

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Portfolio"
        description={
          connected && accountId
            ? `Live ${modeLabel} account ${accountId} from IB Gateway port ${settings.brokerSession.linkedMode === 'live' ? '4001' : '4002'}`
            : 'Connect IB Gateway paper account (port 4002) in Settings to load live holdings'
        }
        action={
          <div className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent">
            {connected && accountId ? `${modeLabel} · ${accountId}` : 'Not Connected'}
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
        emptyMessage={
          connected
            ? 'No open positions in this IBKR account.'
            : 'Connect your paper account in Settings (IB Gateway port 4002).'
        }
      />
    </div>
  )
}
