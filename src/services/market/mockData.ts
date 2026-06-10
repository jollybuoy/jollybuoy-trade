import type { OHLCBar, Quote } from '@/services/market/types'

/** Static quote seeds — replace with live feed via provider swap. */
const QUOTE_SEEDS: Record<string, Omit<Quote, 'symbol' | 'asOf'>> = {
  AAPL: { currentPrice: 195.87, previousClose: 193.46, dailyChange: 2.41, dailyChangePercent: 1.24, volume: 58_420_000, marketCap: 3_020_000_000_000 },
  MSFT: { currentPrice: 412.35, previousClose: 408.73, dailyChange: 3.62, dailyChangePercent: 0.88, volume: 22_180_000, marketCap: 3_060_000_000_000 },
  GOOGL: { currentPrice: 172.38, previousClose: 170.24, dailyChange: 2.14, dailyChangePercent: 1.26, volume: 28_650_000, marketCap: 2_140_000_000_000 },
  AMZN: { currentPrice: 186.54, previousClose: 187.76, dailyChange: -1.22, dailyChangePercent: -0.65, volume: 42_180_000, marketCap: 1_940_000_000_000 },
  NVDA: { currentPrice: 892.14, previousClose: 873.1, dailyChange: 19.04, dailyChangePercent: 2.18, volume: 42_800_000, marketCap: 2_200_000_000_000 },
  META: { currentPrice: 512.84, previousClose: 506.12, dailyChange: 6.72, dailyChangePercent: 1.33, volume: 18_920_000, marketCap: 1_310_000_000_000 },
  TSLA: { currentPrice: 248.92, previousClose: 240.58, dailyChange: 8.34, dailyChangePercent: 3.47, volume: 98_420_000, marketCap: 792_000_000_000 },
}

function pseudoPrice(symbol: string, dayOffset: number, base: number): number {
  const hash = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const wave = Math.sin((dayOffset + hash) * 0.17) * 0.025
  return Number((base * (1 + wave)).toFixed(2))
}

export function getMockQuote(symbol: string): Quote {
  const upper = symbol.toUpperCase()
  const seed = QUOTE_SEEDS[upper]
  const base = seed?.currentPrice ?? 100 + (upper.charCodeAt(0) % 40) * 3

  const currentPrice = seed?.currentPrice ?? base
  const previousClose = seed?.previousClose ?? Number((currentPrice * 0.99).toFixed(2))

  return {
    symbol: upper,
    currentPrice,
    previousClose,
    dailyChange: seed?.dailyChange ?? Number((currentPrice - previousClose).toFixed(2)),
    dailyChangePercent: seed?.dailyChangePercent ?? 1.2,
    volume: seed?.volume ?? 5_000_000,
    marketCap: seed?.marketCap ?? 50_000_000_000,
    asOf: new Date().toISOString(),
  }
}

/** Generates deterministic daily OHLC for backtesting and strategy signals. */
export function getMockHistoricalBars(symbol: string, barCount = 252): OHLCBar[] {
  const quote = getMockQuote(symbol)
  const bars: OHLCBar[] = []
  let prevClose = quote.currentPrice * 0.85

  for (let i = barCount; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const close = pseudoPrice(symbol, i, prevClose * 1.001)
    const open = prevClose
    const high = Math.max(open, close) * 1.012
    const low = Math.min(open, close) * 0.988
    bars.push({
      date: date.toISOString().slice(0, 10),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(4_000_000 + Math.random() * 20_000_000),
    })
    prevClose = close
  }

  return bars
}

export function filterBarsByDateRange(
  bars: OHLCBar[],
  startDate?: string,
  endDate?: string,
): OHLCBar[] {
  return bars.filter((bar) => {
    if (startDate && bar.date < startDate) return false
    if (endDate && bar.date > endDate) return false
    return true
  })
}
