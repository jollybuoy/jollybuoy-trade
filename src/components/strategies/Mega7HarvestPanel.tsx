import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Clock, Pause, Play, RefreshCw, ShieldAlert, Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  emergencyStopMega7Strategy,
  getMega7StrategyStatus,
  pauseMega7Strategy,
  runMega7StrategyOnce,
  startMega7Strategy,
} from '@/services/strategyApi'
import type { Mega7StrategyStatus } from '@/types/mega7Strategy'
import { cn } from '@/lib/utils'

interface Mega7HarvestPanelProps {
  connected: boolean
}

const actionButtonClass =
  'inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50'

export function Mega7HarvestPanel({ connected }: Mega7HarvestPanelProps) {
  const [status, setStatus] = useState<Mega7StrategyStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const next = await getMega7StrategyStatus()
      setStatus(next)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load strategy status.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => {
      void refresh()
    }, 30_000)
    return () => window.clearInterval(timer)
  }, [refresh])

  const runAction = async (
    key: string,
    fn: () => Promise<Mega7StrategyStatus | { status: Mega7StrategyStatus }>,
  ) => {
    setActionLoading(key)
    setError(null)
    try {
      const result = await fn()
      setStatus('status' in result ? result.status : result)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Strategy action failed.')
    } finally {
      setActionLoading(null)
    }
  }

  const marketOpen = status?.market.open ?? false

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-text-primary">
                JollyBuoy Mega 7 Harvest Strategy
              </h2>
              <Badge variant="info">Paper Trading Only</Badge>
              {status?.running && !status.paused ? (
                <Badge variant="success">Running</Badge>
              ) : (
                <Badge variant="warning">Paused</Badge>
              )}
              {status?.emergencyStop && <Badge variant="danger">Emergency Stop</Badge>}
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              Mega 7 · Scans every {status?.cycleIntervalSeconds ?? 60}s · Books profit at +
              {status?.profitBookPct ?? 0.6}% · Rebuys on -{status?.rebuyDipPct ?? 0.4}% dips · Paper only
            </p>
            {status?.running && !status.paused && status.market.open && (
              <p className="mt-1 text-xs font-medium text-accent">
                Active rotation — frequent buy/sell profit booking on all 7 stocks
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={actionButtonClass}
              disabled={!!actionLoading}
              onClick={() => void refresh()}
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              Refresh
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-on-accent transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!!actionLoading || !connected || status?.emergencyStop}
              onClick={() => void runAction('start', startMega7Strategy)}
            >
              <Play className="h-4 w-4" />
              Start
            </button>
            <button type="button" className={actionButtonClass} disabled={!!actionLoading} onClick={() => void runAction('pause', pauseMega7Strategy)}>
              <Pause className="h-4 w-4" />
              Pause
            </button>
            <button
              type="button"
              className={actionButtonClass}
              disabled={!!actionLoading || !connected || status?.emergencyStop}
              onClick={() =>
                void runAction('run-once', async () => {
                  const result = await runMega7StrategyOnce()
                  return result.status
                })
              }
            >
              <Zap className="h-4 w-4" />
              Run Once
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!!actionLoading}
              onClick={() => void runAction('stop', emergencyStopMega7Strategy)}
            >
              <ShieldAlert className="h-4 w-4" />
              Emergency Stop
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border-subtle bg-surface-hover/40 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
              <Clock className="h-4 w-4" />
              Market Status
            </div>
            <p className={cn('mt-2 text-sm font-semibold', marketOpen ? 'text-accent' : 'text-warning')}>
              {marketOpen ? 'Market Open' : 'Market Closed — strategy paused'}
            </p>
            <p className="mt-1 text-xs text-text-secondary">{status?.market.currentTimeEt ?? '—'} ET</p>
            <p className="mt-1 text-xs text-text-muted">{status?.market.reason}</p>
          </div>

          <div className="rounded-lg border border-border-subtle bg-surface-hover/40 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Paper Account</p>
            <p className="mt-2 text-sm font-semibold text-text-primary">
              {connected && status?.account ? status.account : 'Not connected'}
            </p>
            <p className="mt-1 text-xs text-text-muted">IB Gateway port 4002 only</p>
          </div>

          <div className="rounded-lg border border-border-subtle bg-surface-hover/40 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Allowed Stocks</p>
            <p className="mt-2 flex flex-wrap gap-1.5">
              {(status?.universe ?? []).map((symbol) => (
                <span
                  key={symbol}
                  className="rounded-md bg-ai/10 px-2 py-0.5 font-mono text-xs text-ai ring-1 ring-ai/20"
                >
                  {symbol}
                </span>
              ))}
            </p>
          </div>
        </div>

        {!marketOpen && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            Market closed — strategy paused. Orders are only placed Mon–Fri, 9:30 AM–4:00 PM ET.
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Recent Strategy Logs</h3>
          <span className="text-xs text-text-muted">
            Last cycle: {status?.lastCycleAt ? new Date(status.lastCycleAt).toLocaleString() : 'Never'}
          </span>
        </div>

        <div className="max-h-96 space-y-2 overflow-y-auto">
          {(status?.logs ?? []).length === 0 ? (
            <p className="text-sm text-text-muted">No strategy activity yet. Use Run Once during market hours.</p>
          ) : (
            status?.logs.map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className="rounded-lg border border-border-subtle bg-surface-hover/30 px-3 py-2"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  <Badge
                    variant={
                      entry.level === 'error' ? 'danger' : entry.level === 'warn' ? 'warning' : 'muted'
                    }
                  >
                    {entry.level}
                  </Badge>
                  {entry.symbol && <span className="font-mono text-ai">{entry.symbol}</span>}
                </div>
                <p className="mt-1 text-sm text-text-primary">{entry.message}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
