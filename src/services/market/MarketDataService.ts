import { MockMarketDataProvider } from '@/services/market/providers/MockMarketDataProvider'
import type { HistoricalData, MarketDataProvider, Quote } from '@/services/market/types'

/**
 * Facade over pluggable market data providers.
 * Swap `provider` at runtime when Yahoo or IBKR feeds are ready.
 */
export class MarketDataService {
  private provider: MarketDataProvider

  constructor(provider: MarketDataProvider = new MockMarketDataProvider()) {
    this.provider = provider
  }

  get activeSource() {
    return this.provider.source
  }

  /** Replace provider without changing consumer code (e.g. UI hooks, paper engine). */
  setProvider(provider: MarketDataProvider) {
    this.provider = provider
  }

  async getQuote(symbol: string): Promise<Quote> {
    return this.provider.getQuote(symbol)
  }

  async getHistoricalData(
    symbol: string,
    startDate?: string,
    endDate?: string,
  ): Promise<HistoricalData> {
    return this.provider.getHistoricalData(symbol, startDate, endDate)
  }

  async getWatchlistData(symbols: string[]): Promise<Quote[]> {
    return this.provider.getWatchlistData(symbols)
  }
}

/** Shared singleton for app-wide mock data during Phase 1. */
export const marketDataService = new MarketDataService()
