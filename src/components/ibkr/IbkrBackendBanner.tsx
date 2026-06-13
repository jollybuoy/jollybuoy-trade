import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IbkrBackendBannerProps {
  loading?: boolean
  error?: string | null
  connected?: boolean
  lastUpdated?: Date | null
  onRetry?: () => void
  className?: string
}

export function IbkrBackendBanner({
  loading = false,
  error,
  connected = false,
  lastUpdated,
  onRetry,
  className,
}: IbkrBackendBannerProps) {
  if (connected && !loading) {
    return null
  }

  const showError = Boolean(error) && !loading

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-sm',
        showError
          ? 'border-warning/30 bg-warning/5 text-warning'
          : 'border-border-subtle bg-surface/40 text-text-secondary',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-ai" />
        ) : showError ? (
          <AlertTriangle className="h-4 w-4 shrink-0" />
        ) : (
          <RefreshCw className="h-4 w-4 animate-spin text-ai" />
        )}
        <span>
          {loading && 'Loading IBKR paper account data…'}
          {!loading && showError && error}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-text-muted">
        {lastUpdated && connected && (
          <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        )}
        {showError && onRetry && (
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
