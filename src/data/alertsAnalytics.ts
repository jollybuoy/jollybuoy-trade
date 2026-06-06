import type {
  AlertOverview,
  AlertRule,
  NotificationFeedItem,
} from '@/types/alerts'

export const ALERT_SYMBOL_OPTIONS = [
  'AAPL',
  'MSFT',
  'NVDA',
  'TSLA',
  'GOOGL',
  'META',
  'AMZN',
  'AMD',
  'SPY',
  'QQQ',
]

export const ALERT_OVERVIEW: AlertOverview = {
  activeAlerts: 14,
  triggeredToday: 6,
  riskAlerts: 3,
  strategyAlerts: 5,
  marketAlerts: 4,
}

export const MOCK_ALERT_RULES: AlertRule[] = [
  {
    id: 'alert-1',
    symbol: 'NVDA',
    alertType: 'price_above',
    condition: 'Price > $900.00',
    status: 'active',
    lastTriggered: '2026-06-06T09:15:00Z',
    notificationMethod: 'in_app',
  },
  {
    id: 'alert-2',
    symbol: 'AAPL',
    alertType: 'price_below',
    condition: 'Price < $190.00',
    status: 'active',
    lastTriggered: null,
    notificationMethod: 'email',
  },
  {
    id: 'alert-3',
    symbol: 'AMD',
    alertType: 'rsi_level',
    condition: 'RSI < 30 (oversold)',
    status: 'triggered',
    lastTriggered: '2026-06-06T08:42:00Z',
    notificationMethod: 'whatsapp',
  },
  {
    id: 'alert-4',
    symbol: 'TSLA',
    alertType: 'volume_spike',
    condition: 'Volume > 2× 20-day avg',
    status: 'active',
    lastTriggered: '2026-06-05T14:30:00Z',
    notificationMethod: 'in_app',
  },
  {
    id: 'alert-5',
    symbol: 'SMCI',
    alertType: 'ai_signal',
    condition: 'AI Score ≥ 85 (Buy signal)',
    status: 'active',
    lastTriggered: '2026-06-05T11:08:00Z',
    notificationMethod: 'email',
  },
  {
    id: 'alert-6',
    symbol: 'META',
    alertType: 'earnings_event',
    condition: 'Earnings date within 3 days',
    status: 'paused',
    lastTriggered: null,
    notificationMethod: 'email',
  },
  {
    id: 'alert-7',
    symbol: '—',
    alertType: 'strategy_trigger',
    condition: 'Breakout Strategy: 3 consecutive losses',
    status: 'active',
    lastTriggered: '2026-06-06T07:55:00Z',
    notificationMethod: 'in_app',
  },
  {
    id: 'alert-8',
    symbol: 'SPY',
    alertType: 'price_below',
    condition: 'Price < $520.00',
    status: 'active',
    lastTriggered: null,
    notificationMethod: 'whatsapp',
  },
]

export const MOCK_NOTIFICATION_FEED: NotificationFeedItem[] = [
  {
    id: 'feed-1',
    type: 'bot_started',
    title: 'Bot Started',
    message: 'Paper bot started — monitoring AI Momentum and Mean Reversion strategies.',
    timestamp: '2026-06-06T09:30:00Z',
  },
  {
    id: 'feed-2',
    type: 'trade_executed',
    title: 'Trade Executed',
    message: 'Paper buy filled: 25 NVDA @ $892.14 via AI Momentum strategy.',
    timestamp: '2026-06-06T09:32:00Z',
  },
  {
    id: 'feed-3',
    type: 'stop_loss',
    title: 'Stop Loss Triggered',
    message: 'AMD position closed at −2.1% — Mean Reversion stop loss rule activated.',
    timestamp: '2026-06-06T08:45:00Z',
  },
  {
    id: 'feed-4',
    type: 'risk_limit',
    title: 'Risk Limit Reached',
    message: 'Daily loss at 48% of configured cap ($1,200 / $2,500). Review Risk Controls.',
    timestamp: '2026-06-06T08:12:00Z',
  },
  {
    id: 'feed-5',
    type: 'strategy_paused',
    title: 'Strategy Paused',
    message: 'Breakout Strategy auto-paused after 3 consecutive paper losses.',
    timestamp: '2026-06-06T07:55:00Z',
  },
  {
    id: 'feed-6',
    type: 'trade_executed',
    title: 'Trade Executed',
    message: 'Paper sell filled: 50 AAPL @ $195.87 — take-profit target reached.',
    timestamp: '2026-06-05T14:18:00Z',
  },
  {
    id: 'feed-7',
    type: 'bot_started',
    title: 'Bot Started',
    message: 'Morning session scan complete — 4 new watchlist alerts armed.',
    timestamp: '2026-06-05T09:30:00Z',
  },
]

export function buildConditionLabel(
  alertType: AlertRule['alertType'],
  threshold: string,
  symbol: string,
): string {
  switch (alertType) {
    case 'price_above':
      return `Price > $${threshold}`
    case 'price_below':
      return `Price < $${threshold}`
    case 'rsi_level':
      return `RSI ${Number(threshold) <= 50 ? '<' : '>'} ${threshold}`
    case 'volume_spike':
      return `Volume > ${threshold}× 20-day avg`
    case 'ai_signal':
      return `AI Score ≥ ${threshold} (Buy signal)`
    case 'earnings_event':
      return `Earnings date within ${threshold} days`
    case 'strategy_trigger':
      return `${symbol === '—' ? 'Strategy' : symbol}: ${threshold}`
    default:
      return threshold
  }
}
