import { useState } from 'react'
import { Newspaper } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MarketCalendarCards } from '@/components/news-events/MarketCalendarCards'
import { EventsCalendarView } from '@/components/news-events/EventsCalendarView'
import { NewsFeed } from '@/components/news-events/NewsFeed'
import { NewsAiSummaryPanel } from '@/components/news-events/NewsAiSummary'
import {
  CALENDAR_EVENTS,
  MARKET_CALENDAR_SUMMARY,
  NEWS_AI_SUMMARY,
  NEWS_FEED,
} from '@/data/newsEventsAnalytics'
import type { CalendarViewMode } from '@/types/newsEvents'

export function NewsEventsPage() {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('daily')

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="News & Events Calendar"
        description="Macro calendar, earnings, and simulated news intelligence"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-ai/20 bg-ai/5 px-3 py-1.5">
            <Newspaper className="h-4 w-4 text-ai" />
            <span className="text-xs font-medium text-ai">Mock data · No live feeds</span>
          </div>
        }
      />

      <MarketCalendarCards summary={MARKET_CALENDAR_SUMMARY} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <EventsCalendarView
            events={CALENDAR_EVENTS}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <NewsFeed items={NEWS_FEED} />
        </div>
        <NewsAiSummaryPanel summary={NEWS_AI_SUMMARY} />
      </div>

      <p className="text-center text-[11px] text-text-muted">
        Calendar and news content is simulated for demonstration. Not connected to live data
        providers. Not financial advice.
      </p>
    </div>
  )
}
