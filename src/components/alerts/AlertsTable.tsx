import { Pencil, Trash2 } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import {
  ALERT_TYPE_LABELS,
  NOTIFICATION_METHOD_LABELS,
  type AlertRule,
  type AlertStatus,
} from '@/types/alerts'
import { cn, formatDateTime } from '@/lib/utils'

interface AlertsTableProps {
  alerts: AlertRule[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const statusStyles: Record<AlertStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-accent/10 text-accent border-accent/20' },
  paused: { label: 'Paused', className: 'bg-surface-elevated text-text-muted border-border-subtle' },
  triggered: { label: 'Triggered', className: 'bg-warning/10 text-warning border-warning/20' },
}

export function AlertsTable({ alerts, onEdit, onDelete }: AlertsTableProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Alert Rules"
          description={`${alerts.length} configured alerts (mock)`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {[
                'Symbol',
                'Condition',
                'Status',
                'Last Triggered',
                'Notification',
                'Actions',
              ].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                    i === 5 && 'text-center',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-text-secondary">
                  No alerts configured. Create one using the panel.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-border-subtle/40 transition-colors hover:bg-ai/5"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-text-primary">{alert.symbol}</p>
                      <p className="text-[10px] text-text-muted">
                        {ALERT_TYPE_LABELS[alert.alertType]}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{alert.condition}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={alert.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                    {alert.lastTriggered ? formatDateTime(alert.lastTriggered) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {NOTIFICATION_METHOD_LABELS[alert.notificationMethod]}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(alert.id)}
                        className="rounded-lg border border-border-subtle p-1.5 text-text-secondary transition-colors hover:border-ai/30 hover:text-ai"
                        aria-label={`Edit alert ${alert.id}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(alert.id)}
                        className="rounded-lg border border-border-subtle p-1.5 text-text-secondary transition-colors hover:border-danger/30 hover:text-danger"
                        aria-label={`Delete alert ${alert.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </TerminalCard>
  )
}

function StatusBadge({ status }: { status: AlertStatus }) {
  const { label, className } = statusStyles[status]
  return (
    <span
      className={cn(
        'inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase',
        className,
      )}
    >
      {label}
    </span>
  )
}
