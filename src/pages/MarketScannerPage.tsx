import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MarketDataBanner } from '@/components/market/MarketDataBanner'
import { MarketOverviewCards } from '@/components/scanner/MarketOverviewCards'
import { ScannerFiltersPanel } from '@/components/scanner/ScannerFiltersPanel'
import { ScannerTable } from '@/components/scanner/ScannerTable'
import { AiInsightPanel } from '@/components/scanner/AiInsightPanel'
import {
  AI_INSIGHTS,
  MARKET_OVERVIEW,
  SCANNER_ROWS,
  SCANNER_STATS,
} from '@/data/marketScanner'
import { useMarketQuotes } from '@/hooks/useMarketQuotes'
import { mergeQuotesIntoScannerRows } from '@/services/market/mergeQuotes'
import { DEFAULT_SCANNER_FILTERS } from '@/types/scanner'
import type { ScannerFilters, ScannerRow } from '@/types/scanner'
import { formatDateTime } from '@/lib/utils'

const SCANNER_REFRESH_MS = 60_000

function filterRows(rows: ScannerRow[], filters: ScannerFilters): ScannerRow[] {
  return rows.filter((row) => {
    if (filters.market !== 'all' && row.market !== filters.market) return false
    if (filters.sector !== 'all' && row.sector !== filters.sector) return false
    if (row.price < filters.priceMin || row.price > filters.priceMax) return false
    if (row.volume < filters.minVolume) return false
    if (filters.signal !== 'all' && row.signal !== filters.signal) return false
    if (filters.strategyMatch !== 'all' && row.strategyMatch !== filters.strategyMatch) return false
    return true
  })
}

export function MarketScannerPage() {
  const [filters, setFilters] = useState<ScannerFilters>(DEFAULT_SCANNER_FILTERS)
  const [isScanning, setIsScanning] = useState(false)

  const symbols = useMemo(() => SCANNER_ROWS.map((row) => row.symbol), [])
  const {
    quotes,
    loading,
    refreshing,
    errorMessage,
    symbolErrors,
    lastUpdated,
    refresh,
  } = useMarketQuotes(symbols, { refreshIntervalMs: SCANNER_REFRESH_MS })

  const liveRows = useMemo(
    () => mergeQuotesIntoScannerRows(SCANNER_ROWS, quotes),
    [quotes],
  )

  const filteredRows = useMemo(() => filterRows(liveRows, filters), [liveRows, filters])

  const runScan = () => {
    setIsScanning(true)
    void refresh().finally(() => {
      setTimeout(() => setIsScanning(false), 600)
    })
  }

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Market Scanner"
        description="AI-powered multi-factor scan across 4,800+ symbols"
        action={
          <button
            type="button"
            onClick={runScan}
            disabled={isScanning || loading}
            className="inline-flex items-center gap-2 rounded-lg border border-ai/30 bg-ai/10 px-4 py-2 text-sm font-medium text-ai transition-colors hover:bg-ai/20 disabled:opacity-50"
          >
            <RefreshCw className={isScanning || refreshing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            {isScanning || refreshing ? 'Scanning…' : 'Run Scan'}
          </button>
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

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-live" />
        {SCANNER_STATS.totalScanned.toLocaleString()} symbols scanned · Last update{' '}
        {lastUpdated ? formatDateTime(lastUpdated.toISOString()) : formatDateTime(SCANNER_STATS.lastScan)}
      </div>

      <MarketOverviewCards cards={MARKET_OVERVIEW} />

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="xl:col-span-1">
          <ScannerFiltersPanel filters={filters} onChange={setFilters} />
        </div>

        <div className="space-y-6 xl:col-span-3">
          <ScannerTable rows={filteredRows} resultCount={filteredRows.length} loading={loading && quotes.length === 0} />
          <AiInsightPanel insights={AI_INSIGHTS} />
        </div>
      </div>
    </div>
  )
}
