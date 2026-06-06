import { Shield, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from './TerminalCard'
import type { RiskControl } from '@/types'
import { formatCurrency, cn } from '@/lib/utils'

interface RiskControlPanelProps {
  risk: RiskControl
}

export function RiskControlPanel({ risk }: RiskControlPanelProps) {
  const dailyLossPct = (risk.currentDailyLoss / risk.maxDailyLoss) * 100
  const exposurePct = (risk.currentExposure / risk.maxPositionSize) * 100
  const drawdownPct = (risk.currentDrawdown / risk.maxDrawdown) * 100

  return (
    <TerminalCard>
      <TerminalCardHeader
        title="Risk Controls"
        description="Real-time exposure monitoring"
        badge={
          <span className="flex items-center gap-1 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
            <Shield className="h-3 w-3" />
            PROTECTED
          </span>
        }
      />

      <div className="space-y-4">
        <RiskGauge
          label="Daily Loss Limit"
          current={risk.currentDailyLoss}
          max={risk.maxDailyLoss}
          percent={dailyLossPct}
          format="currency"
        />
        <RiskGauge
          label="Position Exposure"
          current={risk.currentExposure}
          max={risk.maxPositionSize}
          percent={exposurePct}
          format="currency"
        />
        <RiskGauge
          label="Max Drawdown"
          current={risk.currentDrawdown}
          max={risk.maxDrawdown}
          percent={drawdownPct}
          format="percent"
        />
      </div>

      <div className="mt-4 space-y-2 border-t border-border-subtle pt-4">
        <RiskToggle label="Stop Loss" enabled={risk.stopLossEnabled} />
        <RiskToggle label="Trailing Stop" enabled={risk.trailingStopEnabled} />
      </div>

      {dailyLossPct > 60 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
          <p className="text-xs text-warning">Approaching daily loss threshold</p>
        </div>
      )}
    </TerminalCard>
  )
}

function RiskGauge({
  label,
  current,
  max,
  percent,
  format,
}: {
  label: string
  current: number
  max: number
  percent: number
  format: 'currency' | 'percent'
}) {
  const barColor =
    percent > 80 ? 'bg-danger' : percent > 50 ? 'bg-warning' : 'bg-accent'

  const displayCurrent =
    format === 'currency' ? formatCurrency(current) : `${current.toFixed(1)}%`
  const displayMax =
    format === 'currency' ? formatCurrency(max) : `${max.toFixed(0)}%`

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="font-mono text-text-primary">
          {displayCurrent}
          <span className="text-text-muted"> / {displayMax}</span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}

function RiskToggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-secondary">{label}</span>
      <div className="flex items-center gap-1.5">
        {enabled ? (
          <ToggleRight className="h-5 w-5 text-accent" />
        ) : (
          <ToggleLeft className="h-5 w-5 text-text-muted" />
        )}
        <span className={cn('text-xs font-medium', enabled ? 'text-accent' : 'text-text-muted')}>
          {enabled ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  )
}
