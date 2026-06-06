export interface Position {
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  sector: string
}

export interface WatchlistItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
}

export interface ScannerResult {
  symbol: string
  name: string
  price: number
  changePercent: number
  volume: number
  signal: 'breakout' | 'momentum' | 'oversold' | 'volume_spike'
  score: number
}

export interface Strategy {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'draft'
  type: 'momentum' | 'mean_reversion' | 'breakout' | 'ai'
  winRate: number
  totalTrades: number
  pnl: number
  lastRun: string
}

export interface PaperTrade {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  timestamp: string
  status: 'filled' | 'pending' | 'cancelled'
}

export interface Trade {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  total: number
  timestamp: string
  status: 'filled' | 'partial' | 'cancelled'
  strategy?: string
}

export interface PortfolioSnapshot {
  date: string
  value: number
}

export interface MarketIndex {
  name: string
  value: number
  change: number
  changePercent: number
}

export interface NavItem {
  label: string
  path: string
  icon: string
}
