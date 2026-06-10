export interface IbkrStatus {
  connected: boolean
  account: string | null
  clientId?: number
  lastHeartbeat?: string | null
  mode: 'paper' | 'live' | string
  host: string
  port: number
  error?: string
  errorCode?: string
}

export interface IbkrAccount {
  accountId: string
  accountType: string
  netLiquidation: number
  totalCashValue: number
  buyingPower: number
  availableFunds: number
  excessLiquidity: number
  currency: string
  unrealizedPnL: number
  realizedPnL: number
  grossPositionValue: number
}

export interface IbkrPosition {
  symbol: string
  secType: string
  exchange: string
  currency: string
  quantity: number
  averageCost: number
  marketPrice: number
  marketValue: number
  unrealizedPnL: number
  realizedPnL: number
}

export interface IbkrOpenOrder {
  orderId: number
  symbol: string
  action: string
  quantity: number
  orderType: string
  status: string
  filled: number
  remaining: number
}

export interface IbkrExecution {
  execId: string
  orderId: number
  symbol: string
  side: string
  quantity: number
  price: number
  avgPrice: number
  timestamp: string
  exchange: string
  commission: number
}

export type IbkrAccountMode = 'paper' | 'live'
