export type ReportType =
  | 'daily_trading'
  | 'weekly_performance'
  | 'monthly_portfolio'
  | 'strategy_performance'
  | 'risk'
  | 'tax_ready'

export type ReportStatus = 'ready' | 'generating' | 'failed'

export type ExportAction = 'csv' | 'pdf' | 'excel' | 'email' | 'statement'

export interface ReportBuilderForm {
  reportType: ReportType
  startDate: string
  endDate: string
  strategy: string
  symbol: string
  includeCharts: boolean
  includeTradeDetails: boolean
}

export interface RecentReport {
  id: string
  name: string
  generatedAt: string
  type: ReportType
  status: ReportStatus
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  daily_trading: 'Daily Trading',
  weekly_performance: 'Weekly Performance',
  monthly_portfolio: 'Monthly Portfolio',
  strategy_performance: 'Strategy Performance',
  risk: 'Risk Report',
  tax_ready: 'Tax-Ready Trades',
}

export const DEFAULT_REPORT_BUILDER_FORM: ReportBuilderForm = {
  reportType: 'daily_trading',
  startDate: '2026-06-01',
  endDate: '2026-06-06',
  strategy: 'all',
  symbol: 'all',
  includeCharts: true,
  includeTradeDetails: true,
}
