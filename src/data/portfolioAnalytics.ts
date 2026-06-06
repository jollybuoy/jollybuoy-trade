import type {
  AllocationSlice,
  CsvPreviewRow,
  MoverItem,
  PortfolioHolding,
  PortfolioSummary,
  RiskExposure,
} from '@/types/portfolio'

export const PORTFOLIO_SUMMARY: PortfolioSummary = {
  totalValue: 284_750.42,
  cashBalance: 45_230.0,
  investedValue: 239_520.42,
  unrealizedPnL: 42_750.42,
  unrealizedPnLPercent: 17.65,
  realizedPnL: 8_420.5,
  dayChangePercent: 1.37,
  dayChange: 3_842.18,
}

export const PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'h-1',
    symbol: 'AAPL',
    company: 'Apple Inc.',
    quantity: 150,
    avgCost: 178.42,
    currentPrice: 195.87,
    sector: 'Technology',
    assetClass: 'Equity',
  },
  {
    id: 'h-2',
    symbol: 'MSFT',
    company: 'Microsoft Corp.',
    quantity: 80,
    avgCost: 385.2,
    currentPrice: 412.35,
    sector: 'Technology',
    assetClass: 'Equity',
  },
  {
    id: 'h-3',
    symbol: 'NVDA',
    company: 'NVIDIA Corp.',
    quantity: 45,
    avgCost: 680.5,
    currentPrice: 892.14,
    sector: 'Technology',
    assetClass: 'Equity',
  },
  {
    id: 'h-4',
    symbol: 'JPM',
    company: 'JPMorgan Chase',
    quantity: 100,
    avgCost: 168.3,
    currentPrice: 198.72,
    sector: 'Financials',
    assetClass: 'Equity',
  },
  {
    id: 'h-5',
    symbol: 'V',
    company: 'Visa Inc.',
    quantity: 60,
    avgCost: 245.8,
    currentPrice: 278.45,
    sector: 'Financials',
    assetClass: 'Equity',
  },
  {
    id: 'h-6',
    symbol: 'UNH',
    company: 'UnitedHealth Group',
    quantity: 35,
    avgCost: 520.1,
    currentPrice: 498.32,
    sector: 'Healthcare',
    assetClass: 'Equity',
  },
  {
    id: 'h-7',
    symbol: 'XOM',
    company: 'Exxon Mobil',
    quantity: 120,
    avgCost: 98.45,
    currentPrice: 112.68,
    sector: 'Energy',
    assetClass: 'Equity',
  },
  {
    id: 'h-8',
    symbol: 'SPY',
    company: 'SPDR S&P 500 ETF',
    quantity: 40,
    avgCost: 480.2,
    currentPrice: 523.42,
    sector: 'ETF',
    assetClass: 'ETF',
  },
]

export const SECTOR_ALLOCATION: AllocationSlice[] = [
  { name: 'Technology', value: 58.2 },
  { name: 'Financials', value: 18.4 },
  { name: 'Healthcare', value: 8.6 },
  { name: 'Energy', value: 9.8 },
  { name: 'Cash', value: 5.0 },
]

export const ASSET_ALLOCATION: AllocationSlice[] = [
  { name: 'Equities', value: 78.5 },
  { name: 'ETFs', value: 11.2 },
  { name: 'Cash', value: 5.0 },
  { name: 'Options', value: 3.8 },
  { name: 'Other', value: 1.5 },
]

export const TOP_WINNERS: MoverItem[] = [
  { symbol: 'NVDA', company: 'NVIDIA Corp.', pnl: 9_518.8, pnlPercent: 31.1 },
  { symbol: 'AAPL', company: 'Apple Inc.', pnl: 2_617.5, pnlPercent: 9.78 },
  { symbol: 'JPM', company: 'JPMorgan Chase', pnl: 3_042.0, pnlPercent: 18.07 },
]

export const TOP_LOSERS: MoverItem[] = [
  { symbol: 'UNH', company: 'UnitedHealth Group', pnl: -762.3, pnlPercent: -4.19 },
  { symbol: 'AMD', company: 'Advanced Micro Devices', pnl: -189.0, pnlPercent: -2.21 },
  { symbol: 'COIN', company: 'Coinbase Global', pnl: -142.5, pnlPercent: -1.85 },
]

export const RISK_EXPOSURE: RiskExposure = {
  portfolioBeta: 1.12,
  maxSinglePosition: 14.2,
  topSectorConcentration: 58.2,
  techExposure: 58.2,
  internationalExposure: 8.4,
}

export const CSV_PREVIEW_SAMPLE: CsvPreviewRow[] = [
  { symbol: 'AAPL', quantity: 150, avgCost: 178.42, market: 'US' },
  { symbol: 'MSFT', quantity: 80, avgCost: 385.2, market: 'US' },
  { symbol: 'NVDA', quantity: 45, avgCost: 680.5, market: 'US' },
  { symbol: 'SHOP', quantity: 25, avgCost: 62.14, market: 'CA' },
]

export const CSV_SAMPLE_CONTENT = `Symbol,Quantity,Avg Cost,Market
AAPL,150,178.42,US
MSFT,80,385.20,US
NVDA,45,680.50,US
SHOP,25,62.14,CA`
