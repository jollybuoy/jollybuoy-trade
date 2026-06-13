import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { BarChart3, BrainCircuit } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from './TerminalCard'
import type { BacktestResults } from '@/types/strategy'
import { chartStyles } from '@/lib/chartStyles'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

interface BacktestPreviewProps {
  results: BacktestResults | null
  isLoading?: boolean
}

export function BacktestPreview({ results, isLoading }: BacktestPreviewProps) {
  return (
    <TerminalCard glow="ai" className="h-full">
      <TerminalCardHeader
        title="Backtest Preview"
        description="Simulated 12-month performance"
        badge={
          results ? (
            <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
              READY
            </span>
          ) : (
            <span className="rounded bg-surface-hover px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
              PENDING
            </span>
          )
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : results ? (
        <ResultsView results={results} />
      ) : (
        <EmptyState />
      )}
    </TerminalCard>
  )
}

function LoadingState() {
  return (
    <div className="flex h-80 items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-ai/30 border-t-ai" />
        <p className="mt-3 text-xs text-text-muted">Simulating backtest…</p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-surface/30 p-6 text-center">
      <BrainCircuit className="h-10 w-10 text-text-muted" />
      <p className="mt-3 text-sm font-medium text-text-secondary">No backtest yet</p>
      <p className="mt-1 max-w-xs text-xs text-text-muted">
        Fill in the create form and click Run Backtest to preview performance metrics.
      </p>
    </div>
  )
}

function ResultsView({ results }: { results: BacktestResults }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Metric
          label="Total Return"
          value={formatCurrency(results.totalReturn)}
          sub={formatPercent(results.totalReturnPercent)}
          positive
        />
        <Metric label="Win Rate" value={`${results.winRate}%`} highlight />
        <Metric label="Profit Factor" value={results.profitFactor.toFixed(2)} highlight />
        <Metric label="Max Drawdown" value={`−${results.maxDrawdown}%`} negative />
      </div>

      <div className="mt-4 rounded-lg border border-border-subtle bg-surface/40 p-3">
        <div className="mb-2 flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-ai" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Equity Curve
          </p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={results.equityCurve} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="backtestEquityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3a5" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22d3a5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid.stroke} vertical={false} />
            <XAxis
              dataKey="date"
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              width={44}
              domain={['auto', 'auto']}
            />
            <Tooltip
              {...chartStyles.tooltip}
              formatter={(value) => [formatCurrency(Number(value)), 'Equity']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22d3a5"
              strokeWidth={2}
              fill="url(#backtestEquityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-center font-mono text-[10px] text-text-muted">
        {results.totalTrades} simulated trades · Dummy data only
      </p>
    </>
  )
}

function Metric({
  label,
  value,
  sub,
  highlight,
  positive,
  negative,
}: {
  label: string
  value: string
  sub?: string
  highlight?: boolean
  positive?: boolean
  negative?: boolean
}) {
  return (
    <div className="rounded-lg border border-border-subtle/60 bg-surface/40 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-text-muted">{label}</p>
      <p
        className={cn(
          'mt-0.5 font-mono text-sm font-bold',
          highlight && 'text-ai',
          positive && 'text-accent',
          negative && 'text-danger',
          !highlight && !positive && !negative && 'text-text-primary',
        )}
      >
        {value}
      </p>
      {sub && <p className="font-mono text-[10px] text-accent">{sub}</p>}
    </div>
  )
}
