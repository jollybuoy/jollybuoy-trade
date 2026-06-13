import { useState } from 'react'
import { LineChart } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { BacktestSetupPanel } from '@/components/backtesting/BacktestSetupPanel'
import { BacktestResultsCards } from '@/components/backtesting/BacktestResultsCards'
import { BacktestCharts } from '@/components/backtesting/BacktestCharts'
import { BacktestTradesTable } from '@/components/backtesting/BacktestTradesTable'
import { BacktestAiSummaryPanel } from '@/components/backtesting/BacktestAiSummary'
import { MOCK_BACKTEST_RESULTS } from '@/data/backtestingAnalytics'
import {
  DEFAULT_BACKTEST_SETUP,
  type AdvancedBacktestResults,
  type BacktestSetupForm,
} from '@/types/backtesting'

export function BacktestingPage() {
  const [form, setForm] = useState<BacktestSetupForm>(DEFAULT_BACKTEST_SETUP)
  const [results, setResults] = useState<AdvancedBacktestResults | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runBacktest = () => {
    setIsRunning(true)
    setResults(null)
    setTimeout(() => {
      setResults(MOCK_BACKTEST_RESULTS)
      setIsRunning(false)
    }, 1400)
  }

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Backtesting"
        description="Simulate strategy performance on historical data"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-ai/20 bg-ai/5 px-3 py-1.5">
            <LineChart className="h-4 w-4 text-ai" />
            <span className="text-xs font-medium text-ai">
              {results ? 'Results ready' : 'Configure & run'}
            </span>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <BacktestSetupPanel
          form={form}
          isRunning={isRunning}
          onChange={setForm}
          onRun={runBacktest}
        />

        <div className="xl:col-span-2">
          {!results && !isRunning && (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-surface/30 p-8 text-center">
              <LineChart className="h-12 w-12 text-text-muted" />
              <p className="mt-4 text-sm font-semibold text-text-primary">No backtest results yet</p>
              <p className="mt-1 max-w-md text-xs text-text-muted">
                Select a strategy, choose symbols, set your date range and capital, then click Run
                Backtest to generate equity curves, drawdown analysis, and AI insights.
              </p>
            </div>
          )}

          {isRunning && (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-ai/20 bg-ai/5 p-8 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-ai/30 border-t-ai" />
              <p className="mt-4 text-sm font-semibold text-ai">Simulating historical trades…</p>
              <p className="mt-1 text-xs text-text-muted">
                Processing {form.symbols.length} symbols · {form.startDate} → {form.endDate}
              </p>
            </div>
          )}

          {results && !isRunning && (
            <div className="space-y-6">
              <BacktestResultsCards metrics={results.metrics} />
              <BacktestCharts
                equityCurve={results.equityCurve}
                drawdownSeries={results.drawdownSeries}
                monthlyReturns={results.monthlyReturns}
                strategyComparison={results.strategyComparison}
              />
            </div>
          )}
        </div>
      </div>

      {results && !isRunning && (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <BacktestTradesTable trades={results.trades} />
          </div>
          <BacktestAiSummaryPanel summary={results.aiSummary} />
        </div>
      )}
    </div>
  )
}
