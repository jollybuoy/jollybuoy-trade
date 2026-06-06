import { useRef, useState } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { CSV_PREVIEW_SAMPLE } from '@/data/portfolioAnalytics'
import type { CsvImportStatus, CsvPreviewRow } from '@/types/portfolio'
import { cn, formatCurrency } from '@/lib/utils'

export function PortfolioCsvUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<CsvImportStatus>('idle')
  const [fileName, setFileName] = useState<string | null>(null)
  const [previewRows, setPreviewRows] = useState<CsvPreviewRow[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setStatus('preview')
    setPreviewRows(CSV_PREVIEW_SAMPLE)
  }

  const handleImport = () => {
    setStatus('success')
  }

  const handleReset = () => {
    setStatus('idle')
    setFileName(null)
    setPreviewRows([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Import Portfolio CSV"
        description="Upload Wealthsimple or IBKR export files"
        badge={<ImportStatusBadge status={status} />}
      />

      <div
        className={cn(
          'rounded-xl border-2 border-dashed p-6 text-center transition-colors',
          status === 'idle'
            ? 'border-border-subtle bg-surface/30 hover:border-ai/30 hover:bg-ai/5'
            : 'border-ai/20 bg-ai/5',
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <FileSpreadsheet className="mx-auto h-10 w-10 text-text-muted" />
        <p className="mt-3 text-sm font-medium text-text-primary">
          Drop CSV file or click to browse
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Supports Wealthsimple Trade and IBKR activity/portfolio exports
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-ai/30 bg-ai/10 px-4 py-2 text-sm font-medium text-ai transition-colors hover:bg-ai/20"
        >
          <Upload className="h-4 w-4" />
          Choose CSV File
        </button>
      </div>

      {fileName && (
        <p className="mt-3 font-mono text-xs text-text-secondary">
          Selected: <span className="text-text-primary">{fileName}</span>
        </p>
      )}

      {previewRows.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Import Preview
          </p>
          <div className="overflow-x-auto rounded-lg border border-border-subtle">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-border-subtle bg-surface/40">
                  {['Symbol', 'Quantity', 'Avg Cost', 'Market'].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={row.symbol} className="border-b border-border-subtle/40">
                    <td className="px-3 py-2 font-bold text-ai">{row.symbol}</td>
                    <td className="px-3 py-2 font-mono text-sm">{row.quantity}</td>
                    <td className="px-3 py-2 font-mono text-sm">
                      {formatCurrency(row.avgCost)}
                    </td>
                    <td className="px-3 py-2 text-sm text-text-secondary">{row.market}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex gap-2">
            {status !== 'success' ? (
              <button
                type="button"
                onClick={handleImport}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-muted"
              >
                Confirm Import
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-accent">
                <CheckCircle2 className="h-4 w-4" />
                Successfully imported {previewRows.length} positions (mock)
              </div>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          <AlertCircle className="h-4 w-4" />
          Failed to parse CSV. Check file format and try again.
        </div>
      )}
    </TerminalCard>
  )
}

function ImportStatusBadge({ status }: { status: CsvImportStatus }) {
  const styles: Record<CsvImportStatus, { label: string; className: string }> = {
    idle: { label: 'Ready', className: 'bg-surface-hover text-text-muted' },
    preview: { label: 'Preview', className: 'bg-info/10 text-info' },
    success: { label: 'Imported', className: 'bg-accent/10 text-accent' },
    error: { label: 'Error', className: 'bg-danger/10 text-danger' },
  }

  const { label, className } = styles[status]

  return (
    <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium uppercase', className)}>
      {label}
    </span>
  )
}
