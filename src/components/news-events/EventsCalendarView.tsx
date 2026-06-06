import { CalendarDays, CalendarRange } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { getWeekDateKeys, WEEK_DAYS } from '@/data/newsEventsAnalytics'
import {
  EVENT_TYPE_LABELS,
  type CalendarEvent,
  type CalendarViewMode,
  type EventType,
  type ImpactLevel,
} from '@/types/newsEvents'
import { cn } from '@/lib/utils'

interface EventsCalendarViewProps {
  events: CalendarEvent[]
  viewMode: CalendarViewMode
  onViewModeChange: (mode: CalendarViewMode) => void
}

const impactStyles: Record<ImpactLevel, string> = {
  low: 'bg-surface-elevated text-text-muted border-border-subtle',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-danger/10 text-danger border-danger/20',
}

const typeStyles: Record<EventType, string> = {
  earnings: 'bg-accent/10 text-accent',
  ipo: 'bg-ai/10 text-ai',
  fed: 'bg-warning/10 text-warning',
  cpi: 'bg-danger/10 text-danger',
  jobs: 'bg-warning/10 text-warning',
  split: 'bg-surface-elevated text-text-secondary',
  dividend: 'bg-accent/10 text-accent',
}

export function EventsCalendarView({
  events,
  viewMode,
  onViewModeChange,
}: EventsCalendarViewProps) {
  const today = '2026-06-06'
  const weekDates = getWeekDateKeys()

  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader
          title="Events Calendar"
          description="Daily and weekly layout with impact levels"
          action={
            <div className="flex rounded-lg border border-border-subtle p-0.5">
              <ViewToggle
                active={viewMode === 'daily'}
                icon={CalendarDays}
                label="Daily"
                onClick={() => onViewModeChange('daily')}
              />
              <ViewToggle
                active={viewMode === 'weekly'}
                icon={CalendarRange}
                label="Weekly"
                onClick={() => onViewModeChange('weekly')}
              />
            </div>
          }
        />
      </div>

      <div className="p-5">
        {viewMode === 'daily' ? (
          <DailyView events={events.filter((e) => e.date === today)} dateLabel="Friday, Jun 6" />
        ) : (
          <WeeklyView events={events} weekDates={weekDates} weekLabels={WEEK_DAYS} />
        )}
      </div>
    </TerminalCard>
  )
}

function ViewToggle({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: typeof CalendarDays
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
        active ? 'bg-ai/10 text-ai' : 'text-text-secondary hover:text-text-primary',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

function DailyView({ events, dateLabel }: { events: CalendarEvent[]; dateLabel: string }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-text-primary">{dateLabel}</p>
      {events.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">No events scheduled.</p>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

function WeeklyView({
  events,
  weekDates,
  weekLabels,
}: {
  events: CalendarEvent[]
  weekDates: string[]
  weekLabels: string[]
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {weekDates.map((date, i) => {
        const dayEvents = events.filter((e) => e.date === date)
        return (
          <div key={date} className="rounded-lg border border-border-subtle bg-surface/30 p-3">
            <p className="mb-2 text-xs font-semibold text-text-primary">{weekLabels[i]}</p>
            <div className="space-y-2">
              {dayEvents.length === 0 ? (
                <p className="text-[10px] text-text-muted">No events</p>
              ) : (
                dayEvents.map((event) => (
                  <CompactEvent key={event.id} event={event} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EventRow({ event }: { event: CalendarEvent }) {
  return (
    <div className="flex flex-wrap items-start gap-3 rounded-lg border border-border-subtle/60 bg-surface/40 p-3 transition-colors hover:bg-ai/5">
      <div className="min-w-[60px] font-mono text-xs text-text-muted">{event.time ?? 'All day'}</div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-text-primary">{event.title}</p>
          <EventTypeBadge type={event.eventType} />
          <ImpactBadge impact={event.impact} />
        </div>
        {event.description && (
          <p className="mt-1 text-xs text-text-secondary">{event.description}</p>
        )}
        <TickerList tickers={event.tickers} />
      </div>
    </div>
  )
}

function CompactEvent({ event }: { event: CalendarEvent }) {
  return (
    <div className="rounded-md border border-border-subtle/60 bg-surface/40 p-2">
      <div className="flex flex-wrap items-center gap-1">
        <EventTypeBadge type={event.eventType} small />
        <ImpactBadge impact={event.impact} small />
      </div>
      <p className="mt-1 text-[11px] font-medium leading-snug text-text-primary">{event.title}</p>
      {event.time && (
        <p className="mt-0.5 font-mono text-[10px] text-text-muted">{event.time}</p>
      )}
      <TickerList tickers={event.tickers} small />
    </div>
  )
}

function EventTypeBadge({ type, small }: { type: EventType; small?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex rounded font-semibold uppercase',
        typeStyles[type],
        small ? 'px-1 py-0.5 text-[9px]' : 'px-1.5 py-0.5 text-[10px]',
      )}
    >
      {EVENT_TYPE_LABELS[type]}
    </span>
  )
}

function ImpactBadge({ impact, small }: { impact: ImpactLevel; small?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex rounded border font-semibold uppercase',
        impactStyles[impact],
        small ? 'px-1 py-0.5 text-[9px]' : 'px-1.5 py-0.5 text-[10px]',
      )}
    >
      {impact}
    </span>
  )
}

function TickerList({ tickers, small }: { tickers: string[]; small?: boolean }) {
  return (
    <div className={cn('flex flex-wrap gap-1', small ? 'mt-1' : 'mt-2')}>
      {tickers.map((t) => (
        <span
          key={t}
          className={cn(
            'rounded bg-ai/10 font-mono font-semibold text-ai',
            small ? 'px-1 py-0.5 text-[9px]' : 'px-1.5 py-0.5 text-[10px]',
          )}
        >
          {t}
        </span>
      ))}
    </div>
  )
}
