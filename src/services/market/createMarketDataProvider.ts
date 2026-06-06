import { MockMarketDataProvider } from '@/services/market/providers/MockMarketDataProvider'
import { YahooFinanceProvider } from '@/services/market/providers/YahooFinanceProvider'
import type { MarketDataProvider } from '@/services/market/types'

export type MarketDataProviderKind = 'mock' | 'yahoo'

export function resolveMarketDataProviderKind(): MarketDataProviderKind {
  const configured = import.meta.env.VITE_MARKET_DATA_PROVIDER?.trim().toLowerCase()
  if (configured === 'mock' || configured === 'yahoo') {
    return configured
  }
  return 'yahoo'
}

export function createMarketDataProvider(kind = resolveMarketDataProviderKind()): MarketDataProvider {
  if (kind === 'mock') {
    return new MockMarketDataProvider()
  }
  return new YahooFinanceProvider()
}

/** Alias matching provider abstraction naming. */
export { MockMarketDataProvider as MockProvider } from '@/services/market/providers/MockMarketDataProvider'
