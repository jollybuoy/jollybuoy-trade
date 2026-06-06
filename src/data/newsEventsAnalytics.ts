import type {
  CalendarEvent,
  MarketCalendarSummary,
  NewsAiSummary,
  NewsItem,
} from '@/types/newsEvents'

export const MARKET_CALENDAR_SUMMARY: MarketCalendarSummary = {
  earningsToday: 8,
  iposThisWeek: 3,
  fedEvents: 2,
  cpiInflation: 1,
  jobsReport: 1,
  stockSplits: 2,
  dividendDates: 5,
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'NVDA Q1 Earnings',
    eventType: 'earnings',
    date: '2026-06-06',
    time: '16:00 ET',
    impact: 'high',
    tickers: ['NVDA'],
    description: 'After-market report — AI revenue segment in focus.',
  },
  {
    id: 'evt-2',
    title: 'AAPL Q2 Earnings',
    eventType: 'earnings',
    date: '2026-06-06',
    time: '16:30 ET',
    impact: 'high',
    tickers: ['AAPL'],
  },
  {
    id: 'evt-3',
    title: 'CPI Release (May)',
    eventType: 'cpi',
    date: '2026-06-06',
    time: '08:30 ET',
    impact: 'high',
    tickers: ['SPY', 'QQQ', 'TLT'],
    description: 'Headline CPI and core CPI — rate path implications.',
  },
  {
    id: 'evt-4',
    title: 'Fed Speaker: Powell Remarks',
    eventType: 'fed',
    date: '2026-06-06',
    time: '14:00 ET',
    impact: 'medium',
    tickers: ['SPY', 'DXY'],
  },
  {
    id: 'evt-5',
    title: 'Stripe IPO Filing',
    eventType: 'ipo',
    date: '2026-06-09',
    time: '09:00 ET',
    impact: 'medium',
    tickers: ['STRIPE'],
    description: 'Expected pricing range announcement.',
  },
  {
    id: 'evt-6',
    title: 'Non-Farm Payrolls',
    eventType: 'jobs',
    date: '2026-06-07',
    time: '08:30 ET',
    impact: 'high',
    tickers: ['SPY', 'IWM'],
  },
  {
    id: 'evt-7',
    title: 'GOOGL 20-for-1 Split',
    eventType: 'split',
    date: '2026-06-08',
    impact: 'low',
    tickers: ['GOOGL'],
  },
  {
    id: 'evt-8',
    title: 'JPM Ex-Dividend Date',
    eventType: 'dividend',
    date: '2026-06-08',
    impact: 'low',
    tickers: ['JPM'],
  },
  {
    id: 'evt-9',
    title: 'META Q1 Earnings',
    eventType: 'earnings',
    date: '2026-06-09',
    time: '16:05 ET',
    impact: 'high',
    tickers: ['META'],
  },
  {
    id: 'evt-10',
    title: 'FOMC Minutes Release',
    eventType: 'fed',
    date: '2026-06-10',
    time: '14:00 ET',
    impact: 'medium',
    tickers: ['SPY', 'TLT'],
  },
  {
    id: 'evt-11',
    title: 'ARM IPO Anniversary Lockup Expiry',
    eventType: 'ipo',
    date: '2026-06-10',
    impact: 'medium',
    tickers: ['ARM'],
  },
  {
    id: 'evt-12',
    title: 'KO Ex-Dividend Date',
    eventType: 'dividend',
    date: '2026-06-11',
    impact: 'low',
    tickers: ['KO', 'PEP'],
  },
]

