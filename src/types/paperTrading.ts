export type PaperOrderSide = 'buy' | 'sell'

export type PaperOrderType = 'market' | 'limit' | 'stop'

export type PaperBotStatus = 'running' | 'paused' | 'stopped'

export type RiskStatus = 'normal' | 'elevated' | 'critical'

export interface PaperAccountSummary {
  equity: number
  cashBalance: number
  buyingPower: number
  dayPnL: number
  dayPnLPercent: number
  openPositions: number
  marginUsed: number
}

export interface PaperPositionRow {
  id: string
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
}

export interface PaperTradeRecord {
  id: string
  timestamp: string
  symbol: string
  side: PaperOrderSide
  quantity: number
  entryPrice: number
  exitPrice: number | null
  pnl: number | null
  strategy: string
}

export interface PaperBotState {
  status: PaperBotStatus
  activeStrategies: string[]
  riskStatus: RiskStatus
  tradesToday: number
  lastAction: string
}

export interface PaperOrderForm {
  symbol: string
  side: PaperOrderSide
  quantity: number
  orderType: PaperOrderType
  limitPrice: number
  stopLossPercent: number
  takeProfitPercent: number
}

export const DEFAULT_PAPER_ORDER: PaperOrderForm = {
  symbol: 'TSLA',
  side: 'buy',
  quantity: 25,
  orderType: 'limit',
  limitPrice: 0,
  stopLossPercent: 3,
  takeProfitPercent: 8,
}
