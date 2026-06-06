export type EventType =
  | 'earnings'
  | 'ipo'
  | 'fed'
  | 'cpi'
  | 'jobs'
  | 'split'
  | 'dividend'

export type ImpactLevel = 'low' | 'medium' | 'high'

export type CalendarViewMode = 'daily' | 'weekly'

export type NewsCategory = 'market' | 'company' | 'analyst' | 'sec_filing'

export interface MarketCalendarSummary {
  earningsToday: number
  iposThisWeek: number
  fedEvents: number
  cpiInflation: number
  jobsReport: number
  stockSplits: number
  dividendDates: number
}

export interface CalendarEvent {
  id: string
  title: string
  eventType: EventType
  date: string
  time?: string
  impact: ImpactLevel
  tickers: string[]
  description?: string
}

export interface NewsItem {
  id: string
  category: NewsCategory
  headline: string
  summary: string
  source: string
  timestamp: string
  tickers: string[]
  aiImpactScore: number
}

export interface NewsAiSummary {
  biggestRisk: string
  positionImpact: string[]
  stocksToWatch: string[]
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  earnings: 'Earnings',
  ipo: 'IPO',
  fed: 'Fed',
  cpi: 'CPI',
  jobs: 'Jobs',
  split: 'Split',
  dividend: 'Dividend',
}

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  market: 'Market News',
  company: 'Company News',
  analyst: 'Analyst',
  sec_filing: 'SEC Filing',
}
