import { FileText, Globe, Newspaper, TrendingUp } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { NEWS_CATEGORY_LABELS, type NewsCategory, type NewsItem } from '@/types/newsEvents'
import { cn, formatDateTime } from '@/lib/utils'

interface NewsFeedProps {
  items: NewsItem[]
}

const categoryIcons: Record<NewsCategory, typeof Newspaper> = {
  market: Globe,
  company: Newspaper,
  analyst: TrendingUp,
  sec_filing: FileText,
}

const categoryStyles: Record<NewsCategory, string> = {
  market: 'bg-ai/10 text-ai border-ai/20',
  company: 'bg-accent/10 text-accent border-accent/20',
  analyst: 'bg-warning/10 text-warning border-warning/20',
  sec_filing: 'bg-surface-elevated text-text-secondary border-border-subtle',
}

export function NewsFeed({ items }: NewsFeedProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="News Feed"
          description="Market, company, analyst, and SEC filing headlines (mock)"
        />
      </div>

      <div className="divide-y divide-border-subtle/60">
        {items.map((item) => (
          <NewsRow key={item.id} item={item} />
        ))}
      </div>
    </TerminalCard>
  )
}

function NewsRow({ item }: { item: NewsItem }) {
  const Icon = categoryIcons[item.category]

  return (
    <article className="p-5 transition-colors hover:bg-ai/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-3">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
              categoryStyles[item.category],
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                  categoryStyles[item.category],
                )}
              >
                {NEWS_CATEGORY_LABELS[item.category]}
              </span>
              <span className="text-[10px] text-text-muted">{item.source}</span>
            </div>
            <h3 className="mt-1 text-sm font-semibold text-text-primary">{item.headline}</h3>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">{item.summary}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tickers.map((t) => (
                <span
                  key={t}
                  className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ai"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <AiImpactScore score={item.aiImpactScore} />
          <span className="font-mono text-[10px] text-text-muted">
            {formatDateTime(item.timestamp)}
          </span>
        </div>
      </div>
    </article>
  )
}

function AiImpactScore({ score }: { score: number }) {
  const stroke = score >= 80 ? '#ff5c5c' : score >= 65 ? '#f5a623' : '#22d3a5'

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-10 w-10 items-center justify-center">
        <svg className="absolute inset-0 h-10 w-10 -rotate-90">
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="var(--color-chart-grid)"
            strokeWidth="2.5"
          />
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke={stroke}
            strokeWidth="2.5"
            strokeDasharray={`${(score / 100) * 94} 94`}
            strokeLinecap="round"
          />
        </svg>
        <span className="font-mono text-[10px] font-bold">{score}</span>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          AI Impact
        </p>
        <p className="text-[10px] text-text-secondary">Score</p>
      </div>
    </div>
  )
}
