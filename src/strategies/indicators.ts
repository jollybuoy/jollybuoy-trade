import type { OHLCBar } from '@/services/market/types'

export function sma(values: number[], period: number): number | null {
  if (values.length < period) return null
  const slice = values.slice(-period)
  return slice.reduce((sum, v) => sum + v, 0) / period
}

/** Wilder-style RSI approximation over closing prices. */
export function rsi(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null

  let gains = 0
  let losses = 0

  for (let i = closes.length - period; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1]
    if (change >= 0) gains += change
    else losses += Math.abs(change)
  }

  if (losses === 0) return 100
  const rs = gains / losses
  return 100 - 100 / (1 + rs)
}

export function highestHigh(bars: OHLCBar[], period: number): number | null {
  if (bars.length < period) return null
  return Math.max(...bars.slice(-period).map((b) => b.high))
}

export function lowestLow(bars: OHLCBar[], period: number): number | null {
  if (bars.length < period) return null
  return Math.min(...bars.slice(-period).map((b) => b.low))
}

export function closingPrices(bars: OHLCBar[]): number[] {
  return bars.map((b) => b.close)
}
