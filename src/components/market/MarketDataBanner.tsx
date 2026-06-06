import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarketDataBannerProps {
  loading?: boolean
  refreshing?: boolean
  errorMessage?: string | null
  symbolErrorCount?: number
  lastUpdated?: Date | null
  onRetry?: () => void
  className?: string
}

export function MarketDataBanner({
  loading = false,
  refreshing = false,
  errorMessage,
  symbolErrorCount = 0,
  lastUpdated,
  onRetry,
  className,
}: MarketDataBannerProps) {
  if (!loading && !errorMessage && symbolErrorCount === 0 && !refreshing) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-sm',
        errorMessage
          ? 'border-warning/30 bg-warning/5 text-warning'
          : 'border-border-subtle bg-surface/40 text-text-secondary',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-ai" />
        ) : errorMessage ? (
          <AlertTriangle className="h-4 w-4 shrink-0" />
        ) : refreshing ? (
          <RefreshCw className="h-4 w-4 animate-spin text-ai" />
        ) : null}

        <span>
          {loading && 'Loading live market data…'}
          {!loading && errorMessage}
          {!loading &&
            !errorMessage &&
            symbolErrorCount > 0 &&
            `${symbolErrorCount} symbol${symbolErrorCount === 1 ? '' : 's'} unavailable — showing cached mock fields.`}
          {!loading && !errorMessage && symbolErrorCount === 0 && refreshing && 'Refreshing quotes…'}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-text-muted">
        {lastUpdated && !loading && (
          <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        )}
        {errorMessage && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded border border-warning/30 px-2 py-1 text-warning transition-colors hover:bg-warning/10"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}
