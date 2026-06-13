import type { Quote } from '@/services/market/types'
import type { ScannerRow } from '@/types/scanner'
import type { WatchlistRow } from '@/types/watchlist'

export function quotesBySymbol(quotes: Quote[]): Map<string, Quote> {
  return new Map(quotes.map((quote) => [quote.symbol.toUpperCase(), quote]))
}

export function mergeQuotesIntoWatchlistRows(rows: WatchlistRow[], quotes: Quote[]): WatchlistRow[] {
  const bySymbol = quotesBySymbol(quotes)
  return rows.map((row) => {
    const quote = bySymbol.get(row.symbol.toUpperCase())
    if (!quote) return row
    return {
      ...row,
      price: quote.currentPrice,
      changePercent: quote.dailyChangePercent,
      marketCap: quote.marketCap,
      volume: quote.volume,
    }
  })
}

export function mergeQuotesIntoScannerRows(rows: ScannerRow[], quotes: Quote[]): ScannerRow[] {
  const bySymbol = quotesBySymbol(quotes)
  return rows.map((row) => {
    const quote = bySymbol.get(row.symbol.toUpperCase())
    if (!quote) return row
    const baselineVolume = row.volume
    return {
      ...row,
      price: quote.currentPrice,
      changePercent: quote.dailyChangePercent,
      volume: quote.volume,
      relativeVolume:
        baselineVolume > 0
          ? Number((quote.volume / baselineVolume).toFixed(2))
          : row.relativeVolume,
    }
  })
}
