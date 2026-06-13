import { useState } from 'react'
import { FileBarChart } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { ReportTypeCards } from '@/components/reports/ReportTypeCards'
import { ReportBuilderPanel } from '@/components/reports/ReportBuilderPanel'
import { ExportOptionsPanel } from '@/components/reports/ExportOptionsPanel'
import { RecentReportsTable } from '@/components/reports/RecentReportsTable'
import { buildReportName, MOCK_RECENT_REPORTS } from '@/data/reportsAnalytics'
import {
  DEFAULT_REPORT_BUILDER_FORM,
  type ExportAction,
  type RecentReport,
  type ReportBuilderForm,
} from '@/types/reports'

const EXPORT_LABELS: Record<ExportAction, string> = {
  csv: 'CSV export',
  pdf: 'PDF export',
  excel: 'Excel export',
  email: 'Email delivery',
  statement: 'Statement download',
}

export function ReportsPage() {
  const [form, setForm] = useState<ReportBuilderForm>(DEFAULT_REPORT_BUILDER_FORM)
  const [reports, setReports] = useState<RecentReport[]>(MOCK_RECENT_REPORTS)
  const [isGenerating, setIsGenerating] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const selectReportType = (type: ReportBuilderForm['reportType']) => {
    setForm((prev) => ({ ...prev, reportType: type }))
  }

  const generateReport = () => {
    setIsGenerating(true)
    const pendingId = `rpt-${Date.now()}`

    setReports((prev) => [
      {
        id: pendingId,
        name: buildReportName(form.reportType, form.startDate, form.endDate),
        generatedAt: new Date().toISOString(),
        type: form.reportType,
        status: 'generating',
      },
      ...prev,
    ])

    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === pendingId ? { ...r, status: 'ready' as const } : r,
        ),
      )
      setIsGenerating(false)
      showToast('Report generated successfully (mock)')
    }, 1400)
  }

  const handleExport = (action: ExportAction) => {
    showToast(`${EXPORT_LABELS[action]} queued (mock — no backend)`)
  }

  const downloadReport = (id: string) => {
    const report = reports.find((r) => r.id === id)
    if (!report) return
    showToast(`Downloading "${report.name}" (mock)`)
  }

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Reports & Export Center"
        description="Generate, export, and download trading and portfolio reports"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-ai/20 bg-ai/5 px-3 py-1.5">
            <FileBarChart className="h-4 w-4 text-ai" />
            <span className="text-xs font-medium text-ai">{reports.length} reports</span>
          </div>
        }
      />

      {toast && (
        <div className="rounded-lg border border-ai/20 bg-ai/5 px-4 py-2.5 text-sm text-ai">
          {toast}
        </div>
      )}

      <ReportTypeCards selectedType={form.reportType} onSelect={selectReportType} />

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportBuilderPanel
          form={form}
          isGenerating={isGenerating}
          onChange={setForm}
          onGenerate={generateReport}
        />
        <ExportOptionsPanel onExport={handleExport} />
      </div>

      <RecentReportsTable reports={reports} onDownload={downloadReport} />

      <p className="text-center text-[11px] text-text-muted">
        All reports and exports use simulated data. No files are written or sent until backend
        integration.
      </p>
    </div>
  )
}
