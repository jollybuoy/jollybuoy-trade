import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { TerminalCard, TerminalCardHeader } from './TerminalCard'
import type { Position } from '@/types'
import {
  formatCurrency,
  formatPercent,
  getChangeColor,
  getPositionPnL,
  getPositionValue,
  cn,
} from '@/lib/utils'

interface OpenPositionsTableProps {
  positions: Position[]
  title?: string
  description?: string
  compact?: boolean
}

export function OpenPositionsTable({
  positions,
  title = 'Open Positions',
  description = 'Live holdings with P&L',
  compact = false,
}: OpenPositionsTableProps) {
  return (
    <TerminalCard padding="none">
      <div className="border-b border-border-subtle p-5">
        <TerminalCardHeader title={title} description={description} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {['Symbol', 'Qty', 'Avg Cost', 'Last', 'Value', 'P&L', 'Trend'].map((h) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted',
                    h !== 'Symbol' && h !== 'Trend' && 'text-right',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => {
              const { pnl, pnlPercent } = getPositionPnL(p)
              const positive = pnl >= 0

              return (
                <tr
                  key={p.symbol}
                  className="group border-b border-border-subtle/40 transition-colors hover:bg-ai/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-hover text-xs font-bold text-ai">
                        {p.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{p.symbol}</p>
                        {!compact && (
                          <p className="text-[11px] text-text-muted">{p.sector}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{p.shares}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-text-secondary">
                    {formatCurrency(p.avgCost)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {formatCurrency(p.currentPrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-medium">
                    {formatCurrency(getPositionValue(p))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className={cn('font-mono text-sm font-medium', getChangeColor(pnl))}>
                      {formatCurrency(pnl)}
                    </p>
                    <p className={cn('font-mono text-[11px]', getChangeColor(pnl))}>
                      {formatPercent(pnlPercent)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {p.sparkline && (
                      <MiniSparkline data={p.sparkline} positive={positive} />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </TerminalCard>
  )
}

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const chartData = data.map((v, i) => ({ i, v }))

  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={positive ? '#22d3a5' : '#ff5c5c'}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
