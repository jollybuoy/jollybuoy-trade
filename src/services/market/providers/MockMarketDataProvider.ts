import {
  filterBarsByDateRange,
  getMockHistoricalBars,
  getMockQuote,
} from '@/services/market/mockData'
import type { HistoricalData, MarketDataProvider, Quote } from '@/services/market/types'

/** Default provider for local development and UI mock data. */
export class MockMarketDataProvider implements MarketDataProvider {
  readonly source = 'mock' as const

  async getQuote(symbol: string): Promise<Quote> {
    return getMockQuote(symbol)
  }

  async getHistoricalData(
    symbol: string,
    startDate?: string,
    endDate?: string,
  ): Promise<HistoricalData> {
    const bars = filterBarsByDateRange(getMockHistoricalBars(symbol), startDate, endDate)
    return {
      symbol: symbol.toUpperCase(),
      bars,
      interval: '1d',
      source: 'mock',
    }
  }

  async getWatchlistData(symbols: string[]): Promise<Quote[]> {
    return Promise.all(symbols.map((s) => this.getQuote(s)))
  }
}
