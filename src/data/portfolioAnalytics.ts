import { MEGA_CAP_7_SYMBOLS, MEGA_CAP_7_STOCKS } from '@/data/megaCap7'
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

export const PORTFOLIO_HOLDINGS: PortfolioHolding[] = MEGA_CAP_7_SYMBOLS.map((symbol, index) => ({
  id: `h-${index + 1}`,
  symbol,
  company: MEGA_CAP_7_STOCKS[symbol].company,
  quantity: [150, 80, 45, 60, 35, 25, 40][index],
  avgCost: [178.42, 385.2, 680.5, 168.3, 405, 480.2, 238.5][index],
  currentPrice: 0,
  sector: MEGA_CAP_7_STOCKS[symbol].sector,
  assetClass: 'Equity',
}))

export const SECTOR_ALLOCATION: AllocationSlice[] = [
  { name: 'Technology', value: 52.4 },
  { name: 'Communication Services', value: 24.8 },
  { name: 'Consumer Discretionary', value: 17.8 },
  { name: 'Cash', value: 5.0 },
]

export const ASSET_ALLOCATION: AllocationSlice[] = [
  { name: 'Mega Cap 7 Equities', value: 95.0 },
  { name: 'Cash', value: 5.0 },
]

export const TOP_WINNERS: MoverItem[] = [
  { symbol: 'NVDA', company: MEGA_CAP_7_STOCKS.NVDA.company, pnl: 9_518.8, pnlPercent: 31.1 },
  { symbol: 'AAPL', company: MEGA_CAP_7_STOCKS.AAPL.company, pnl: 2_617.5, pnlPercent: 9.78 },
  { symbol: 'META', company: MEGA_CAP_7_STOCKS.META.company, pnl: 1_842.0, pnlPercent: 8.12 },
]

export const TOP_LOSERS: MoverItem[] = [
  { symbol: 'TSLA', company: MEGA_CAP_7_STOCKS.TSLA.company, pnl: -420.5, pnlPercent: -1.85 },
  { symbol: 'AMZN', company: MEGA_CAP_7_STOCKS.AMZN.company, pnl: -189.0, pnlPercent: -0.92 },
  { symbol: 'GOOGL', company: MEGA_CAP_7_STOCKS.GOOGL.company, pnl: -142.5, pnlPercent: -0.68 },
]

export const RISK_EXPOSURE: RiskExposure = {
  portfolioBeta: 1.08,
  maxSinglePosition: 14.2,
  topSectorConcentration: 52.4,
  techExposure: 52.4,
  internationalExposure: 0,
}

export const CSV_PREVIEW_SAMPLE: CsvPreviewRow[] = [
  { symbol: 'AAPL', quantity: 150, avgCost: 178.42, market: 'US' },
  { symbol: 'MSFT', quantity: 80, avgCost: 385.2, market: 'US' },
  { symbol: 'NVDA', quantity: 45, avgCost: 680.5, market: 'US' },
  { symbol: 'GOOGL', quantity: 60, avgCost: 168.3, market: 'US' },
]

export const CSV_SAMPLE_CONTENT = `Symbol,Quantity,Avg Cost,Market
AAPL,150,178.42,US
MSFT,80,385.20,US
NVDA,45,680.50,US
GOOGL,60,168.30,US`
