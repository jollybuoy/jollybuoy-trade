import { closingPrices, sma } from '@/strategies/indicators'
import type { Strategy, StrategyContext, StrategySignalResult } from '@/strategies/types'

export class MovingAverageCrossStrategy implements Strategy {
  readonly id = 'ma_cross'
  readonly name = 'Moving Average Cross'
  readonly description = 'Buy when 50 MA crosses above 200 MA; sell on cross below.'
  readonly riskLevel = 'low' as const

  private fastPeriod: number
  private slowPeriod: number

  constructor(fastPeriod = 50, slowPeriod = 200) {
    this.fastPeriod = fastPeriod
    this.slowPeriod = slowPeriod
  }

  generateSignal(context: StrategyContext): StrategySignalResult {
    const closes = closingPrices(context.bars.slice(0, context.index + 1))

    if (closes.length < this.slowPeriod + 1) {
      return { signal: 'HOLD', reason: 'Insufficient bars for MA cross' }
    }

    const prevCloses = closes.slice(0, -1)
    const fastNow = sma(closes, this.fastPeriod)
    const slowNow = sma(closes, this.slowPeriod)
    const fastPrev = sma(prevCloses, this.fastPeriod)
    const slowPrev = sma(prevCloses, this.slowPeriod)

    if (fastNow === null || slowNow === null || fastPrev === null || slowPrev === null) {
      return { signal: 'HOLD', reason: 'MA values unavailable' }
    }

    const crossedUp = fastPrev <= slowPrev && fastNow > slowNow
    const crossedDown = fastPrev >= slowPrev && fastNow < slowNow

    if (crossedUp) {
      return {
        signal: 'BUY',
        reason: `${this.fastPeriod} MA crossed above ${this.slowPeriod} MA`,
        metadata: { fastMa: fastNow, slowMa: slowNow },
      }
    }

    if (crossedDown) {
      return {
        signal: 'SELL',
        reason: `${this.fastPeriod} MA crossed below ${this.slowPeriod} MA`,
        metadata: { fastMa: fastNow, slowMa: slowNow },
      }
    }

    return {
      signal: 'HOLD',
      reason: 'No MA cross on current bar',
      metadata: { fastMa: fastNow, slowMa: slowNow },
    }
  }
}
