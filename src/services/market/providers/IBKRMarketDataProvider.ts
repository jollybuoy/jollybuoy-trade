import type { HistoricalData, MarketDataProvider, Quote } from '@/services/market/types'

/**
 * Placeholder for Interactive Brokers market data via TWS / IB Gateway.
 *
 * Future integration (Python sidecar or Node IB API):
 * - reqMktData / reqHistoricalData for subscriptions
 * - Normalize IB contract symbols to platform symbols
 * - Respect paper vs live account data permissions
 * - Stream ticks into Supabase Realtime or in-memory cache for the React UI
 */
export class IBKRMarketDataProvider implements MarketDataProvider {
  readonly source = 'ibkr' as const

  async getQuote(_symbol: string): Promise<Quote> {
    throw new Error(
      'IBKRMarketDataProvider not connected. Use MockMarketDataProvider until IB Gateway is configured.',
    )
  }

  async getHistoricalData(_symbol: string, _startDate?: string, _endDate?: string): Promise<HistoricalData> {
    throw new Error('IBKRMarketDataProvider not connected.')
  }

  async getWatchlistData(_symbols: string[]): Promise<Quote[]> {
    throw new Error('IBKRMarketDataProvider not connected.')
  }
}
