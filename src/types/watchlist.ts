import type { ScannerSignal } from '@/types/scanner'

export type WatchlistGroupId =
  | 'ai-growth'
  | 'semiconductor'
  | 'magnificent-7'
  | 'high-momentum'
  | 'dividend'
  | 'custom'

export interface WatchlistGroup {
  id: WatchlistGroupId
  name: string
  description: string
  symbolCount: number
}

export interface WatchlistRow {
  symbol: string
  company: string
  price: number
  changePercent: number
  marketCap: number
  volume: number
  rsi: number
  aiScore: number
  signal: ScannerSignal
}

export interface AddSymbolForm {
  symbol: string
  watchlistId: WatchlistGroupId
  notes: string
  targetBuyPrice: number | ''
  targetSellPrice: number | ''
}

export interface WatchlistAlertSettings {
  priceAlert: boolean
  priceThreshold: number
  rsiAlert: boolean
  rsiOverbought: number
  rsiOversold: number
  volumeSpikeAlert: boolean
  volumeSpikeMultiplier: number
  newsAlert: boolean
  earningsAlert: boolean
}

export const DEFAULT_ADD_SYMBOL_FORM: AddSymbolForm = {
  symbol: '',
  watchlistId: 'custom',
  notes: '',
  targetBuyPrice: '',
  targetSellPrice: '',
}

export const DEFAULT_WATCHLIST_ALERTS: WatchlistAlertSettings = {
  priceAlert: true,
  priceThreshold: 5,
  rsiAlert: true,
  rsiOverbought: 70,
  rsiOversold: 30,
  volumeSpikeAlert: true,
  volumeSpikeMultiplier: 2,
  newsAlert: false,
  earningsAlert: true,
}
