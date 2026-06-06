import { DEFAULT_RISK_LIMITS } from '@/risk/defaultLimits'
import type {
  RiskLimits,
  RiskValidationContext,
  RiskValidationResult,
  TradeRiskPayload,
} from '@/risk/types'

/**
 * Pre-trade risk gate used by PaperTradingEngine and future IBKR order router.
 * Rejections should be logged to Supabase for compliance review.
 */
export class RiskEngine {
  private limits: RiskLimits

  constructor(limits: RiskLimits = DEFAULT_RISK_LIMITS) {
    this.limits = limits
  }

  updateLimits(limits: Partial<RiskLimits>) {
    this.limits = { ...this.limits, ...limits }
  }

  getLimits(): RiskLimits {
    return { ...this.limits }
  }

  validateTrade(payload: TradeRiskPayload): RiskValidationResult {
    return this.validateContext(payload.context)
  }

  validateContext(context: RiskValidationContext): RiskValidationResult {
    const { limits, dailyRealizedPnL, openPositionCount, orderNotional } = context

    if (orderNotional > limits.maxPositionSize) {
      return {
        decision: 'Rejected',
        reason: `Order notional $${orderNotional.toFixed(2)} exceeds max position size $${limits.maxPositionSize}`,
      }
    }

    if (Math.abs(Math.min(dailyRealizedPnL, 0)) >= limits.maxDailyLoss) {
      return {
        decision: 'Rejected',
        reason: `Daily loss limit reached ($${limits.maxDailyLoss} cap)`,
      }
    }

    if (openPositionCount >= limits.maxOpenPositions) {
      return {
        decision: 'Rejected',
        reason: `Max open positions (${limits.maxOpenPositions}) reached`,
      }
    }

    return { decision: 'Approved', reason: 'Trade passes risk checks' }
  }
}

export const riskEngine = new RiskEngine()
