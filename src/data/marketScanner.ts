import type { AiInsight, MarketOverviewCard, ScannerRow } from '@/types/scanner'
import { MEGA_CAP_7_SCANNER_ROWS, MEGA_CAP_7_STOCKS } from '@/data/megaCap7'

export const MARKET_OVERVIEW: MarketOverviewCard[] = [
  {
    id: 'gainers',
    title: 'Top Gainers',
    count: 7,
    highlight: 'Mega Cap 7 scan',
    subtext: 'US mega-cap leaders',
  },
  {
    id: 'losers',
    title: 'Top Losers',
    count: 7,
    highlight: 'Mega Cap 7 scan',
    subtext: 'Live quote overlay',
  },
  {
    id: 'unusual-volume',
    title: 'Unusual Volume',
    count: 7,
    highlight: 'NVDA · TSLA',
    subtext: 'Volume from live feed',
  },
  {
    id: 'high-momentum',
    title: 'High Momentum',
    count: 7,
    highlight: 'Mega Cap 7 only',
    subtext: 'US market',
  },
  {
    id: 'ai-buy',
    title: 'AI Buy Signals',
    count: 7,
    highlight: 'NVDA · META',
    subtext: 'Mega Cap 7 universe',
  },
  {
    id: 'earnings',
    title: 'Mega Cap 7',
    count: 7,
    highlight: 'AAPL · AMZN · GOOGL',
    subtext: 'US mega-cap earnings watch',
  },
]

export const SCANNER_ROWS: ScannerRow[] = MEGA_CAP_7_SCANNER_ROWS

export const AI_INSIGHTS: AiInsight[] = [
  {
    id: 'insight-1',
    type: 'setup',
    title: "Today's Mega Cap 7 scan",
    body: 'Scanner covers AAPL, MSFT, GOOGL, AMZN, NVDA, META, and TSLA only. Price, change %, and volume are loaded from live Yahoo Finance quotes.',
    symbol: 'NVDA',
  },
  {
    id: 'insight-2',
    type: 'activity',
    title: 'Live quote overlay active',
    body: 'Static AI scores remain for layout preview; market price, daily change, and volume reflect the latest Yahoo Finance data when connected.',
    symbol: 'AAPL',
  },
  {
    id: 'insight-3',
    type: 'risk',
    title: 'Universe locked to Mega Cap 7',
    body: 'Non mega-cap symbols were removed from the portal. IBKR paper positions may still show other holdings from your account.',
  },
]

export const SECTOR_OPTIONS = [
  'all',
  ...Array.from(new Set(Object.values(MEGA_CAP_7_STOCKS).map((stock) => stock.sector))),
]

export const STRATEGY_MATCH_OPTIONS = ['all', 'Mega Cap 7']

export const SCANNER_STATS = {
  totalScanned: 7,
  lastScan: new Date().toISOString(),
}
