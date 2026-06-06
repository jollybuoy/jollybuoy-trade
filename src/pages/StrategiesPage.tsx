import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StrategyListCards } from '@/components/terminal/StrategyListCards'
import { CreateStrategyPanel } from '@/components/terminal/CreateStrategyPanel'
import { BacktestPreview } from '@/components/terminal/BacktestPreview'
import {
  DEFAULT_CREATE_FORM,
  DEPLOYED_STRATEGIES,
  SAMPLE_BACKTEST,
} from '@/data/strategyBuilder'
import type { BacktestResults, CreateStrategyForm, DeployedStrategy } from '@/types/strategy'

export function StrategiesPage() {
  const [strategies, setStrategies] = useState<DeployedStrategy[]>(DEPLOYED_STRATEGIES)
  const [form, setForm] = useState<CreateStrategyForm>(DEFAULT_CREATE_FORM)
  const [backtest, setBacktest] = useState<BacktestResults | null>(null)
  const [isBacktesting, setIsBacktesting] = useState(false)

  const toggleStrategyStatus = (id: string) => {
    setStrategies((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'running' ? 'paused' : 'running' }
          : s,
      ),
    )
  }

  const runBacktest = () => {
    setIsBacktesting(true)
    setTimeout(() => {
      setBacktest(SAMPLE_BACKTEST)
      setIsBacktesting(false)
    }, 700)
  }

  const createStrategy = () => {
    const name = form.name.trim() || 'Custom Strategy'
    const newStrategy: DeployedStrategy = {
      id: `strat-${Date.now()}`,
      name,
      status: 'paused',
      mode: 'paper',
      winRate: SAMPLE_BACKTEST.winRate,
      totalPnL: 0,
      maxDrawdown: SAMPLE_BACKTEST.maxDrawdown,
      riskLevel: 'medium',
    }
    setStrategies((prev) => [newStrategy, ...prev])
    setBacktest(SAMPLE_BACKTEST)
    setForm(DEFAULT_CREATE_FORM)
  }

  const runningCount = strategies.filter((s) => s.status === 'running').length

  return (
    <div className="terminal-grid space-y-8">
      <PageHeader
        title="Strategy Builder"
        description="Manage automated strategies, configure rules, and preview backtests"
      />

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-ai" />
          <h2 className="text-sm font-semibold text-text-primary">Active Strategies</h2>
          <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium text-text-muted">
            {runningCount} running · {strategies.length} total
          </span>
        </div>
        <StrategyListCards strategies={strategies} onToggleStatus={toggleStrategyStatus} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <CreateStrategyPanel
          form={form}
          onChange={setForm}
          onCreate={createStrategy}
          onBacktest={runBacktest}
        />
        <BacktestPreview results={backtest} isLoading={isBacktesting} />
      </section>
    </div>
  )
}
