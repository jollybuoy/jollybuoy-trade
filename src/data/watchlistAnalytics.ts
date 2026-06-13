import type { WatchlistGroup, WatchlistGroupId, WatchlistRow } from '@/types/watchlist'
import {
  MEGA_CAP_7_SEARCHABLE,
  MEGA_CAP_7_STOCKS,
  MEGA_CAP_7_SYMBOLS,
  createWatchlistRow,
  type MegaCap7Symbol,
} from '@/data/megaCap7'

export const WATCHLIST_GROUP_ID = 'mega-cap-7' satisfies WatchlistGroupId

export const WATCHLIST_GROUPS: WatchlistGroup[] = [
  {
    id: WATCHLIST_GROUP_ID,
    name: 'Mega Cap 7',
    description: 'US mega-cap leaders — live Yahoo Finance quotes',
    symbolCount: MEGA_CAP_7_SYMBOLS.length,
  },
]

export const MEGA_CAP_7_WATCHLIST: WatchlistRow[] = MEGA_CAP_7_SYMBOLS.map((symbol) =>
  createWatchlistRow(symbol),
)

export const WATCHLIST_BY_GROUP: Record<WatchlistGroupId, WatchlistRow[]> = {
  [WATCHLIST_GROUP_ID]: MEGA_CAP_7_WATCHLIST,
}

export const SEARCHABLE_SYMBOLS = MEGA_CAP_7_SEARCHABLE

export function getMegaCap7Company(symbol: string): string {
  const upper = symbol.toUpperCase() as MegaCap7Symbol
  return MEGA_CAP_7_STOCKS[upper]?.company ?? symbol
}
