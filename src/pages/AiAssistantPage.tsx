import { useState } from 'react'
import { Bot } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { AiChatInterface } from '@/components/ai-assistant/AiChatInterface'
import { AiInsightCards } from '@/components/ai-assistant/AiInsightCards'
import { TradeExplanationPanel } from '@/components/ai-assistant/TradeExplanationPanel'
import { AiActionSuggestions } from '@/components/ai-assistant/AiActionSuggestions'
import {
  AI_ACTION_SUGGESTIONS,
  AI_INSIGHT_CARDS,
  EXPLAINED_TRADES,
} from '@/data/aiAssistantAnalytics'
import type { AiActionSuggestion, ChatMessage } from '@/types/aiAssistant'

export function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [actionToast, setActionToast] = useState<string | null>(null)

  const handleAction = (suggestion: AiActionSuggestion) => {
    setActionToast(`${suggestion.label} queued in simulation (mock — no backend)`)
    setTimeout(() => setActionToast(null), 3000)
  }

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="AI Trading Assistant"
        description="Explain trades, review risk, and explore simulated insights"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-ai/20 bg-ai/5 px-3 py-1.5">
            <Bot className="h-4 w-4 text-ai" />
            <span className="text-xs font-medium text-ai">Mock AI · No API</span>
          </div>
        }
      />

      {actionToast && (
        <div className="rounded-lg border border-ai/20 bg-ai/5 px-4 py-2.5 text-sm text-ai">
          {actionToast}
        </div>
      )}

      <AiInsightCards cards={AI_INSIGHT_CARDS} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AiChatInterface messages={messages} onMessagesChange={setMessages} />
        </div>
        <AiActionSuggestions
          suggestions={AI_ACTION_SUGGESTIONS}
          onAction={handleAction}
        />
      </div>

      <TradeExplanationPanel trades={EXPLAINED_TRADES} />

      <p className="text-center text-[11px] text-text-muted">
        All assistant responses and suggestions use dummy data for demonstration purposes only.
        This is not financial advice.
      </p>
    </div>
  )
}
