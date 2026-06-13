export type ScannerSignal = 'buy' | 'watch' | 'avoid'

export type ScannerMarket = 'US' | 'CA'

export interface MarketOverviewCard {
  id: string
  title: string
  count: number
  highlight: string
  subtext: string
}

export interface ScannerRow {
  symbol: string
  company: string
  price: number
  changePercent: number
  volume: number
  relativeVolume: number
  rsi: number
  aiScore: number
  signal: ScannerSignal
  sector: string
  market: ScannerMarket
  strategyMatch: string
}

export interface AiInsight {
  id: string
  type: 'setup' | 'activity' | 'risk'
  title: string
  body: string
  symbol?: string
}

export interface ScannerFilters {
  market: 'all' | ScannerMarket
  sector: string
  priceMin: number
  priceMax: number
  minVolume: number
  signal: 'all' | ScannerSignal
  strategyMatch: string
}

export const DEFAULT_SCANNER_FILTERS: ScannerFilters = {
  market: 'all',
  sector: 'all',
  priceMin: 0,
  priceMax: 1000,
  minVolume: 0,
  signal: 'all',
  strategyMatch: 'all',
}
