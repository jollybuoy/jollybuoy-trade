/** Core market data types shared across mock, Yahoo Finance, and IBKR providers. */

export interface Quote {
  symbol: string
  currentPrice: number
  dailyChange: number
  dailyChangePercent: number
  volume: number
  marketCap: number
  /** ISO timestamp of last update */
  asOf: string
}

export interface OHLCBar {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface HistoricalData {
  symbol: string
  bars: OHLCBar[]
  interval: '1d' | '1h' | '5m'
  source: MarketDataSource
}

export type MarketDataSource = 'mock' | 'yahoo' | 'ibkr'

/**
 * Pluggable provider contract.
 * Future: YahooFinanceProvider fetches public quotes; IBKRMarketDataProvider streams via TWS/Gateway.
 */
export interface MarketDataProvider {
  readonly source: MarketDataSource
  getQuote(symbol: string): Promise<Quote>
  getHistoricalData(symbol: string, startDate?: string, endDate?: string): Promise<HistoricalData>
  getWatchlistData(symbols: string[]): Promise<Quote[]>
}
