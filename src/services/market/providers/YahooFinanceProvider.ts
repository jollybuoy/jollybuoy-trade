import type { HistoricalData, MarketDataProvider, Quote } from '@/services/market/types'

/**
 * Placeholder for Yahoo Finance (or similar) public quote API.
 *
 * Future integration:
 * - Fetch quotes via yfinance Python microservice or third-party REST wrapper
 * - Map response fields to Quote / OHLCBar
 * - Cache in Supabase for rate-limit protection
 */
export class YahooFinanceProvider implements MarketDataProvider {
  readonly source = 'yahoo' as const

  async getQuote(_symbol: string): Promise<Quote> {
    throw new Error(
      'YahooFinanceProvider not implemented. Use MockMarketDataProvider or inject IBKRMarketDataProvider.',
    )
  }

  async getHistoricalData(_symbol: string, _startDate?: string, _endDate?: string): Promise<HistoricalData> {
    throw new Error('YahooFinanceProvider not implemented.')
  }

  async getWatchlistData(_symbols: string[]): Promise<Quote[]> {
    throw new Error('YahooFinanceProvider not implemented.')
  }
}
