import { useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PaperAccountSummaryCards } from '@/components/paper/PaperAccountSummary'
import { PaperOrderTicket } from '@/components/paper/PaperOrderTicket'
import { PaperPositionsTable } from '@/components/paper/PaperPositionsTable'
import { RecentPaperTrades } from '@/components/paper/RecentPaperTrades'
import { BotAutomationPanel } from '@/components/paper/BotAutomationPanel'
import {
  PAPER_ACCOUNT,
  PAPER_BOT_STATE,
  PAPER_POSITIONS,
  PAPER_TRADE_HISTORY,
} from '@/data/paperTrading'
import { DEFAULT_PAPER_ORDER } from '@/types/paperTrading'
import type { PaperBotState, PaperOrderForm, PaperPositionRow } from '@/types/paperTrading'

export function PaperTradingPage() {
  const [positions, setPositions] = useState<PaperPositionRow[]>(PAPER_POSITIONS)
  const [orderForm, setOrderForm] = useState<PaperOrderForm>(DEFAULT_PAPER_ORDER)
  const [bot, setBot] = useState<PaperBotState>(PAPER_BOT_STATE)

  const account = {
    ...PAPER_ACCOUNT,
    openPositions: positions.length,
  }

  const closePosition = (id: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== id))
  }

  const submitOrder = () => {
    // UI-only: no backend execution
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
        description="Simulated execution environment — zero capital risk"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5">
            <FlaskConical className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-accent">SIMULATION ACTIVE</span>
          </div>
        }
      />

      <PaperAccountSummaryCards account={account} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <PaperOrderTicket
            form={orderForm}
            buyingPower={account.buyingPower}
            onChange={setOrderForm}
            onSubmit={submitOrder}
          />
          <PaperPositionsTable positions={positions} onClose={closePosition} />
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
