import { Radar, TrendingUp, Zap, Clock, Target } from 'lucide-react'
import { TerminalCard } from './TerminalCard'
import type { ScannerStats } from '@/types'
import { formatDateTime } from '@/lib/utils'

interface MarketScannerWidgetsProps {
  stats: ScannerStats
}

export function MarketScannerWidgets({ stats }: MarketScannerWidgetsProps) {
  const widgets = [
    {
      label: 'Symbols Scanned',
      value: stats.totalScanned.toLocaleString(),
      icon: Radar,
      color: 'text-ai',
      bg: 'bg-ai/10',
    },
    {
      label: 'Signals Found',
      value: String(stats.signalsFound),
      icon: Zap,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Avg AI Score',
      value: stats.avgScore.toFixed(1),
      icon: Target,
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      label: 'Top Signal',
      value: stats.topSignal,
      icon: TrendingUp,
      color: 'text-warning',
      bg: 'bg-warning/10',
      small: true,
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {widgets.map((w) => (
        <TerminalCard key={w.label} padding="sm" className="group transition-colors hover:border-ai/20">
          <div className="flex items-start justify-between">
            <div className={`rounded-lg p-2 ${w.bg}`}>
              <w.icon className={`h-4 w-4 ${w.color}`} />
            </div>
            <Clock className="h-3 w-3 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            {w.label}
          </p>
          <p
            className={`mt-0.5 font-mono font-semibold text-text-primary ${w.small ? 'text-sm' : 'text-xl'}`}
          >
            {w.value}
          </p>
        </TerminalCard>
      ))}

      <div className="col-span-full flex items-center gap-2 text-xs text-text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-live" />
        Last scan: {formatDateTime(stats.lastScan)} · AI engine v2.4
      </div>
    </div>
  )
}