export const NEWS_FEED: NewsItem[] = [
  {
    id: 'news-1',
    category: 'market',
    headline: 'S&P 500 futures flat ahead of CPI print',
    summary: 'Index futures little changed as traders await May inflation data at 8:30 ET.',
    source: 'Mock Wire',
    timestamp: '2026-06-06T07:15:00Z',
    tickers: ['SPY', 'QQQ'],
    aiImpactScore: 72,
  },
  {
    id: 'news-2',
    category: 'company',
    headline: 'NVDA supply chain partners raise Q2 guidance',
    summary: 'Two semiconductor equipment names cited strong AI datacenter demand in filings.',
    source: 'Mock Terminal',
    timestamp: '2026-06-06T06:42:00Z',
    tickers: ['NVDA', 'AVGO', 'TSM'],
    aiImpactScore: 85,
  },
  {
    id: 'news-3',
    category: 'analyst',
    headline: 'MSFT upgraded to Overweight at Mock Securities',
    summary: 'Price target raised to $450 citing Azure AI monetization trajectory.',
    source: 'Mock Research',
    timestamp: '2026-06-06T05:30:00Z',
    tickers: ['MSFT'],
    aiImpactScore: 68,
  },
  {
    id: 'news-4',
    category: 'analyst',
    headline: 'TSLA downgraded to Neutral at Mock Capital',
    summary: 'Analyst cites margin pressure and delivery estimate cuts for Q2.',
    source: 'Mock Research',
    timestamp: '2026-06-05T18:20:00Z',
    tickers: ['TSLA'],
    aiImpactScore: 61,
  },
  {
    id: 'news-5',
    category: 'sec_filing',
    headline: 'AAPL 8-K: Board authorizes additional $90B buyback',
    summary: 'Form 8-K filed after market close — capital return program expanded.',
    source: 'SEC (mock)',
    timestamp: '2026-06-05T16:05:00Z',
    tickers: ['AAPL'],
    aiImpactScore: 78,
  },
  {
    id: 'news-6',
    category: 'market',
    headline: 'VIX proxy drops 4.8% as risk appetite improves',
    summary: 'Volatility gauge at 13.4 — lowest level in two weeks per simulated data.',
    source: 'Mock Wire',
    timestamp: '2026-06-05T15:00:00Z',
    tickers: ['VIX', 'SPY'],
    aiImpactScore: 55,
  },
  {
    id: 'news-7',
    category: 'company',
    headline: 'AMD wins hyperscaler CPU allocation — unconfirmed',
    summary: 'Industry blog reports expanded EPYC share at major cloud provider.',
    source: 'Mock Terminal',
    timestamp: '2026-06-05T12:30:00Z',
    tickers: ['AMD', 'INTC'],
    aiImpactScore: 74,
  },
  {
    id: 'news-8',
    category: 'sec_filing',
    headline: 'COIN 10-Q: Trading volume up 22% QoQ',
    summary: 'Quarterly filing highlights retail crypto activity rebound in mock dataset.',
    source: 'SEC (mock)',
    timestamp: '2026-06-05T09:00:00Z',
    tickers: ['COIN'],
    aiImpactScore: 66,
  },
]

export const NEWS_AI_SUMMARY: NewsAiSummary = {
  biggestRisk:
    'May CPI release at 08:30 ET is the highest-impact event today — simulated portfolio beta suggests ±1.2% SPY move on a surprise.',
  positionImpact: [
    'NVDA — earnings after close; open paper position may see elevated implied volatility.',
    'AAPL — ex-buyback 8-K supports sentiment; earnings same session adds event risk.',
    'AMD — hyperscaler headline unconfirmed; Mean Reversion strategy may whipsaw.',
  ],
  stocksToWatch: ['NVDA', 'AAPL', 'SPY', 'META', 'ARM'],
}

export const WEEK_DAYS = ['Mon 6', 'Tue 7', 'Wed 8', 'Thu 9', 'Fri 10']

export function getEventsForDate(events: CalendarEvent[], date: string): CalendarEvent[] {
  return events.filter((e) => e.date === date)
}

export function getWeekDateKeys(): string[] {
  return ['2026-06-06', '2026-06-07', '2026-06-08', '2026-06-09', '2026-06-10']
}
