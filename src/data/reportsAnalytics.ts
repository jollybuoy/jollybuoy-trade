import { MEGA_CAP_7_SYMBOLS } from '@/data/megaCap7'
import { REPORT_TYPE_LABELS, type RecentReport, type ReportType } from '@/types/reports'

export const REPORT_TYPE_CARDS: {
  id: ReportType
  title: string
  description: string
  lastGenerated: string
}[] = [
  {
    id: 'daily_trading',
    title: 'Daily Trading Report',
    description: 'P/L, fills, and order summary for the session.',
    lastGenerated: '2026-06-06T16:00:00Z',
  },
  {
    id: 'weekly_performance',
    title: 'Weekly Performance Report',
    description: 'Win rate, drawdown, and benchmark comparison.',
    lastGenerated: '2026-06-02T18:00:00Z',
  },
  {
    id: 'monthly_portfolio',
    title: 'Monthly Portfolio Report',
    description: 'Holdings, allocation, and return attribution.',
    lastGenerated: '2026-06-01T09:00:00Z',
  },
  {
    id: 'strategy_performance',
    title: 'Strategy Performance Report',
    description: 'Per-strategy P/L, trade count, and efficiency metrics.',
    lastGenerated: '2026-06-05T12:00:00Z',
  },
  {
    id: 'risk',
    title: 'Risk Report',
    description: 'Exposure, loss limits, and drawdown analysis.',
    lastGenerated: '2026-06-06T08:00:00Z',
  },
  {
    id: 'tax_ready',
    title: 'Tax-Ready Trade Report',
    description: 'Cost basis, proceeds, and wash-sale flags (mock).',
    lastGenerated: '2026-05-31T17:00:00Z',
  },
]

export const STRATEGY_FILTER_OPTIONS = [
  { value: 'all', label: 'All Strategies' },
  { value: 'ai_momentum', label: 'AI Momentum' },
  { value: 'mean_reversion', label: 'Mean Reversion' },
  { value: 'breakout', label: 'Breakout' },
  { value: 'dividend_capture', label: 'Dividend Capture' },
]

export const SYMBOL_FILTER_OPTIONS = ['all', ...MEGA_CAP_7_SYMBOLS]

export const MOCK_RECENT_REPORTS: RecentReport[] = [
  {
    id: 'rpt-1',
    name: 'Daily Trading — Jun 6, 2026',
    generatedAt: '2026-06-06T16:05:00Z',
    type: 'daily_trading',
    status: 'ready',
  },
  {
    id: 'rpt-2',
    name: 'Risk Report — Week 23',
    generatedAt: '2026-06-06T08:12:00Z',
    type: 'risk',
    status: 'ready',
  },
  {
    id: 'rpt-3',
    name: 'Strategy Performance — May 2026',
    generatedAt: '2026-06-05T12:30:00Z',
    type: 'strategy_performance',
    status: 'ready',
  },
  {
    id: 'rpt-4',
    name: 'Weekly Performance — May 26 – Jun 1',
    generatedAt: '2026-06-02T18:00:00Z',
    type: 'weekly_performance',
    status: 'ready',
  },
  {
    id: 'rpt-5',
    name: 'Tax-Ready Trades — Q2 YTD',
    generatedAt: '2026-05-31T17:45:00Z',
    type: 'tax_ready',
    status: 'ready',
  },
  {
    id: 'rpt-6',
    name: 'Monthly Portfolio — May 2026',
    generatedAt: '2026-06-01T09:15:00Z',
    type: 'monthly_portfolio',
    status: 'ready',
  },
]

export function buildReportName(type: ReportType, startDate: string, endDate: string): string {
  const label = REPORT_TYPE_LABELS[type]
  return `${label} — ${startDate} to ${endDate}`
}
