import type { ScannerRow } from '@/types/scanner'
import type { WatchlistRow } from '@/types/watchlist'

/** US Mega Cap 7 — Magnificent Seven (NYSE/NASDAQ). */
export const MEGA_CAP_7_SYMBOLS = [
  'AAPL',
  'MSFT',
  'GOOGL',
  'AMZN',
  'NVDA',
  'META',
  'TSLA',
] as const

export type MegaCap7Symbol = (typeof MEGA_CAP_7_SYMBOLS)[number]

export interface MegaCap7Stock {
  symbol: MegaCap7Symbol
  company: string
  sector: string
  market: 'US'
}

export const MEGA_CAP_7_STOCKS: Record<MegaCap7Symbol, MegaCap7Stock> = {
  AAPL: { symbol: 'AAPL', company: 'Apple Inc.', sector: 'Technology', market: 'US' },
  MSFT: { symbol: 'MSFT', company: 'Microsoft Corp.', sector: 'Technology', market: 'US' },
  GOOGL: { symbol: 'GOOGL', company: 'Alphabet Inc.', sector: 'Communication Services', market: 'US' },
  AMZN: { symbol: 'AMZN', company: 'Amazon.com Inc.', sector: 'Consumer Discretionary', market: 'US' },
  NVDA: { symbol: 'NVDA', company: 'NVIDIA Corp.', sector: 'Technology', market: 'US' },
  META: { symbol: 'META', company: 'Meta Platforms', sector: 'Communication Services', market: 'US' },
  TSLA: { symbol: 'TSLA', company: 'Tesla Inc.', sector: 'Consumer Discretionary', market: 'US' },
}

export const MEGA_CAP_7_SEARCHABLE = MEGA_CAP_7_SYMBOLS.map((symbol) => ({
  symbol,
  company: MEGA_CAP_7_STOCKS[symbol].company,
}))

export const MEGA_CAP_7_SYMBOL_OPTIONS = MEGA_CAP_7_SEARCHABLE

export function isMegaCap7Symbol(symbol: string): symbol is MegaCap7Symbol {
  return (MEGA_CAP_7_SYMBOLS as readonly string[]).includes(symbol.toUpperCase())
}

/** Static row shell — live Yahoo quotes replace price, change %, volume, market cap. */
export function createWatchlistRow(
  symbol: MegaCap7Symbol,
  overrides: Partial<WatchlistRow> = {},
): WatchlistRow {
  const stock = MEGA_CAP_7_STOCKS[symbol]
  return {
    symbol,
    company: stock.company,
    price: 0,
    changePercent: 0,
    marketCap: 0,
    volume: 0,
    rsi: 55,
    aiScore: 80,
    signal: 'watch',
    ...overrides,
  }
}

export function createScannerRow(
  symbol: MegaCap7Symbol,
  overrides: Partial<ScannerRow> = {},
): ScannerRow {
  const stock = MEGA_CAP_7_STOCKS[symbol]
  return {
    symbol,
    company: stock.company,
    price: 0,
    changePercent: 0,
    volume: 0,
    relativeVolume: 1,
    rsi: 55,
    aiScore: 80,
    signal: 'watch',
    sector: stock.sector,
    market: stock.market,
    strategyMatch: 'Mega Cap 7',
    ...overrides,
  }
}

export const MEGA_CAP_7_WATCHLIST_ROWS: WatchlistRow[] = MEGA_CAP_7_SYMBOLS.map((symbol) =>
  createWatchlistRow(symbol),
)

export const MEGA_CAP_7_SCANNER_ROWS: ScannerRow[] = MEGA_CAP_7_SYMBOLS.map((symbol) =>
  createScannerRow(symbol),
)

export const MEGA_CAP_7_FILTER_OPTIONS = [
  { value: 'all', label: 'All Mega Cap 7' },
  ...MEGA_CAP_7_SYMBOLS.map((symbol) => ({
    value: symbol,
    label: symbol,
  })),
]
