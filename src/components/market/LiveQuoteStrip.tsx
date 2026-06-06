import { Activity } from 'lucide-react'
import { MarketDataBanner } from '@/components/market/MarketDataBanner'
import { useMarketQuotes } from '@/hooks/useMarketQuotes'
import { cn, formatCurrency, formatPercent, getChangeColor } from '@/lib/utils'

export const DASHBOARD_LIVE_SYMBOLS = ['NVDA', 'AMD', 'PLTR', 'AVGO', 'MSFT', 'GOOG'] as const

interface LiveQuoteStripProps {
  symbols?: readonly string[]
  refreshIntervalMs?: number
}

export function LiveQuoteStrip({
  symbols = DASHBOARD_LIVE_SYMBOLS,
  refreshIntervalMs = 60_000,
}: LiveQuoteStripProps) {
  const {
    quotesBySymbol,
    loading,
    refreshing,
    errorMessage,
    symbolErrors,
    lastUpdated,
    refresh,
  } = useMarketQuotes([...symbols], { refreshIntervalMs })

  const hasLiveQuotes = quotesBySymbol.size > 0 && !errorMessage

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-md border border-warning/20 bg-warning/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-warning">
          Demo market data
        </span>
        {!hasLiveQuotes && !loading && (
          <span className="text-[10px] text-text-muted">
            Yahoo quotes unavailable in this environment
          </span>
        )}
      </div>

      <MarketDataBanner
        loading={loading}
        refreshing={refreshing}
        errorMessage={errorMessage}
        symbolErrorCount={symbolErrors.length}
        lastUpdated={lastUpdated}
        onRetry={() => void refresh()}
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {symbols.map((symbol) => {
          const quote = quotesBySymbol.get(symbol)
          const changePercent = quote?.dailyChangePercent ?? 0

          return (
            <div
              key={symbol}
              className="flex shrink-0 items-center gap-3 rounded-lg border border-border-subtle bg-surface-elevated/80 px-4 py-2 terminal-glow"
            >
              <Activity className="h-3 w-3 text-ai" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {symbol}
              </span>
              {loading && !quote ? (
                <span className="h-4 w-16 animate-pulse rounded bg-surface-hover" />
              ) : quote ? (
                <>
                  <span className="font-mono text-sm font-bold text-text-primary">
                    {formatCurrency(quote.currentPrice)}
                  </span>
                  <span
                    className={cn('font-mono text-xs font-medium', getChangeColor(changePercent))}
                  >
                    {formatPercent(changePercent)}
                  </span>
                </>
              ) : (
                <span className="font-mono text-xs text-text-muted">—</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
