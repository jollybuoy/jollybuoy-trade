export interface PortfolioSummary {
  totalValue: number
  cashBalance: number
  investedValue: number
  unrealizedPnL: number
  unrealizedPnLPercent: number
  realizedPnL: number
  dayChangePercent: number
  dayChange: number
}

export interface PortfolioHolding {
  id: string
  symbol: string
  company: string
  quantity: number
  avgCost: number
  currentPrice: number
  sector: string
  assetClass: string
}

export interface AllocationSlice {
  name: string
  value: number
}

export interface MoverItem {
  symbol: string
  company: string
  pnl: number
  pnlPercent: number
}

export interface RiskExposure {
  portfolioBeta: number
  maxSinglePosition: number
  topSectorConcentration: number
  techExposure: number
  internationalExposure: number
}

export type CsvImportStatus = 'idle' | 'preview' | 'success' | 'error'

export interface CsvPreviewRow {
  symbol: string
  quantity: number
  avgCost: number
  market: string
}
