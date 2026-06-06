import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import {
  BrainCircuit,
  FlaskConical,
  Lock,
  Play,
  Plus,
  Rocket,
  Save,
  Shield,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from './TerminalCard'
import {
  DEFAULT_STRATEGY_CONFIG,
  ENTRY_RULES,
  SAMPLE_BACKTEST,
  STRATEGY_TYPES,
} from '@/data/strategyBuilder'
import type { BacktestResults, EntryRule, StrategyConfig } from '@/types/strategy'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

const sectionIcons = {
  type: TrendingUp,
  entry: Target,
  risk: Shield,
  execution: Rocket,
  performance: BrainCircuit,
}

export function AdvancedStrategyBuilder() {
  const [config, setConfig] = useState<StrategyConfig>(DEFAULT_STRATEGY_CONFIG)
  const [backtest, setBacktest] = useState<BacktestResults | null>(SAMPLE_BACKTEST)
  const [isBacktesting, setIsBacktesting] = useState(false)

  const toggleEntryRule = (rule: EntryRule) => {
    setConfig((prev) => ({
      ...prev,
      entryRules: prev.entryRules.includes(rule)
        ? prev.entryRules.filter((r) => r !== rule)
        : [...prev.entryRules, rule],
    }))
  }

  const resetStrategy = () => {
    setConfig({ ...DEFAULT_STRATEGY_CONFIG, name: 'Untitled Strategy' })
    setBacktest(null)
  }

  const runBacktest = () => {
    setIsBacktesting(true)
    setTimeout(() => {
      setBacktest(SAMPLE_BACKTEST)
      setIsBacktesting(false)
    }, 800)
  }

  const createStrategy = () => {
    setBacktest(SAMPLE_BACKTEST)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-ai" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Strategy Engine v2
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-text-primary">
            Build <span className="text-gradient-ai">Strategy</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetStrategy}
            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <Plus className="h-4 w-4" />
            Create Strategy
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            type="button"
            onClick={runBacktest}
            disabled={isBacktesting}
            className="inline-flex items-center gap-2 rounded-lg border border-ai/30 bg-ai/10 px-4 py-2 text-sm font-medium text-ai transition-colors hover:bg-ai/20 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            {isBacktesting ? 'Running…' : 'Run Backtest'}
          </button>
          <button
            type="button"
            onClick={createStrategy}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-accent-muted"
          >
            <Rocket className="h-4 w-4" />
            Deploy Strategy
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="space-y-6 xl:col-span-3">
          <SectionCard step={1} title="Strategy Name" icon={sectionIcons.type}>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              placeholder="Enter strategy name…"
              className="w-full rounded-lg border border-border-subtle bg-surface/60 px-4 py-3 text-sm font-medium text-text-primary placeholder:text-text-muted focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20"
            />
          </SectionCard>

          <SectionCard step={2} title="Strategy Type" icon={sectionIcons.type}>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {STRATEGY_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setConfig({ ...config, type: type.id })}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all',
                    config.type === type.id
                      ? 'border-ai/40 bg-ai/10 ring-1 ring-ai/20'
                      : 'border-border-subtle bg-surface/40 hover:border-border hover:bg-surface-hover/50',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary">{type.label}</span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-medium',
                        config.type === type.id ? 'bg-ai/20 text-ai' : 'bg-surface-hover text-text-muted',
                      )}
                    >
                      {type.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-text-secondary">{type.description}</p>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard step={3} title="Entry Rules" icon={sectionIcons.entry}>
            <p className="mb-3 text-xs text-text-secondary">
              Select one or more entry signals. Active rules are combined with AND logic.
            </p>
            <div className="space-y-2">
              {ENTRY_RULES.map((rule) => {
                const active = config.entryRules.includes(rule.id)
                return (
                  <div
                    key={rule.id}
                    className={cn(
                      'rounded-xl border transition-all',
                      active
                        ? 'border-info/30 bg-info/5'
                        : 'border-border-subtle bg-surface/30',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleEntryRule(rule.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    >
                      <div
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                          active
                            ? 'border-info bg-info/20 text-info'
                            : 'border-border-subtle bg-surface-hover',
                        )}
                      >
                        {active && <Zap className="h-3 w-3" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-text-primary">{rule.label}</p>
                        <p className="text-[11px] text-text-secondary">{rule.description}</p>
                      </div>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
                          active ? 'bg-info/20 text-info' : 'bg-surface-hover text-text-muted',
                        )}
                      >
                        {active ? 'Active' : 'Off'}
                      </span>
                    </button>
                    {active && (
                      <div className="border-t border-info/20 px-4 py-2.5">
                        <p className="font-mono text-[11px] text-text-muted">{rule.defaultParams}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </SectionCard>

          <SectionCard step={4} title="Risk Rules" icon={sectionIcons.risk}>
            <div className="grid gap-4 sm:grid-cols-2">
              <RiskInput
                label="Position Size"
                prefix="$"
                value={config.risk.positionSize}
                onChange={(v) =>
                  setConfig({ ...config, risk: { ...config.risk, positionSize: v } })
                }
              />
              <RiskInput
                label="Stop Loss"
                suffix="%"
                value={config.risk.stopLossPercent}
                onChange={(v) =>
                  setConfig({ ...config, risk: { ...config.risk, stopLossPercent: v } })
                }
                step={0.5}
              />
              <RiskInput
                label="Take Profit"
                suffix="%"
                value={config.risk.takeProfitPercent}
                onChange={(v) =>
                  setConfig({ ...config, risk: { ...config.risk, takeProfitPercent: v } })
                }
                step={0.5}
              />
              <RiskInput
                label="Max Daily Loss"
                prefix="$"
                value={config.risk.maxDailyLoss}
                onChange={(v) =>
                  setConfig({ ...config, risk: { ...config.risk, maxDailyLoss: v } })
                }
              />
            </div>

            <div className="mt-4 rounded-lg border border-border-subtle bg-surface/40 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Risk/Reward Preview
              </p>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-danger">Stop −{config.risk.stopLossPercent}%</span>
                    <span className="text-accent">Target +{config.risk.takeProfitPercent}%</span>
                  </div>
                  <div className="mt-1.5 flex h-2 overflow-hidden rounded-full">
                    <div
                      className="bg-danger/60"
                      style={{
                        width: `${(config.risk.stopLossPercent / (config.risk.stopLossPercent + config.risk.takeProfitPercent)) * 100}%`,
                      }}
                    />
                    <div className="flex-1 bg-accent/60" />
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-ai">
                  1:{(config.risk.takeProfitPercent / config.risk.stopLossPercent).toFixed(1)}
                </span>
              </div>
            </div>
          </SectionCard>

          <SectionCard step={5} title="Execution Mode" icon={sectionIcons.execution}>
            <div className="grid gap-3 sm:grid-cols-2">
              <ExecutionModeCard
                mode="paper"
                label="Paper Trading Mode"
                description="Simulated fills with virtual capital. No real money at risk."
                icon={FlaskConical}
                selected={config.executionMode === 'paper'}
                onSelect={() => setConfig({ ...config, executionMode: 'paper' })}
              />
              <ExecutionModeCard
                mode="live"
                label="Live Trading Mode"
                description="Connect broker for real execution. Requires IBKR integration."
                icon={Lock}
                selected={config.executionMode === 'live'}
                onSelect={() => {}}
                disabled
                badge="Coming Soon"
              />
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-2">
          <PerformancePanel backtest={backtest} isLoading={isBacktesting} config={config} />
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  step,
  title,
  icon: Icon,
  children,
}: {
  step: number
  title: string
  icon: typeof TrendingUp
  children: React.ReactNode
}) {
  return (
    <TerminalCard glow="none">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ai/10 text-xs font-bold text-ai">
          {step}
        </div>
        <Icon className="h-4 w-4 text-text-muted" />
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      </div>
      {children}
    </TerminalCard>
  )
}

function RiskInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  step?: number
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <div className="relative mt-1.5">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={cn(
            'w-full rounded-lg border border-border-subtle bg-surface/60 py-2.5 font-mono text-sm text-text-primary focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20',
            prefix ? 'pl-7 pr-3' : 'px-3',
            suffix && 'pr-8',
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function ExecutionModeCard({
  label,
  description,
  icon: Icon,
  selected,
  onSelect,
  disabled,
  badge,
}: {
  mode: string
  label: string
  description: string
  icon: typeof FlaskConical
  selected: boolean
  onSelect: () => void
  disabled?: boolean
  badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'relative rounded-xl border p-4 text-left transition-all',
        disabled && 'cursor-not-allowed opacity-60',
        selected && !disabled
          ? 'border-accent/40 bg-accent/10 ring-1 ring-accent/20'
          : 'border-border-subtle bg-surface/40 hover:border-border',
      )}
    >
      {badge && (
        <span className="absolute right-3 top-3 rounded bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">
          {badge}
        </span>
      )}
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          selected && !disabled ? 'bg-accent/20 text-accent' : 'bg-surface-hover text-text-muted',
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-text-primary">{label}</p>
      <p className="mt-1 text-xs text-text-secondary">{description}</p>
      {selected && !disabled && (
        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium uppercase text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-live" />
          Selected
        </span>
      )}
    </button>
  )
}

function PerformancePanel({
  backtest,
  isLoading,
  config,
}: {
  backtest: BacktestResults | null
  isLoading: boolean
  config: StrategyConfig
}) {
  return (
    <TerminalCard glow="ai" className="sticky top-20">
      <TerminalCardHeader
        title="Performance"
        description="Backtest results · 12-month simulation"
        badge={
          backtest ? (
            <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
              COMPLETE
            </span>
          ) : (
            <span className="rounded bg-surface-hover px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
              NO DATA
            </span>
          )
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-ai/30 border-t-ai" />
            <p className="mt-3 text-xs text-text-muted">Running backtest simulation…</p>
          </div>
        </div>
      ) : backtest ? (
        <>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <PerfMetric
              label="Total Return"
              value={formatCurrency(backtest.totalReturn)}
              sub={formatPercent(backtest.totalReturnPercent)}
              positive
            />
            <PerfMetric label="Total Trades" value={String(backtest.totalTrades)} />
            <PerfMetric
              label="Win Rate"
              value={`${backtest.winRate}%`}
              highlight
            />
            <PerfMetric
              label="Profit Factor"
              value={backtest.profitFactor.toFixed(2)}
              highlight
            />
            <PerfMetric
              label="Max Drawdown"
              value={`−${backtest.maxDrawdown}%`}
              negative
            />
            <PerfMetric
              label="Sharpe Ratio"
              value={backtest.sharpeRatio.toFixed(2)}
            />
          </div>

          <div className="rounded-lg border border-border-subtle bg-surface/40 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Equity Curve
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={backtest.equityCurve} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="backtestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3a5" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22d3a5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#141b24" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#5c6b7f', fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: '#5c6b7f', fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  width={42}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1017',
                    border: '1px solid #1e2836',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Equity']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3a5"
                  strokeWidth={2}
                  fill="url(#backtestGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2 border-t border-border-subtle pt-4">
            <SummaryRow label="Avg Win" value={formatCurrency(backtest.avgWin)} positive />
            <SummaryRow label="Avg Loss" value={formatCurrency(backtest.avgLoss)} negative />
            <SummaryRow label="Strategy" value={config.name} />
            <SummaryRow
              label="Entry Rules"
              value={`${config.entryRules.length} active`}
            />
            <SummaryRow
              label="Mode"
              value={config.executionMode === 'paper' ? 'Paper Trading' : 'Live'}
            />
          </div>
        </>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-surface/30 p-6 text-center">
          <BrainCircuit className="h-10 w-10 text-text-muted" />
          <p className="mt-3 text-sm font-medium text-text-secondary">No backtest results yet</p>
          <p className="mt-1 text-xs text-text-muted">
            Configure your strategy and click Run Backtest to see performance metrics.
          </p>
        </div>
      )}
    </TerminalCard>
  )
}

function PerfMetric({
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
    <div className="rounded-lg border border-border-subtle/60 bg-surface/40 px-3 py-2">
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

function SummaryRow({
  label,
  value,
  positive,
  negative,
}: {
  label: string
  value: string
  positive?: boolean
  negative?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-text-muted">{label}</span>
      <span
        className={cn(
          'font-mono font-medium',
          positive && 'text-accent',
          negative && 'text-danger',
          !positive && !negative && 'text-text-primary',
        )}
      >
        {value}
      </span>
    </div>
  )
}
