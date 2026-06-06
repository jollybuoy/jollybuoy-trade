import { useMemo, useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { IbkrAccountSummaryCards } from '@/components/ibkr/IbkrAccountSummaryCards'
import { IbkrBackendBanner } from '@/components/ibkr/IbkrBackendBanner'
import { PaperOrderTicket } from '@/components/paper/PaperOrderTicket'
import { PaperPositionsTable } from '@/components/paper/PaperPositionsTable'
import { PaperOpenOrdersTable } from '@/components/paper/PaperOpenOrdersTable'
import { RecentPaperTrades } from '@/components/paper/RecentPaperTrades'
import { BotAutomationPanel } from '@/components/paper/BotAutomationPanel'
import { useIbkrData } from '@/hooks/useIbkrData'
import { mapIbkrPositionToPaperRow } from '@/services/ibkrMappers'
import { PAPER_BOT_STATE } from '@/data/paperTrading'
import { DEFAULT_PAPER_ORDER } from '@/types/paperTrading'
import type { PaperBotState, PaperOrderForm } from '@/types/paperTrading'

export function PaperTradingPage() {
  const { account, positions, openOrders, loading, error, connected, lastUpdated, refresh } =
    useIbkrData()

  const [orderForm, setOrderForm] = useState<PaperOrderForm>(DEFAULT_PAPER_ORDER)
  const [bot, setBot] = useState<PaperBotState>(PAPER_BOT_STATE)

  const paperPositions = useMemo(
    () => positions.map(mapIbkrPositionToPaperRow),
    [positions],
  )

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

      <IbkrBackendBanner
        loading={loading}
        error={error}
        connected={connected}
        lastUpdated={lastUpdated}
        onRetry={() => void refresh()}
      />

      <IbkrAccountSummaryCards
        account={account}
        loading={loading}
        connected={connected}
        openPositions={paperPositions.length}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <PaperOrderTicket
            form={orderForm}
            buyingPower={connected && account ? account.buyingPower : 0}
            onChange={setOrderForm}
            onSubmit={() => undefined}
            submitDisabled
          />
          <PaperPositionsTable
            positions={paperPositions}
            loading={loading && !connected}
            disableClose
            emptyMessage="No open IBKR paper positions found."
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

      <RecentPaperTrades trades={[]} />
    </div>
  )
}
