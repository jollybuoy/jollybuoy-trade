import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  BrainCircuit,
  Calendar,
} from 'lucide-react'
import { TerminalCard } from '@/components/terminal/TerminalCard'
import type { MarketOverviewCard } from '@/types/scanner'

const iconMap = {
  gainers: TrendingUp,
  losers: TrendingDown,
  'unusual-volume': BarChart3,
  'high-momentum': Zap,
  'ai-buy': BrainCircuit,
  earnings: Calendar,
}

const colorMap = {
  gainers: 'text-accent bg-accent/10',
  losers: 'text-danger bg-danger/10',
  'unusual-volume': 'text-info bg-info/10',
  'high-momentum': 'text-warning bg-warning/10',
  'ai-buy': 'text-ai bg-ai/10',
  earnings: 'text-text-secondary bg-surface-hover',
}

interface MarketOverviewCardsProps {
  cards: MarketOverviewCard[]
}

export function MarketOverviewCards({ cards }: MarketOverviewCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = iconMap[card.id as keyof typeof iconMap] ?? BarChart3
        const colors = colorMap[card.id as keyof typeof colorMap] ?? 'text-ai bg-ai/10'

        return (
          <TerminalCard
            key={card.id}
            padding="sm"
            className="group transition-all hover:border-ai/20"
          >
            <div className={`inline-flex rounded-lg p-2 ${colors}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {card.title}
            </p>
            <p className="mt-0.5 font-mono text-xl font-bold text-text-primary">{card.count}</p>
            <p className="mt-1 font-mono text-xs font-medium text-ai">{card.highlight}</p>
            <p className="mt-0.5 text-[10px] text-text-muted">{card.subtext}</p>
          </TerminalCard>
        )
      })}
    </div>
  )
}
