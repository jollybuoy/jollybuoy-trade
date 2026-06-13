export type AlertType =
  | 'price_above'
  | 'price_below'
  | 'rsi_level'
  | 'volume_spike'
  | 'ai_signal'
  | 'earnings_event'
  | 'strategy_trigger'

export type NotificationMethod = 'email' | 'whatsapp' | 'in_app'

export type AlertStatus = 'active' | 'paused' | 'triggered'

export type NotificationFeedType =
  | 'bot_started'
  | 'trade_executed'
  | 'stop_loss'
  | 'risk_limit'
  | 'strategy_paused'

export interface AlertOverview {
  activeAlerts: number
  triggeredToday: number
  riskAlerts: number
  strategyAlerts: number
  marketAlerts: number
}

export interface AlertRule {
  id: string
  symbol: string
  alertType: AlertType
  condition: string
  status: AlertStatus
  lastTriggered: string | null
  notificationMethod: NotificationMethod
}

export interface CreateAlertForm {
  symbol: string
  alertType: AlertType
  threshold: string
  notificationMethod: NotificationMethod
}

export interface NotificationFeedItem {
  id: string
  type: NotificationFeedType
  title: string
  message: string
  timestamp: string
}

export const DEFAULT_CREATE_ALERT_FORM: CreateAlertForm = {
  symbol: 'NVDA',
  alertType: 'price_above',
  threshold: '900',
  notificationMethod: 'in_app',
}

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  price_above: 'Price Above',
  price_below: 'Price Below',
  rsi_level: 'RSI Level',
  volume_spike: 'Volume Spike',
  ai_signal: 'AI Signal',
  earnings_event: 'Earnings Event',
  strategy_trigger: 'Strategy Trigger',
}

export const NOTIFICATION_METHOD_LABELS: Record<NotificationMethod, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  in_app: 'In-App',
}
