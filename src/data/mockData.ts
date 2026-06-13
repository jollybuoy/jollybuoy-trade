import { MEGA_CAP_7_STOCKS, MEGA_CAP_7_SYMBOLS } from '@/data/megaCap7'
import type {
  MarketIndex,
  PaperTrade,
  PortfolioSnapshot,
  Position,
  ScannerResult,
  Strategy,
  Trade,
  WatchlistItem,
} from '@/types'

export const portfolioSummary = {
  totalValue: 284_750.42,
  dayChange: 3_842.18,
  dayChangePercent: 1.37,
  totalPnL: 42_750.42,
  totalPnLPercent: 17.65,
  cash: 45_230.0,
  buyingPower: 90_460.0,
}

export const marketIndices: MarketIndex[] = [
  { name: 'S&P 500', value: 5_234.18, change: 42.31, changePercent: 0.81 },
  { name: 'NASDAQ', value: 16_742.39, change: 128.54, changePercent: 0.77 },
  { name: 'DOW', value: 39_512.84, change: -86.22, changePercent: -0.22 },
  { name: 'VIX', value: 13.42, change: -0.68, changePercent: -4.82 },
]

export const portfolioHistory: PortfolioSnapshot[] = [
  { date: '2026-01-06', value: 242_000, benchmark: 238_000 },
  { date: '2026-01-13', value: 245_500, benchmark: 239_500 },
  { date: '2026-01-20', value: 243_800, benchmark: 238_800 },
  { date: '2026-01-27', value: 248_200, benchmark: 241_200 },
  { date: '2026-02-03', value: 251_400, benchmark: 243_400 },
  { date: '2026-02-10', value: 249_900, benchmark: 242_900 },
  { date: '2026-02-17', value: 254_600, benchmark: 245_600 },
  { date: '2026-02-24', value: 258_100, benchmark: 247_100 },
  { date: '2026-03-03', value: 261_800, benchmark: 249_800 },
  { date: '2026-03-10', value: 265_400, benchmark: 251_400 },
  { date: '2026-03-17', value: 268_900, benchmark: 253_900 },
  { date: '2026-03-24', value: 272_300, benchmark: 255_300 },
  { date: '2026-03-31', value: 275_800, benchmark: 257_800 },
  { date: '2026-04-07', value: 273_500, benchmark: 256_500 },
  { date: '2026-04-14', value: 278_200, benchmark: 258_200 },
  { date: '2026-04-21', value: 281_600, benchmark: 259_600 },
  { date: '2026-04-28', value: 279_400, benchmark: 258_400 },
  { date: '2026-05-05', value: 282_100, benchmark: 260_100 },
  { date: '2026-05-12', value: 280_908, benchmark: 259_908 },
  { date: '2026-05-19', value: 283_450, benchmark: 261_450 },
  { date: '2026-05-26', value: 281_200, benchmark: 260_200 },
  { date: '2026-06-02', value: 284_750, benchmark: 262_750 },
]

export const positions: Position[] = MEGA_CAP_7_SYMBOLS.map((symbol) => ({
  symbol,
  name: MEGA_CAP_7_STOCKS[symbol].company,
  shares: [150, 80, 45, 60, 35, 25, 40][MEGA_CAP_7_SYMBOLS.indexOf(symbol)],
  avgCost: [178.42, 385.2, 680.5, 168.3, 405, 480.2, 238.5][MEGA_CAP_7_SYMBOLS.indexOf(symbol)],
  currentPrice: 0,
  sector: MEGA_CAP_7_STOCKS[symbol].sector,
  sparkline: [0, 0, 0, 0, 0, 0, 0],
}))

export const watchlist: WatchlistItem[] = MEGA_CAP_7_SYMBOLS.map((symbol) => ({
  symbol,
  name: MEGA_CAP_7_STOCKS[symbol].company,
  price: 0,
  change: 0,
  changePercent: 0,
  volume: 0,
}))

export const scannerResults: ScannerResult[] = MEGA_CAP_7_SYMBOLS.map((symbol, index) => ({
  symbol,
  name: MEGA_CAP_7_STOCKS[symbol].company,
  price: 0,
  changePercent: 0,
  volume: 0,
  signal: (['breakout', 'momentum', 'volume_spike', 'oversold'] as const)[index % 4],
  score: 92 - index * 2,
}))

export const strategies: Strategy[] = [
  {
    id: 'strat-1',
    name: 'Momentum Breakout',
    description: 'Identifies stocks breaking above key resistance with volume confirmation.',
    status: 'active',
    type: 'breakout',
    winRate: 68.4,
    totalTrades: 142,
    pnl: 18_420.5,
    lastRun: '2026-06-06T09:30:00Z',
  },
  {
    id: 'strat-2',
    name: 'Mean Reversion RSI',
    description: 'Buys oversold conditions and sells overbought using RSI divergence.',
    status: 'active',
    type: 'mean_reversion',
    winRate: 62.1,
    totalTrades: 89,
    pnl: 8_240.0,
    lastRun: '2026-06-06T09:15:00Z',
  },
  {
    id: 'strat-3',
    name: 'AI Sentiment Alpha',
    description: 'Uses NLP to analyze news sentiment and social signals for trade ideas.',
    status: 'paused',
    type: 'ai',
    winRate: 71.8,
    totalTrades: 56,
    pnl: 12_680.0,
    lastRun: '2026-06-05T16:00:00Z',
  },
  {
    id: 'strat-4',
    name: 'Sector Rotation',
    description: 'Rotates into leading sectors based on relative strength rankings.',
    status: 'draft',
    type: 'momentum',
    winRate: 0,
    totalTrades: 0,
    pnl: 0,
    lastRun: '2026-06-01T12:00:00Z',
  },
]

