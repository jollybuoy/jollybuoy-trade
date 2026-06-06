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

export const positions: Position[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 150, avgCost: 178.42, currentPrice: 195.87, sector: 'Technology', sparkline: [188, 190, 192, 191, 194, 196, 195.87] },
  { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 80, avgCost: 385.2, currentPrice: 412.35, sector: 'Technology', sparkline: [398, 402, 405, 408, 410, 411, 412.35] },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 45, avgCost: 680.5, currentPrice: 892.14, sector: 'Technology', sparkline: [820, 845, 860, 872, 885, 890, 892.14] },
  { symbol: 'JPM', name: 'JPMorgan Chase', shares: 100, avgCost: 168.3, currentPrice: 198.72, sector: 'Financials', sparkline: [190, 192, 194, 196, 197, 198, 198.72] },
  { symbol: 'V', name: 'Visa Inc.', shares: 60, avgCost: 245.8, currentPrice: 278.45, sector: 'Financials', sparkline: [268, 270, 272, 274, 276, 277, 278.45] },
  { symbol: 'UNH', name: 'UnitedHealth Group', shares: 35, avgCost: 520.1, currentPrice: 498.32, sector: 'Healthcare', sparkline: [510, 508, 505, 502, 500, 499, 498.32] },
  { symbol: 'XOM', name: 'Exxon Mobil', shares: 120, avgCost: 98.45, currentPrice: 112.68, sector: 'Energy', sparkline: [106, 108, 109, 110, 111, 112, 112.68] },
]

export const watchlist: WatchlistItem[] = [
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.92, change: 8.34, changePercent: 3.47, volume: 98_420_000 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.54, change: -1.22, changePercent: -0.65, volume: 42_180_000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 172.38, change: 2.14, changePercent: 1.26, volume: 28_650_000 },
  { symbol: 'META', name: 'Meta Platforms', price: 512.84, change: 6.72, changePercent: 1.33, volume: 18_920_000 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 168.22, change: -3.48, changePercent: -2.03, volume: 52_340_000 },
  { symbol: 'CRM', name: 'Salesforce Inc.', price: 278.96, change: 1.84, changePercent: 0.66, volume: 8_420_000 },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 628.45, change: 12.38, changePercent: 2.01, volume: 4_280_000 },
  { symbol: 'COIN', name: 'Coinbase Global', price: 218.72, change: -5.62, changePercent: -2.51, volume: 12_680_000 },
]

export const scannerResults: ScannerResult[] = [
  { symbol: 'SMCI', name: 'Super Micro Computer', price: 842.18, changePercent: 8.42, volume: 18_420_000, signal: 'breakout', score: 92 },
  { symbol: 'PLTR', name: 'Palantir Technologies', price: 24.86, changePercent: 5.18, volume: 68_200_000, signal: 'momentum', score: 88 },
  { symbol: 'SOFI', name: 'SoFi Technologies', price: 8.42, changePercent: 4.72, volume: 42_800_000, signal: 'volume_spike', score: 85 },
  { symbol: 'RIVN', name: 'Rivian Automotive', price: 12.68, changePercent: -6.24, volume: 28_400_000, signal: 'oversold', score: 78 },
  { symbol: 'ARM', name: 'Arm Holdings', price: 128.54, changePercent: 3.86, volume: 8_620_000, signal: 'breakout', score: 82 },
  { symbol: 'DKNG', name: 'DraftKings Inc.', price: 42.18, changePercent: 6.12, volume: 14_280_000, signal: 'momentum', score: 79 },
  { symbol: 'UPST', name: 'Upstart Holdings', price: 28.94, changePercent: -4.82, volume: 6_840_000, signal: 'oversold', score: 74 },
  { symbol: 'SNOW', name: 'Snowflake Inc.', price: 168.42, changePercent: 2.94, volume: 4_280_000, signal: 'volume_spike', score: 76 },
]

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
  { id: 'pt-2', symbol: 'AMD', side: 'sell', quantity: 50, price: 169.42, timestamp: '2026-06-06T09:45:00Z', status: 'filled' },
  { id: 'pt-3', symbol: 'PLTR', side: 'buy', quantity: 200, price: 24.12, timestamp: '2026-06-06T09:30:00Z', status: 'filled' },
  { id: 'pt-4', symbol: 'COIN', side: 'buy', quantity: 30, price: 220.0, timestamp: '2026-06-06T09:00:00Z', status: 'pending' },
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

export const paperPositions = [
  { symbol: 'TSLA', name: 'Tesla Inc.', shares: 25, avgCost: 238.5, currentPrice: 248.92, sparkline: [240, 242, 245, 246, 247, 249, 248.92] },
  { symbol: 'PLTR', name: 'Palantir Technologies', shares: 200, avgCost: 23.8, currentPrice: 24.86, sparkline: [23.5, 23.8, 24.0, 24.2, 24.5, 24.7, 24.86] },
  { symbol: 'AMD', name: 'Advanced Micro Devices', shares: 50, avgCost: 172.0, currentPrice: 168.22, sparkline: [175, 173, 171, 170, 169, 168.5, 168.22] },
  { symbol: 'COIN', name: 'Coinbase Global', shares: 30, avgCost: 215.0, currentPrice: 218.72, sparkline: [212, 214, 216, 217, 218, 219, 218.72] },
]

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
  totalScanned: 4_832,
  signalsFound: 28,
  avgScore: 81.4,
  lastScan: '2026-06-06T10:30:00Z',
  topSignal: 'SMCI Breakout',
}

export const tradeHistory: Trade[] = [
  { id: 'tr-1', symbol: 'AAPL', side: 'buy', quantity: 50, price: 192.45, total: 9_622.5, timestamp: '2026-06-05T14:22:00Z', status: 'filled', strategy: 'Momentum Breakout' },
  { id: 'tr-2', symbol: 'NVDA', side: 'buy', quantity: 10, price: 885.2, total: 8_852.0, timestamp: '2026-06-05T11:08:00Z', status: 'filled', strategy: 'AI Sentiment Alpha' },
  { id: 'tr-3', symbol: 'MSFT', side: 'sell', quantity: 20, price: 410.85, total: 8_217.0, timestamp: '2026-06-04T15:45:00Z', status: 'filled', strategy: 'Mean Reversion RSI' },
  { id: 'tr-4', symbol: 'TSLA', side: 'buy', quantity: 15, price: 238.92, total: 3_583.8, timestamp: '2026-06-04T10:30:00Z', status: 'filled' },
  { id: 'tr-5', symbol: 'JPM', side: 'buy', quantity: 40, price: 196.18, total: 7_847.2, timestamp: '2026-06-03T13:15:00Z', status: 'filled', strategy: 'Sector Rotation' },
  { id: 'tr-6', symbol: 'AMD', side: 'sell', quantity: 75, price: 172.4, total: 12_930.0, timestamp: '2026-06-03T09:52:00Z', status: 'partial' },
  { id: 'tr-7', symbol: 'GOOGL', side: 'buy', quantity: 25, price: 168.72, total: 4_218.0, timestamp: '2026-06-02T14:00:00Z', status: 'filled', strategy: 'Momentum Breakout' },
  { id: 'tr-8', symbol: 'META', side: 'sell', quantity: 10, price: 508.24, total: 5_082.4, timestamp: '2026-06-02T11:30:00Z', status: 'cancelled' },
]

export const sectorAllocation = [
  { name: 'Technology', value: 58.2 },
  { name: 'Financials', value: 18.4 },
  { name: 'Healthcare', value: 8.6 },
  { name: 'Energy', value: 9.8 },
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
