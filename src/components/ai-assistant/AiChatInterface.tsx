import { useEffect, useRef, useState } from 'react'
import { Bot, Send, User } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { EXAMPLE_PROMPTS, getMockChatResponse } from '@/data/aiAssistantAnalytics'
import type { ChatMessage } from '@/types/aiAssistant'
import { cn } from '@/lib/utils'

interface AiChatInterfaceProps {
  messages: ChatMessage[]
  onMessagesChange: (messages: ChatMessage[]) => void
}

export function AiChatInterface({ messages, onMessagesChange }: AiChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    }

    const updatedWithUser = [...messages, userMessage]

    onMessagesChange(updatedWithUser)
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: getMockChatResponse(trimmed),
        timestamp: new Date().toISOString(),
      }
      onMessagesChange([...updatedWithUser, assistantMessage])
      setIsTyping(false)
    }, 900)
  }

  return (
    <TerminalCard glow="ai" className="flex h-full min-h-[520px] flex-col">
      <TerminalCardHeader
        title="AI Trading Assistant"
        description="Ask about simulated trades, strategies, and risk metrics"
        badge={
          <span className="rounded-md border border-ai/20 bg-ai/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-ai">
            Mock responses
          </span>
        }
      />

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-border-subtle bg-surface/30 p-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
            <Bot className="h-10 w-10 text-ai/60" />
            <p className="mt-3 text-sm font-medium text-text-primary">
              How can I help with your paper account?
            </p>
            <p className="mt-1 max-w-sm text-xs text-text-muted">
              Responses are simulated. Not financial advice.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ai/15 text-ai">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-lg border border-ai/20 bg-ai/5 px-3 py-2">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ai [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ai [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ai" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            disabled={isTyping}
            className="rounded-full border border-border-subtle bg-surface/40 px-2.5 py-1 text-[10px] text-text-secondary transition-colors hover:border-ai/30 hover:bg-ai/5 hover:text-ai disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(input)
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a trading question…"
          disabled={isTyping}
          className="flex-1 rounded-lg border border-border-subtle bg-surface/60 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="inline-flex items-center justify-center rounded-lg bg-ai px-4 py-2.5 text-on-accent transition-colors hover:bg-ai/90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </TerminalCard>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex items-start gap-2', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          isUser ? 'bg-surface-elevated text-text-secondary' : 'bg-ai/15 text-ai',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          'max-w-[85%] rounded-lg border px-3 py-2.5',
          isUser
            ? 'border-border-subtle bg-surface-elevated/80'
            : 'border-ai/20 bg-ai/5',
        )}
      >
        <p className="text-sm leading-relaxed text-text-primary">{message.content}</p>
        <p className="mt-1 text-[10px] text-text-muted">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}
