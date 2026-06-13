import { useMemo } from 'react'
import { Eye } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MarketDataBanner } from '@/components/market/MarketDataBanner'
import { WatchlistTable } from '@/components/watchlist/WatchlistTable'
import { MEGA_CAP_7_SYMBOLS } from '@/data/megaCap7'
import { MEGA_CAP_7_WATCHLIST, WATCHLIST_GROUPS } from '@/data/watchlistAnalytics'
import { useMarketQuotes } from '@/hooks/useMarketQuotes'
import { mergeQuotesIntoWatchlistRows } from '@/services/market/mergeQuotes'

const WATCHLIST_REFRESH_MS = 60_000
const WATCHLIST_GROUP = WATCHLIST_GROUPS[0]

export function WatchlistPage() {
  const symbols = useMemo(() => [...MEGA_CAP_7_SYMBOLS], [])

  const {
    quotes,
    loading,
    refreshing,
    errorMessage,
    symbolErrors,
    lastUpdated,
    refresh,
  } = useMarketQuotes(symbols, { refreshIntervalMs: WATCHLIST_REFRESH_MS })

  const liveRows = useMemo(
    () => mergeQuotesIntoWatchlistRows(MEGA_CAP_7_WATCHLIST, quotes),
    [quotes],
  )

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Watchlist"
        description="Mega Cap 7 US stocks — live price, change %, volume, and market cap"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-ai/20 bg-ai/5 px-3 py-1.5">
            <Eye className="h-4 w-4 text-ai" />
            <span className="text-xs font-medium text-ai">7 symbols · Yahoo Finance</span>
          </div>
        }
      />

      <MarketDataBanner
        loading={loading}
        refreshing={refreshing}
        errorMessage={errorMessage}
        symbolErrorCount={symbolErrors.length}
        lastUpdated={lastUpdated}
        onRetry={() => void refresh()}
      />

      <WatchlistTable
        group={WATCHLIST_GROUP}
        rows={liveRows}
        loading={loading && quotes.length === 0}
      />
    </div>
  )
}
