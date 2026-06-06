import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  Radar,
  Zap,
} from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { AlertOverview } from '@/types/alerts'
import { cn } from '@/lib/utils'

interface AlertOverviewCardsProps {
  overview: AlertOverview
}

const cardConfig = [
  { key: 'activeAlerts' as const, label: 'Active Alerts', icon: Bell, tone: 'ai' },
  { key: 'triggeredToday' as const, label: 'Triggered Today', icon: Zap, tone: 'accent' },
  { key: 'riskAlerts' as const, label: 'Risk Alerts', icon: AlertTriangle, tone: 'warning' },
  { key: 'strategyAlerts' as const, label: 'Strategy Alerts', icon: BrainCircuit, tone: 'ai' },
  { key: 'marketAlerts' as const, label: 'Market Alerts', icon: Radar, tone: 'neutral' },
]

const toneStyles = {
  ai: { box: 'border-ai/20 bg-ai/5', value: 'text-ai', icon: 'text-ai' },
  accent: { box: 'border-accent/20 bg-accent/5', value: 'text-accent', icon: 'text-accent' },
  warning: { box: 'border-warning/20 bg-warning/5', value: 'text-warning', icon: 'text-warning' },
  neutral: { box: 'border-border-subtle bg-surface/40', value: 'text-text-primary', icon: 'text-text-muted' },
}

export function AlertOverviewCards({ overview }: AlertOverviewCardsProps) {
  return (
    <TerminalCard padding="sm">
      <TerminalCardHeader
        title="Alert Overview"
        description="Simulated alert counts across your paper account"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cardConfig.map(({ key, label, icon: Icon, tone }) => {
          const style = toneStyles[tone as keyof typeof toneStyles]
          return (
            <div key={key} className={cn('rounded-lg border p-4', style.box)}>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  {label}
                </p>
                <Icon className={cn('h-4 w-4', style.icon)} />
              </div>
              <p className={cn('mt-2 font-mono text-2xl font-bold', style.value)}>
                {overview[key]}
              </p>
            </div>
          )
        })}
      </div>
    </TerminalCard>
  )
}
