import { useMemo, useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MarketDataBanner } from '@/components/market/MarketDataBanner'
import { PaperAccountSummaryCards } from '@/components/paper/PaperAccountSummary'
import { PaperOrderTicket } from '@/components/paper/PaperOrderTicket'
import { PaperPositionsTable } from '@/components/paper/PaperPositionsTable'
import { PaperOpenOrdersTable } from '@/components/paper/PaperOpenOrdersTable'
import { RecentPaperTrades } from '@/components/paper/RecentPaperTrades'
import { BotAutomationPanel } from '@/components/paper/BotAutomationPanel'
import { useIbkrData } from '@/hooks/useIbkrData'
import {
  getIbkrDisconnectedMessage,
  mapIbkrAccountToPaperSummary,
  mapIbkrPositionToPaperRow,
} from '@/services/ibkrMappers'
import { PAPER_BOT_STATE, PAPER_TRADE_HISTORY } from '@/data/paperTrading'
import { DEFAULT_PAPER_ORDER } from '@/types/paperTrading'
import type { PaperBotState, PaperOrderForm } from '@/types/paperTrading'

export function PaperTradingPage() {
  const { account, positions, openOrders, loading, refreshing, error, status, lastUpdated, refresh } =
    useIbkrData({ refreshIntervalMs: 60_000 })

  const [orderForm, setOrderForm] = useState<PaperOrderForm>(DEFAULT_PAPER_ORDER)
  const [bot, setBot] = useState<PaperBotState>(PAPER_BOT_STATE)

  const paperPositions = useMemo(
    () => positions.map(mapIbkrPositionToPaperRow),
    [positions],
  )

  const connected = Boolean(status?.connected && account)
  const accountSummary = account
    ? mapIbkrAccountToPaperSummary(account, paperPositions.length)
    : {
        equity: 0,
        cashBalance: 0,
        buyingPower: 0,
        dayPnL: 0,
        dayPnLPercent: 0,
        openPositions: 0,
        marginUsed: 0,
      }

  const startBot = () => {
    setBot((prev) => ({
      ...prev,
      status: 'running',
      lastAction: 'Paper bot started — monitoring strategies',
    }))
  }

  const pauseBot = () => {
    setBot((prev) => ({
      ...prev,
      status: 'paused',
      lastAction: 'Paper bot paused — manual orders only',
    }))
  }

  const emergencyStop = () => {
    setBot((prev) => ({
      ...prev,
      status: 'stopped',
      activeStrategies: [],
      riskStatus: 'critical',
      lastAction: 'Emergency stop triggered — all automation halted',
    }))
  }

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Paper Trading"
        description="Live IBKR paper account data — order placement disabled"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5">
            <FlaskConical className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-accent">IBKR Paper Trading Mode</span>
          </div>
        }
      />

      <MarketDataBanner
        loading={loading && !account}
        refreshing={refreshing}
        errorMessage={connected ? null : getIbkrDisconnectedMessage(error ?? status?.error)}
        lastUpdated={lastUpdated}
        onRetry={() => void refresh()}
      />

      <PaperAccountSummaryCards account={accountSummary} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <PaperOrderTicket
            form={orderForm}
            buyingPower={accountSummary.buyingPower}
            onChange={setOrderForm}
            onSubmit={() => undefined}
            submitDisabled
          />
          <PaperPositionsTable
            positions={paperPositions}
            loading={loading && !connected}
            disableClose
          />
          <PaperOpenOrdersTable orders={openOrders} loading={loading && !connected} />
        </div>

        <BotAutomationPanel
          bot={bot}
          onStart={startBot}
          onPause={pauseBot}
          onEmergencyStop={emergencyStop}
        />
      </div>

      <RecentPaperTrades trades={PAPER_TRADE_HISTORY} />
    </div>
  )
}
