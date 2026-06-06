import { highestHigh, lowestLow } from '@/strategies/indicators'
import type { Strategy, StrategyContext, StrategySignalResult } from '@/strategies/types'

export class MomentumStrategy implements Strategy {
  readonly id = 'momentum'
  readonly name = 'Momentum Strategy'
  readonly description = 'Buy above 20-day high; sell below 10-day low.'
  readonly riskLevel = 'high' as const

  private breakoutPeriod: number
  private exitPeriod: number

  constructor(breakoutPeriod = 20, exitPeriod = 10) {
    this.breakoutPeriod = breakoutPeriod
    this.exitPeriod = exitPeriod
  }

  generateSignal(context: StrategyContext): StrategySignalResult {
    const window = context.bars.slice(0, context.index + 1)
    const current = window[window.length - 1]

    if (window.length < this.breakoutPeriod + 1) {
      return { signal: 'HOLD', reason: 'Insufficient bars for momentum breakout' }
    }

    const priorBars = window.slice(0, -1)
    const high20 = highestHigh(priorBars, this.breakoutPeriod)
    const low10 = lowestLow(window, this.exitPeriod)

    if (high20 === null || low10 === null) {
      return { signal: 'HOLD', reason: 'Range levels unavailable' }
    }

    if (current.close > high20) {
      return {
        signal: 'BUY',
        reason: `Close ${current.close} broke ${this.breakoutPeriod}-day high ${high20}`,
        metadata: { high20, close: current.close },
      }
    }

    if (current.close < low10) {
      return {
        signal: 'SELL',
        reason: `Close ${current.close} below ${this.exitPeriod}-day low ${low10}`,
        metadata: { low10, close: current.close },
      }
    }

    return { signal: 'HOLD', reason: 'Price inside momentum range' }
  }
}
