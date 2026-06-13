export type OrderSide = 'BUY' | 'SELL'

export type OrderType = 'MARKET'

export type OrderStatus = 'pending' | 'filled' | 'cancelled' | 'rejected'

export type PositionStatus = 'open' | 'closed'

export interface CreateOrderInput {
  symbol: string
  side: OrderSide
  quantity: number
  orderType?: OrderType
  /** Optional strategy id for audit trail */
  strategyId?: string
}

export interface PaperOrder {
  id: string
  symbol: string
  side: OrderSide
  quantity: number
  orderType: OrderType
  status: OrderStatus
  strategyId?: string
  createdAt: string
  filledAt?: string
  fillPrice?: number
}

export interface PaperPosition {
  id: string
  symbol: string
  quantity: number
  entryPrice: number
  exitPrice: number | null
  status: PositionStatus
  openedAt: string
  closedAt?: string
  unrealizedPnL: number
  realizedPnL: number | null
  strategyId?: string
}

export interface PaperTrade {
  id: string
  orderId: string
  symbol: string
  side: OrderSide
  quantity: number
  entryPrice: number
  exitPrice: number | null
  pnl: number | null
  status: PositionStatus
  timestamp: string
  strategyId?: string
}

export interface PaperAccountState {
  cashBalance: number
  initialCash: number
  dailyRealizedPnL: number
}
