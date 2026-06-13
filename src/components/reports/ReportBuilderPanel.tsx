import { FileBarChart } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { STRATEGY_FILTER_OPTIONS, SYMBOL_FILTER_OPTIONS } from '@/data/reportsAnalytics'
import {
  REPORT_TYPE_LABELS,
  type ReportBuilderForm,
  type ReportType,
} from '@/types/reports'
import { cn } from '@/lib/utils'

interface ReportBuilderPanelProps {
  form: ReportBuilderForm
  isGenerating: boolean
  onChange: (form: ReportBuilderForm) => void
  onGenerate: () => void
}

export function ReportBuilderPanel({
  form,
  isGenerating,
  onChange,
  onGenerate,
}: ReportBuilderPanelProps) {
  const update = <K extends keyof ReportBuilderForm>(key: K, value: ReportBuilderForm[K]) => {
    onChange({ ...form, [key]: value })
  }

  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader
        title="Report Builder"
        description="Configure parameters and generate a custom report"
      />

      <div className="space-y-3">
        <Field label="Report Type">
          <select
            value={form.reportType}
            onChange={(e) => update('reportType', e.target.value as ReportType)}
            className={inputClass}
          >
            {(Object.entries(REPORT_TYPE_LABELS) as [ReportType, string][]).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => update('startDate', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="End Date">
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => update('endDate', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Strategy Filter">
            <select
              value={form.strategy}
              onChange={(e) => update('strategy', e.target.value)}
              className={inputClass}
            >
              {STRATEGY_FILTER_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Symbol Filter">
            <select
              value={form.symbol}
              onChange={(e) => update('symbol', e.target.value)}
              className={inputClass}
            >
              {SYMBOL_FILTER_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Symbols' : s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="space-y-2 rounded-lg border border-border-subtle bg-surface/40 p-3">
          <ToggleRow
            label="Include charts"
            description="Equity curve, P/L, and allocation visuals"
            enabled={form.includeCharts}
            onToggle={(v) => update('includeCharts', v)}
          />
          <ToggleRow
            label="Include trade details"
            description="Full fill log with timestamps and fees"
            enabled={form.includeTradeDetails}
            onToggle={(v) => update('includeTradeDetails', v)}
          />
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-accent/30 border-t-on-accent" />
              Generating…
            </>
          ) : (
            <>
              <FileBarChart className="h-4 w-4" />
              Generate Report
            </>
          )}
        </button>
      </div>
    </TerminalCard>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string
  description: string
  enabled: boolean
  onToggle: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-[10px] text-text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onToggle(!enabled)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          enabled ? 'bg-accent' : 'bg-surface-elevated',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            enabled ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2.5 font-mono text-sm text-text-primary focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20'
