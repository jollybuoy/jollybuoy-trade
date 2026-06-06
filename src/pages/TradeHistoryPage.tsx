import { useMemo, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { TradeAnalyticsCards } from '@/components/trade-history/TradeAnalyticsCards'
import { TradeHistoryFiltersPanel } from '@/components/trade-history/TradeHistoryFiltersPanel'
import { TradeHistoryTable } from '@/components/trade-history/TradeHistoryTable'
import { TradeAnalyticsCharts } from '@/components/trade-history/TradeAnalyticsCharts'
import {
  DAILY_PNL,
  STRATEGY_PERFORMANCE,
  TRADE_HISTORY_RECORDS,
} from '@/data/tradeHistoryAnalytics'
import { DEFAULT_TRADE_FILTERS } from '@/types/tradeHistory'
import type { TradeHistoryFilters } from '@/types/tradeHistory'
import { computeAnalytics, filterTrades } from '@/lib/tradeHistoryUtils'

export function TradeHistoryPage() {
  const [filters, setFilters] = useState<TradeHistoryFilters>(DEFAULT_TRADE_FILTERS)

  const filteredTrades = useMemo(
    () => filterTrades(TRADE_HISTORY_RECORDS, filters),
    [filters],
  )

  const analytics = useMemo(() => computeAnalytics(filteredTrades), [filteredTrades])

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Trade History & Analytics"
        description="Review executions, measure performance, and analyze strategy results"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-elevated px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-ai/30 bg-ai/10 px-4 py-2 text-sm font-medium text-ai transition-colors hover:bg-ai/20"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        }
      />

      <TradeAnalyticsCards analytics={analytics} />

      <TradeAnalyticsCharts
        dailyPnL={DAILY_PNL}
        winningTrades={analytics.winningTrades}
        losingTrades={analytics.losingTrades}
        strategyPerformance={STRATEGY_PERFORMANCE}
      />

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="xl:col-span-1">
          <TradeHistoryFiltersPanel filters={filters} onChange={setFilters} />
        </div>
        <div className="xl:col-span-3">
          <TradeHistoryTable trades={filteredTrades} />
        </div>
      </div>
    </div>
  )
}
