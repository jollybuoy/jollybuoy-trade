import type { AiActionSuggestion, AiInsightCard, ExplainedTrade } from '@/types/aiAssistant'

export const EXAMPLE_PROMPTS = [
  'Why did the bot buy NVDA?',
  'Which strategy performed best this week?',
  'What is my portfolio risk today?',
  'Should I pause a losing strategy?',
]

export const AI_INSIGHT_CARDS: AiInsightCard[] = [
  {
    id: 'portfolio-risk',
    title: 'Portfolio Risk Summary',
    value: 'Moderate',
    detail: 'Simulated exposure at 62% of max position limit. Tech sector concentration at 48%.',
    tone: 'warning',
  },
  {
    id: 'best-strategy',
    title: 'Best Performing Strategy',
    value: 'AI Momentum',
    detail: '+$1,842 paper P/L this week · 72% win rate across 18 simulated trades.',
    tone: 'positive',
  },
  {
    id: 'worst-strategy',
    title: 'Worst Performing Strategy',
    value: 'Breakout Strategy',
    detail: '−$420 paper P/L this week · 40% win rate · 3 consecutive losses logged.',
    tone: 'negative',
  },
  {
    id: 'market-mood',
    title: 'Market Mood',
    value: 'Risk-On',
    detail: 'Simulated breadth: 64% of watchlist symbols above 20-day MA. VIX proxy at 13.4.',
    tone: 'ai',
  },
  {
    id: 'risk-warning',
    title: "Today's Risk Warning",
    value: 'Elevated',
    detail: 'Daily loss at 48% of configured cap. NVDA position exceeds 12% portfolio weight in simulation.',
    tone: 'warning',
  },
]

export const EXPLAINED_TRADES: ExplainedTrade[] = [
  {
    id: 'ex-1',
    symbol: 'NVDA',
    date: '2026-06-06T09:32:00Z',
    side: 'buy',
    entryReason: 'Volume spike 2.4× average with RSI crossing 55 — matched AI Momentum breakout rules.',
    exitReason: 'Open — trailing stop at −3.2% from entry in paper mode.',
    riskScore: 62,
    strategy: 'AI Momentum',
  },
  {
    id: 'ex-2',
    symbol: 'AAPL',
    date: '2026-06-05T14:18:00Z',
    side: 'sell',
    entryReason: 'Prior buy on golden cross (SMA 20/50) with AI confidence score 84.',
    exitReason: 'Take-profit target +3.5% reached at $195.87 simulated fill.',
    riskScore: 38,
    strategy: 'AI Momentum',
  },
  {
    id: 'ex-3',
    symbol: 'AMZN',
    date: '2026-06-05T10:45:00Z',
    side: 'buy',
    entryReason: 'Mean Reversion signal — RSI dipped below 32 with price at lower Bollinger band.',
    exitReason: 'Stop loss triggered at −2.1% after earnings-week volatility spike.',
    riskScore: 71,
    strategy: 'Mean Reversion',
  },
  {
    id: 'ex-4',
    symbol: 'TSLA',
    date: '2026-06-04T15:22:00Z',
    side: 'sell',
    entryReason: 'Breakout entry on 20-day high with relative volume 1.8×.',
    exitReason: 'Time-based exit at session close — momentum faded below VWAP.',
    riskScore: 55,
    strategy: 'Breakout Strategy',
  },
  {
    id: 'ex-5',
    symbol: 'MSFT',
    date: '2026-06-04T11:08:00Z',
    side: 'buy',
    entryReason: 'Dividend Capture window — ex-date proximity with stable beta profile.',
    exitReason: 'Scheduled exit post ex-date capture window (simulated hold period complete).',
    riskScore: 29,
    strategy: 'Dividend Capture',
  },
]

export const AI_ACTION_SUGGESTIONS: AiActionSuggestion[] = [
  {
    id: 'act-1',
    label: 'Pause Strategy',
    description: 'Breakout Strategy logged 3 consecutive paper losses — pausing stops new entries.',
    priority: 'high',
    actionType: 'pause_strategy',
  },
  {
    id: 'act-2',
    label: 'Reduce Position Size',
    description: 'NVDA simulated weight at 12.4% — above your 10% single-name guideline.',
    priority: 'high',
    actionType: 'reduce_size',
  },
  {
    id: 'act-3',
    label: 'Add Stop Loss',
    description: 'AMZN Mean Reversion entry lacks a trailing stop in current paper config.',
    priority: 'medium',
    actionType: 'add_stop_loss',
  },
  {
    id: 'act-4',
    label: 'Review High-Risk Trades',
    description: '2 open positions with risk scores above 65 — review in Trade History.',
    priority: 'medium',
    actionType: 'review_trades',
  },
]

const DISCLAIMER =
  'This is simulated terminal output for demonstration only. Not financial advice.'

export const MOCK_CHAT_RESPONSES: Record<string, string> = {
  nvda:
    'The AI Momentum strategy logged a paper buy on NVDA at 09:32 ET when volume exceeded 2× the 20-day average and RSI crossed above 55. This matched your configured breakout rules in simulation mode. ' +
    DISCLAIMER,
  best_strategy:
    'Based on simulated paper results this week, AI Momentum leads with +$1,842 P/L and a 72% win rate across 18 trades. Mean Reversion ranks second at +$640. These figures reflect mock data only. ' +
    DISCLAIMER,
  portfolio_risk:
    'Your simulated portfolio risk today is Moderate: 62% of max position exposure used, tech sector at 48% concentration, and daily loss at 48% of your configured cap. Review Risk Controls in Settings for limit details. ' +
    DISCLAIMER,
  pause_strategy:
    'The Breakout Strategy shows −$420 paper P/L over the last 5 sessions with a 40% win rate and 3 consecutive losses. Pausing would halt new entries while leaving open positions unchanged in simulation. This is informational only — you decide whether to adjust automation. ' +
    DISCLAIMER,
  default:
    'I can help explain simulated trades, strategy performance, and risk metrics from your paper account. Try one of the example prompts, or ask about a specific symbol or strategy. ' +
    DISCLAIMER,
}

export function getMockChatResponse(input: string): string {
  const q = input.toLowerCase()

  if (q.includes('nvda') && (q.includes('buy') || q.includes('bot') || q.includes('why'))) {
    return MOCK_CHAT_RESPONSES.nvda
  }
  if (q.includes('best') && q.includes('strategy')) {
    return MOCK_CHAT_RESPONSES.best_strategy
  }
  if (q.includes('portfolio') && q.includes('risk')) {
    return MOCK_CHAT_RESPONSES.portfolio_risk
  }
  if (q.includes('pause') && q.includes('strategy')) {
    return MOCK_CHAT_RESPONSES.pause_strategy
  }
  if (q.includes('losing') && q.includes('strategy')) {
    return MOCK_CHAT_RESPONSES.pause_strategy
  }
  if (q.includes('perform') && q.includes('week')) {
    return MOCK_CHAT_RESPONSES.best_strategy
  }

  return MOCK_CHAT_RESPONSES.default
}
