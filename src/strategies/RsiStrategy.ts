import { closingPrices, rsi } from '@/strategies/indicators'
import type { Strategy, StrategyContext, StrategySignalResult } from '@/strategies/types'

export class RsiStrategy implements Strategy {
  readonly id = 'rsi'
  readonly name = 'RSI Strategy'
  readonly description = 'Buy oversold (RSI < 30), sell overbought (RSI > 70).'
  readonly riskLevel = 'medium' as const

  private oversold: number
  private overbought: number

  constructor(oversold = 30, overbought = 70) {
    this.oversold = oversold
    this.overbought = overbought
  }

  generateSignal(context: StrategyContext): StrategySignalResult {
    const closes = closingPrices(context.bars.slice(0, context.index + 1))
    const value = rsi(closes)

    if (value === null) {
      return { signal: 'HOLD', reason: 'Insufficient bars for RSI' }
    }

    if (value < this.oversold) {
      return { signal: 'BUY', reason: `RSI ${value.toFixed(1)} below ${this.oversold}`, metadata: { rsi: value } }
    }

    if (value > this.overbought) {
      return { signal: 'SELL', reason: `RSI ${value.toFixed(1)} above ${this.overbought}`, metadata: { rsi: value } }
    }

    return { signal: 'HOLD', reason: `RSI neutral at ${value.toFixed(1)}`, metadata: { rsi: value } }
  }
}
