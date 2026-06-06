export type BrokerConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export type BrokerOrderSide = 'BUY' | 'SELL'

export type BrokerOrderType = 'MARKET' | 'LIMIT'

export type BrokerOrderStatus = 'submitted' | 'filled' | 'cancelled' | 'rejected'

export interface BrokerConnectOptions {
  /** Paper trading account DU* vs live U* — IBKR convention */
  accountId?: string
  host?: string
  port?: number
  clientId?: number
}

export interface BrokerOrderRequest {
  symbol: string
  side: BrokerOrderSide
  quantity: number
  orderType?: BrokerOrderType
  limitPrice?: number
}

export interface BrokerOrder {
  id: string
  symbol: string
  side: BrokerOrderSide
  quantity: number
  orderType: BrokerOrderType
  status: BrokerOrderStatus
  submittedAt: string
  filledAt?: string
  avgFillPrice?: number
}

export interface BrokerPosition {
  symbol: string
  quantity: number
  avgCost: number
  marketValue: number
  unrealizedPnL: number
}

export interface BrokerAccount {
  accountId: string
  netLiquidation: number
  cashBalance: number
  buyingPower: number
  currency: string
}

/**
 * Broker abstraction for paper and live execution.
 * PaperTradingEngine handles simulation; IBKRBroker will route to TWS when connected.
 */
export interface Broker {
  readonly name: string
  getStatus(): BrokerConnectionStatus
  connect(options?: BrokerConnectOptions): Promise<void>
  disconnect(): Promise<void>
  placeOrder(request: BrokerOrderRequest): Promise<BrokerOrder>
  cancelOrder(orderId: string): Promise<void>
  getPositions(): Promise<BrokerPosition[]>
  getAccount(): Promise<BrokerAccount>
}
