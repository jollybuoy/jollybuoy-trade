import { PageHeader } from '@/components/ui/PageHeader'
import { IbkrBackendBanner } from '@/components/ibkr/IbkrBackendBanner'
import { Mega7HarvestPanel } from '@/components/strategies/Mega7HarvestPanel'
import { useIbkrData } from '@/hooks/useIbkrData'

export function StrategiesPage() {
  const { loading, error, connected, lastUpdated, refresh, account } = useIbkrData()

  return (
    <div className="terminal-grid space-y-8">
      <PageHeader
        title="Strategies"
        description="JollyBuoy Mega 7 Harvest Strategy — paper trading only, US market hours"
        action={
          <div className="rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent">
            Paper · {connected ? (account?.accountId ?? 'Connected') : 'Not connected'}
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

      <Mega7HarvestPanel connected={connected} />
    </div>
  )
}
