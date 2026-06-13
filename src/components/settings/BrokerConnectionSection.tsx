import { Link2, Lock, RefreshCw, Unlink } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { BrokerAccount, BrokerAccountStatus, IbkrAccountMode } from '@/types/settings'
import { cn } from '@/lib/utils'

interface BrokerConnectionSectionProps {
  paper: BrokerAccount
  live: BrokerAccount
  activeMode: IbkrAccountMode
  loading?: boolean
  busyMode?: IbkrAccountMode | null
  busyAction?: 'connect' | 'disconnect' | null
  onRefresh: () => void
  onConnectPaper: () => void
  onConnectLive: () => void
  onDisconnectPaper: () => void
  onDisconnectLive: () => void
  liveConnectLocked?: boolean
}

const statusStyles: Record<
  BrokerAccountStatus,
  { label: string; className: string }
> = {
  connected: { label: 'Connected', className: 'bg-accent/10 text-accent border-accent/20' },
  disconnected: { label: 'Disconnected', className: 'bg-surface-elevated text-text-muted border-border-subtle' },
  pending: { label: 'Checking…', className: 'bg-warning/10 text-warning border-warning/20' },
}

export function BrokerConnectionSection({
  paper,
  live,
  activeMode,
  loading = false,
  busyMode = null,
  busyAction = null,
  onRefresh,
  onConnectPaper,
  onConnectLive,
  onDisconnectPaper,
  onDisconnectLive,
  liveConnectLocked = false,
}: BrokerConnectionSectionProps) {
  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Broker Connection"
        description="Connect or disconnect IBKR Paper (port 4002) or Live (port 4001) via local IB Gateway"
        badge={
          <span className="rounded-md border border-accent/20 bg-accent/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent">
            Active: {activeMode === 'paper' ? 'Paper' : 'Live'}
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <BrokerAccountCard
          title="IBKR Paper Account"
          subtitle="Zero-risk paper trading — IB Gateway port 4002"
          account={paper}
          loading={loading}
          busy={busyMode === 'paper'}
          busyAction={busyMode === 'paper' ? busyAction : null}
          isActive={activeMode === 'paper'}
          onRefresh={onRefresh}
          onConnect={onConnectPaper}
          onDisconnect={onDisconnectPaper}
          connectLabel="Connect Paper Account"
        />
        <BrokerAccountCard
          title="IBKR Live Account"
          subtitle="Real capital — IB Gateway port 4001"
          account={live}
          busy={busyMode === 'live'}
          busyAction={busyMode === 'live' ? busyAction : null}
          isActive={activeMode === 'live'}
          locked={liveConnectLocked}
          onRefresh={onRefresh}
          onConnect={liveConnectLocked ? undefined : onConnectLive}
          onDisconnect={onDisconnectLive}
          connectLabel="Connect Live Account"
        />
      </div>
    </TerminalCard>
  )
}

function BrokerAccountCard({
  title,
  subtitle,
  account,
  loading = false,
  busy = false,
  busyAction = null,
  isActive = false,
  locked = false,
  onRefresh,
  onConnect,
  onDisconnect,
  connectLabel = 'Connect',
}: {
  title: string
  subtitle: string
  account: BrokerAccount
  loading?: boolean
  busy?: boolean
  busyAction?: 'connect' | 'disconnect' | null
  isActive?: boolean
  locked?: boolean
  onRefresh?: () => void
  onConnect?: () => void
  onDisconnect?: () => void
  connectLabel?: string
}) {
  const status = statusStyles[account.status]
  const isConnected = account.status === 'connected'

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        isConnected
          ? 'border-accent/30 bg-accent/5'
          : isActive
            ? 'border-accent/20 bg-accent/5'
            : 'border-ai/20 bg-ai/5',
        locked && !isConnected && 'opacity-90',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            {isActive && isConnected && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-semibold uppercase text-accent">
                Active Session
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[10px] text-text-muted">{subtitle}</p>
        </div>
        <span
          className={cn(
            'inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase',
            status.className,
          )}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-3 space-y-1.5 rounded-lg border border-border-subtle/60 bg-surface/40 px-3 py-2.5 text-xs">
        <div className="flex justify-between">
          <span className="text-text-muted">Account ID</span>
          <span className="font-mono text-text-primary">{account.accountId ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Port</span>
          <span className="font-mono text-text-secondary">{account.port ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Last Checked</span>
          <span className="font-mono text-text-secondary">
            {account.lastSync ? new Date(account.lastSync).toLocaleString() : 'Never'}
          </span>
        </div>
      </div>

      {account.status === 'disconnected' && account.errorMessage && (
        <p className="mt-3 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2 text-xs text-warning">
          {account.errorMessage}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {isConnected && onDisconnect && (
          <button
            type="button"
            onClick={onDisconnect}
            disabled={busy || loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Unlink className={cn('h-3.5 w-3.5', busy && busyAction === 'disconnect' && 'animate-pulse')} />
            {busy && busyAction === 'disconnect' ? 'Disconnecting…' : 'Disconnect'}
          </button>
        )}

        {!isConnected && onConnect && !locked && (
          <button
            type="button"
            onClick={onConnect}
            disabled={busy || loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-on-accent transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Link2 className={cn('h-3.5 w-3.5', busy && busyAction === 'connect' && 'animate-pulse')} />
            {busy && busyAction === 'connect' ? 'Connecting…' : connectLabel}
          </button>
        )}

        {isConnected && onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading || busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
            Refresh
          </button>
        )}

        {!isConnected && locked && !onConnect && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-xs text-text-muted">
            <Lock className="h-3.5 w-3.5" />
            Enable live connection in Trading Mode below
          </span>
        )}
      </div>
    </div>
  )
}
