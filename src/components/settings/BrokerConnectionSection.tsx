import { Link2, Lock, RefreshCw } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { BrokerAccount, BrokerAccountStatus } from '@/types/settings'
import { cn } from '@/lib/utils'

interface BrokerConnectionSectionProps {
  paper: BrokerAccount
  live: BrokerAccount
  loading?: boolean
  onRefreshPaper: () => void
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
  loading = false,
  onRefreshPaper,
}: BrokerConnectionSectionProps) {
  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Broker Connection"
        description="Interactive Brokers paper account via local IB Gateway"
        badge={
          <span className="rounded-md border border-accent/20 bg-accent/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent">
            IBKR Paper Trading Mode
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <BrokerAccountCard
          title="IBKR Paper Account"
          subtitle="Connected through local trading-service API"
          account={paper}
          loading={loading}
          onRefresh={onRefreshPaper}
          refreshLabel="Refresh"
        />
        <BrokerAccountCard
          title="IBKR Live Account"
          subtitle="Real capital — locked until onboarding"
          account={live}
          connectLabel="Connect Live Account"
          locked
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
  onRefresh,
  refreshLabel = 'Refresh',
  connectLabel,
  locked = false,
}: {
  title: string
  subtitle: string
  account: BrokerAccount
  loading?: boolean
  onRefresh?: () => void
  refreshLabel?: string
  connectLabel?: string
  locked?: boolean
}) {
  const status = statusStyles[account.status]

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        locked ? 'border-border-subtle bg-surface/30 opacity-90' : 'border-ai/20 bg-ai/5',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            {locked && <Lock className="h-3.5 w-3.5 text-text-muted" />}
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
          <span className="text-text-muted">Mode</span>
          <span className="font-mono capitalize text-text-secondary">{account.mode ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Host</span>
          <span className="font-mono text-text-secondary">{account.host ?? '—'}</span>
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

      {account.status === 'disconnected' && account.errorMessage && !locked && (
        <p className="mt-3 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2 text-xs text-warning">
          {account.errorMessage}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {!locked && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading || account.status === 'pending'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-on-accent transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
            {loading || account.status === 'pending' ? 'Checking…' : refreshLabel}
          </button>
        )}

        {locked && (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-xs font-medium text-text-muted"
          >
            <Link2 className="h-3.5 w-3.5" />
            {connectLabel}
          </button>
        )}
      </div>
    </div>
  )
}
