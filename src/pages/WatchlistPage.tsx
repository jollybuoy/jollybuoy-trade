import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MarketDataBanner } from '@/components/market/MarketDataBanner'
import { WatchlistGroups } from '@/components/watchlist/WatchlistGroups'
import { WatchlistTable } from '@/components/watchlist/WatchlistTable'
import { AddSymbolPanel } from '@/components/watchlist/AddSymbolPanel'
import { WatchlistAlertSettingsPanel } from '@/components/watchlist/WatchlistAlertSettings'
import { SEARCHABLE_SYMBOLS, WATCHLIST_BY_GROUP, WATCHLIST_GROUPS } from '@/data/watchlistAnalytics'
import { useMarketQuotes } from '@/hooks/useMarketQuotes'
import { mergeQuotesIntoWatchlistRows } from '@/services/market/mergeQuotes'
import {
  DEFAULT_ADD_SYMBOL_FORM,
  DEFAULT_WATCHLIST_ALERTS,
  type AddSymbolForm,
  type WatchlistAlertSettings,
  type WatchlistGroupId,
  type WatchlistRow,
} from '@/types/watchlist'

const WATCHLIST_REFRESH_MS = 60_000

export function WatchlistPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<WatchlistGroupId>('ai-growth')
  const [lists, setLists] = useState(WATCHLIST_BY_GROUP)
  const [addForm, setAddForm] = useState<AddSymbolForm>({
    ...DEFAULT_ADD_SYMBOL_FORM,
    watchlistId: 'ai-growth',
  })
  const [alerts, setAlerts] = useState<WatchlistAlertSettings>(DEFAULT_WATCHLIST_ALERTS)
  const [lastAdded, setLastAdded] = useState<string | null>(null)
  const [strategyToast, setStrategyToast] = useState<string | null>(null)

  const groups = useMemo(
    () =>
      WATCHLIST_GROUPS.map((group) => ({
        ...group,
        symbolCount: lists[group.id].length,
      })),
    [lists],
  )

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? groups[0]
  const rows = lists[selectedGroupId]
  const symbols = useMemo(() => rows.map((row) => row.symbol), [rows])

  const {
    quotes,
    loading,
    refreshing,
    errorMessage,
    symbolErrors,
    lastUpdated,
    refresh,
  } = useMarketQuotes(symbols, { refreshIntervalMs: WATCHLIST_REFRESH_MS })

  const liveRows = useMemo(
    () => mergeQuotesIntoWatchlistRows(rows, quotes),
    [rows, quotes],
  )

  const selectGroup = (id: WatchlistGroupId) => {
    setSelectedGroupId(id)
    setAddForm((prev) => ({ ...prev, watchlistId: id }))
  }

  const addSymbol = () => {
    if (!addForm.symbol) return

    const match = SEARCHABLE_SYMBOLS.find((s) => s.symbol === addForm.symbol)
    const existing = lists[addForm.watchlistId].some((r) => r.symbol === addForm.symbol)
    if (existing) {
      setLastAdded(`${addForm.symbol} is already in this watchlist`)
      return
    }

    const newRow: WatchlistRow = {
      symbol: addForm.symbol,
      company: match?.company ?? addForm.symbol,
      price: 0,
      changePercent: 0,
      marketCap: 0,
      volume: 0,
      rsi: Math.floor(35 + Math.random() * 35),
      aiScore: Math.floor(65 + Math.random() * 25),
      signal: 'watch',
    }

    setLists((prev) => ({
      ...prev,
      [addForm.watchlistId]: [...prev[addForm.watchlistId], newRow],
    }))
    setLastAdded(`${addForm.symbol} added to ${WATCHLIST_GROUPS.find((g) => g.id === addForm.watchlistId)?.name}`)
    setAddForm({ ...DEFAULT_ADD_SYMBOL_FORM, watchlistId: addForm.watchlistId })
  }

  const addToStrategy = (symbol: string) => {
    setStrategyToast(`${symbol} queued for strategy builder (mock)`)
    setTimeout(() => setStrategyToast(null), 3000)
  }

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Watchlist"
        description="Curated symbol lists, alerts, and strategy handoff"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-ai/20 bg-ai/5 px-3 py-1.5">
            <Eye className="h-4 w-4 text-ai" />
            <span className="text-xs font-medium text-ai">
              {groups.reduce((sum, g) => sum + g.symbolCount, 0)} symbols tracked
            </span>
          </div>
        }
      />

      <MarketDataBanner
        loading={loading}
        refreshing={refreshing}
        errorMessage={errorMessage}
        symbolErrorCount={symbolErrors.length}
        lastUpdated={lastUpdated}
        onRetry={() => void refresh()}
      />

      {strategyToast && (
        <div className="rounded-lg border border-ai/20 bg-ai/5 px-4 py-2.5 text-sm text-ai">
          {strategyToast}
        </div>
      )}

      <WatchlistGroups
        groups={groups}
        selectedId={selectedGroupId}
        onSelect={selectGroup}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <WatchlistTable
            group={selectedGroup}
            rows={liveRows}
            loading={loading && quotes.length === 0}
            onAddToStrategy={addToStrategy}
          />
        </div>

        <div className="space-y-6">
          <AddSymbolPanel
            form={addForm}
            selectedWatchlistId={selectedGroupId}
            onChange={setAddForm}
            onSubmit={addSymbol}
            lastAdded={lastAdded}
          />
          <WatchlistAlertSettingsPanel settings={alerts} onChange={setAlerts} />
        </div>
      </div>
    </div>
  )
}
