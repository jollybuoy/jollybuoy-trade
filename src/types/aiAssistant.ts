export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AiInsightCard {
  id: string
  title: string
  value: string
  detail: string
  tone: 'neutral' | 'positive' | 'negative' | 'warning' | 'ai'
}

export interface ExplainedTrade {
  id: string
  symbol: string
  date: string
  side: 'buy' | 'sell'
  entryReason: string
  exitReason: string
  riskScore: number
  strategy: string
}

export type AiActionType =
  | 'pause_strategy'
  | 'reduce_size'
  | 'add_stop_loss'
  | 'review_trades'

export interface AiActionSuggestion {
  id: string
  label: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionType: AiActionType
}
