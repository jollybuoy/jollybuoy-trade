import { Download, FileSpreadsheet, FileText, Mail, Table } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { ExportAction } from '@/types/reports'

interface ExportOptionsPanelProps {
  onExport: (action: ExportAction) => void
}

const exportOptions: {
  id: ExportAction
  label: string
  description: string
  icon: typeof Download
}[] = [
  {
    id: 'csv',
    label: 'Export CSV',
    description: 'Trades and summary rows',
    icon: Table,
  },
  {
    id: 'pdf',
    label: 'Export PDF',
    description: 'Formatted report document',
    icon: FileText,
  },
  {
    id: 'excel',
    label: 'Export Excel',
    description: 'Multi-sheet workbook',
    icon: FileSpreadsheet,
  },
  {
    id: 'email',
    label: 'Send by Email',
    description: 'Deliver to registered address',
    icon: Mail,
  },
  {
    id: 'statement',
    label: 'Download Statement',
    description: 'Account statement PDF',
    icon: Download,
  },
]

export function ExportOptionsPanel({ onExport }: ExportOptionsPanelProps) {
  return (
    <TerminalCard>
      <TerminalCardHeader
        title="Export Options"
        description="Download or deliver the selected report (mock)"
      />

      <div className="grid gap-2 sm:grid-cols-2">
        {exportOptions.map(({ id, label, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onExport(id)}
            className="flex items-start gap-3 rounded-lg border border-border-subtle bg-surface/30 p-3 text-left transition-colors hover:border-ai/30 hover:bg-ai/5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ai/10 text-ai">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{label}</p>
              <p className="text-[10px] text-text-muted">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </TerminalCard>
  )
}
