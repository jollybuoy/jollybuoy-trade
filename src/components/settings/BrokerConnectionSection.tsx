import { Link2, Lock, RefreshCw, Unplug } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { BrokerAccount, BrokerAccountStatus } from '@/types/settings'
import { cn } from '@/lib/utils'

interface BrokerConnectionSectionProps {
  paper: BrokerAccount
  live: BrokerAccount
  onConnectPaper: () => void
  onDisconnectPaper: () => void
}

const statusStyles: Record<
  BrokerAccountStatus,
  { label: string; className: string }
> = {
  connected: { label: 'Connected', className: 'bg-accent/10 text-accent border-accent/20' },
  disconnected: { label: 'Disconnected', className: 'bg-surface-elevated text-text-muted border-border-subtle' },
  pending: { label: 'Connecting…', className: 'bg-warning/10 text-warning border-warning/20' },
}

export function BrokerConnectionSection({
  paper,
  live,
  onConnectPaper,
  onDisconnectPaper,
}: BrokerConnectionSectionProps) {
  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Broker Connection"
        description="Interactive Brokers account linking — mock UI only"
        badge={
          <span className="rounded-md border border-ai/20 bg-ai/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-ai">
            IBKR
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <BrokerAccountCard
          title="IBKR Paper Account"
          subtitle="Simulated execution environment"
          account={paper}
          onConnect={onConnectPaper}
          onDisconnect={onDisconnectPaper}
          connectLabel="Connect Paper Account"
        />
        <BrokerAccountCard
          title="IBKR Live Account"
          subtitle="Real capital — locked until onboarding"
          account={live}
          connectLabel="Connect Live Account"
          connectDisabled
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
  onConnect,
  onDisconnect,
  connectLabel,
  connectDisabled = false,
  locked = false,
}: {
  title: string
  subtitle: string
  account: BrokerAccount
  onConnect?: () => void
  onDisconnect?: () => void
  connectLabel: string
  connectDisabled?: boolean
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
          <span className="text-text-muted">Last Sync</span>
          <span className="font-mono text-text-secondary">
            {account.lastSync ? new Date(account.lastSync).toLocaleString() : 'Never'}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {account.status === 'connected' ? (
          <>
            <button
              type="button"
              onClick={onDisconnect}
              disabled={locked}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-danger/30 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Unplug className="h-3.5 w-3.5" />
              Disconnect
            </button>
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-xs font-medium text-text-muted"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync (mock)
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            disabled={connectDisabled || account.status === 'pending'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-on-accent transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Link2 className="h-3.5 w-3.5" />
            {account.status === 'pending' ? 'Connecting…' : connectLabel}
          </button>
        )}
      </div>
    </div>
  )
}
