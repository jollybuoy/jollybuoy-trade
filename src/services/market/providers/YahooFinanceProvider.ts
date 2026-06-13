import { filterBarsByDateRange } from '@/services/market/mockData'
import { fetchYahooChart } from '@/services/market/yahooClient'
import type { HistoricalData, MarketDataProvider, OHLCBar, Quote } from '@/services/market/types'

function mapChartToQuote(result: Awaited<ReturnType<typeof fetchYahooChart>>): Quote {
  const meta = result.meta!
  const symbol = (meta.symbol ?? '').toUpperCase()
  const currentPrice = meta.regularMarketPrice ?? 0
  const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? currentPrice
  const dailyChange = Number((currentPrice - previousClose).toFixed(2))
  const dailyChangePercent =
    previousClose > 0 ? Number(((dailyChange / previousClose) * 100).toFixed(2)) : 0

  return {
    symbol,
    currentPrice,
    previousClose,
    dailyChange,
    dailyChangePercent,
    volume: meta.regularMarketVolume ?? 0,
    marketCap: meta.marketCap ?? 0,
    asOf: new Date().toISOString(),
  }
}

function mapChartToBars(result: Awaited<ReturnType<typeof fetchYahooChart>>): OHLCBar[] {
  const timestamps = result.timestamp ?? []
  const quote = result.indicators?.quote?.[0]
  if (!quote) return []

  const bars: OHLCBar[] = []

  timestamps.forEach((timestamp, index) => {
    const close = quote.close?.[index]
    if (close == null) return

    bars.push({
      date: new Date(timestamp * 1000).toISOString().slice(0, 10),
      open: quote.open?.[index] ?? close,
      high: quote.high?.[index] ?? close,
      low: quote.low?.[index] ?? close,
      close,
      volume: quote.volume?.[index] ?? 0,
    })
  })

  return bars
}

/** Live quotes and historical bars via Yahoo Finance chart API. */
export class YahooFinanceProvider implements MarketDataProvider {
  readonly source = 'yahoo' as const

  async getQuote(symbol: string): Promise<Quote> {
    const result = await fetchYahooChart(symbol, 'interval=1d&range=1d')
    return mapChartToQuote(result)
  }

  async getHistoricalData(
    symbol: string,
    startDate?: string,
    endDate?: string,
  ): Promise<HistoricalData> {
    const result = await fetchYahooChart(symbol, 'interval=1d&range=1y')
    const bars = filterBarsByDateRange(mapChartToBars(result), startDate, endDate)

    return {
      symbol: symbol.toUpperCase(),
      bars,
      interval: '1d',
      source: 'yahoo',
    }
  }

  async getWatchlistData(symbols: string[]): Promise<Quote[]> {
    const results = await Promise.allSettled(symbols.map((symbol) => this.getQuote(symbol)))
    return results
      .filter((result): result is PromiseFulfilledResult<Quote> => result.status === 'fulfilled')
      .map((result) => result.value)
  }
}
