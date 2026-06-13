import { Download } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { REPORT_TYPE_LABELS, type RecentReport, type ReportStatus } from '@/types/reports'
import { cn, formatDateTime } from '@/lib/utils'

interface RecentReportsTableProps {
  reports: RecentReport[]
  onDownload: (id: string) => void
}

const statusStyles: Record<ReportStatus, { label: string; className: string }> = {
  ready: { label: 'Ready', className: 'bg-accent/10 text-accent border-accent/20' },
  generating: { label: 'Generating', className: 'bg-warning/10 text-warning border-warning/20' },
  failed: { label: 'Failed', className: 'bg-danger/10 text-danger border-danger/20' },
}

export function RecentReportsTable({ reports, onDownload }: RecentReportsTableProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Recent Reports"
          description={`${reports.length} generated reports (mock)`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {['Report Name', 'Date Generated', 'Type', 'Status', 'Action'].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                    i === 4 && 'text-center',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-border-subtle/40 transition-colors hover:bg-ai/5"
              >
                <td className="px-4 py-3 text-sm font-medium text-text-primary">
                  {report.name}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                  {formatDateTime(report.generatedAt)}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {REPORT_TYPE_LABELS[report.type]}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => onDownload(report.id)}
                      disabled={report.status !== 'ready'}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-ai/20 bg-ai/5 px-2.5 py-1.5 text-[10px] font-semibold uppercase text-ai transition-colors hover:border-ai/40 hover:bg-ai/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TerminalCard>
  )
}

function StatusBadge({ status }: { status: ReportStatus }) {
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