export const paperTrades: PaperTrade[] = [
  { id: 'pt-1', symbol: 'TSLA', side: 'buy', quantity: 25, price: 245.18, timestamp: '2026-06-06T10:15:00Z', status: 'filled' },
  { id: 'pt-2', symbol: 'MSFT', side: 'sell', quantity: 20, price: 408.2, timestamp: '2026-06-06T09:45:00Z', status: 'filled' },
  { id: 'pt-3', symbol: 'AMZN', side: 'buy', quantity: 50, price: 182.4, timestamp: '2026-06-06T09:30:00Z', status: 'filled' },
  { id: 'pt-4', symbol: 'GOOGL', side: 'buy', quantity: 30, price: 168.72, timestamp: '2026-06-06T09:00:00Z', status: 'pending' },
  { id: 'pt-5', symbol: 'NVDA', side: 'sell', quantity: 10, price: 890.0, timestamp: '2026-06-05T15:30:00Z', status: 'cancelled' },
]

export const paperAccount = {
  balance: 100_000,
  equity: 108_420.5,
  dayPnL: 842.18,
  dayPnLPercent: 0.78,
  openPositions: 4,
  marginUsed: 12_450,
  marginAvailable: 87_550,
}

export const paperPositions = MEGA_CAP_7_SYMBOLS.slice(0, 4).map((symbol, index) => ({
  symbol,
  name: MEGA_CAP_7_STOCKS[symbol].company,
  shares: [25, 10, 40, 20][index],
  avgCost: [238.5, 850, 192.45, 405][index],
  currentPrice: 0,
  sparkline: [0, 0, 0, 0, 0, 0, 0],
}))

export const botStatus = {
  name: 'JollyBuoy Alpha',
  status: 'running' as const,
  uptime: '14h 22m',
  signalsToday: 12,
  lastSignal: 'NVDA breakout — 09:42 ET',
  model: 'GPT-4o + Quant Layer',
  confidence: 87,
}

export const riskControls = {
  maxDailyLoss: 5_000,
  currentDailyLoss: 420,
  maxPositionSize: 25_000,
  currentExposure: 18_240,
  maxDrawdown: 15,
  currentDrawdown: 3.2,
  stopLossEnabled: true,
  trailingStopEnabled: true,
}

export const scannerStats = {
  totalScanned: 7,
  signalsFound: 7,
  avgScore: 81.4,
  lastScan: '2026-06-06T10:30:00Z',
  topSignal: 'NVDA Breakout',
}

export const tradeHistory: Trade[] = [
  { id: 'tr-1', symbol: 'AAPL', side: 'buy', quantity: 50, price: 192.45, total: 9_622.5, timestamp: '2026-06-05T14:22:00Z', status: 'filled', strategy: 'Momentum Breakout' },
  { id: 'tr-2', symbol: 'NVDA', side: 'buy', quantity: 10, price: 885.2, total: 8_852.0, timestamp: '2026-06-05T11:08:00Z', status: 'filled', strategy: 'AI Sentiment Alpha' },
  { id: 'tr-3', symbol: 'MSFT', side: 'sell', quantity: 20, price: 410.85, total: 8_217.0, timestamp: '2026-06-04T15:45:00Z', status: 'filled', strategy: 'Mean Reversion RSI' },
  { id: 'tr-4', symbol: 'TSLA', side: 'buy', quantity: 15, price: 238.92, total: 3_583.8, timestamp: '2026-06-04T10:30:00Z', status: 'filled' },
  { id: 'tr-5', symbol: 'GOOGL', side: 'buy', quantity: 40, price: 168.72, total: 6_748.8, timestamp: '2026-06-03T13:15:00Z', status: 'filled', strategy: 'Sector Rotation' },
  { id: 'tr-6', symbol: 'AMZN', side: 'sell', quantity: 75, price: 184.4, total: 13_830.0, timestamp: '2026-06-03T09:52:00Z', status: 'partial' },
  { id: 'tr-7', symbol: 'GOOGL', side: 'buy', quantity: 25, price: 168.72, total: 4_218.0, timestamp: '2026-06-02T14:00:00Z', status: 'filled', strategy: 'Momentum Breakout' },
  { id: 'tr-8', symbol: 'META', side: 'sell', quantity: 10, price: 508.24, total: 5_082.4, timestamp: '2026-06-02T11:30:00Z', status: 'cancelled' },
]

export const sectorAllocation = [
  { name: 'Technology', value: 52.4 },
  { name: 'Communication Services', value: 24.8 },
  { name: 'Consumer Discretionary', value: 17.8 },
  { name: 'Cash', value: 5.0 },
]

export const recentActivity = [
  { id: '1', type: 'trade', message: 'Bought 50 AAPL @ $192.45', time: '2026-06-05T14:22:00Z' },
  { id: '2', type: 'alert', message: 'NVDA hit price target $890', time: '2026-06-05T12:00:00Z' },
  { id: '3', type: 'strategy', message: 'Momentum Breakout triggered TSLA signal', time: '2026-06-05T09:30:00Z' },
  { id: '4', type: 'trade', message: 'Sold 20 MSFT @ $410.85', time: '2026-06-04T15:45:00Z' },
  { id: '5', type: 'system', message: 'Daily portfolio snapshot saved', time: '2026-06-04T16:00:00Z' },
]

export const userSettings = {
  displayName: 'Trader',
  email: 'trader@jollybuoy.com',
  timezone: 'America/New_York',
  currency: 'USD',
  notifications: {
    priceAlerts: true,
    tradeConfirmations: true,
    strategySignals: true,
    dailySummary: false,
  },
  trading: {
    defaultOrderType: 'limit',
    confirmBeforeTrade: true,
    paperTradingEnabled: true,
  },
}
