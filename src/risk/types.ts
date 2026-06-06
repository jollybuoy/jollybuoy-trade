import type { CreateOrderInput } from '@/trading/types'

export type RiskDecision = 'Approved' | 'Rejected'

export interface RiskLimits {
  maxPositionSize: number
  maxDailyLoss: number
  maxOpenPositions: number
}

export interface RiskValidationContext {
  limits: RiskLimits
  /** Current paper/live account daily realized P/L (negative = loss) */
  dailyRealizedPnL: number
  openPositionCount: number
  /** Estimated order notional = price × quantity */
  orderNotional: number
}

export interface RiskValidationResult {
  decision: RiskDecision
  reason: string
}

export interface TradeRiskPayload {
  order: CreateOrderInput
  context: RiskValidationContext
}
