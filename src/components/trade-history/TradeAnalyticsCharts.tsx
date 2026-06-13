import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type { DailyPnLPoint, StrategyPerformance } from '@/types/tradeHistory'
import { chartStyles } from '@/lib/chartStyles'
import { formatCurrency, cn } from '@/lib/utils'

interface TradeAnalyticsChartsProps {
  dailyPnL: DailyPnLPoint[]
  winningTrades: number
  losingTrades: number
  strategyPerformance: StrategyPerformance[]
}

export function TradeAnalyticsCharts({
  dailyPnL,
  winningTrades,
  losingTrades,
  strategyPerformance,
}: TradeAnalyticsChartsProps) {
  const winLossData = [
    { name: 'Wins', value: winningTrades, color: '#22d3a5' },
    { name: 'Losses', value: losingTrades, color: '#ff5c5c' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <TerminalCard className="lg:col-span-2">
        <TerminalCardHeader title="Daily P/L" description="Realized profit and loss by day" />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dailyPnL} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid.stroke} vertical={false} />
            <XAxis
              dataKey="date"
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v}`}
              width={48}
            />
            <Tooltip
              {...chartStyles.tooltip}
              formatter={(value) => [formatCurrency(Number(value)), 'P/L']}
            />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {dailyPnL.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.pnl >= 0 ? '#22d3a5' : '#ff5c5c'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </TerminalCard>

      <TerminalCard>
        <TerminalCardHeader title="Win/Loss Distribution" />
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={winLossData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {winLossData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip {...chartStyles.tooltip} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      </TerminalCard>

      <TerminalCard className="lg:col-span-3">
        <TerminalCardHeader
          title="Strategy Performance"
          description="Realized P/L by strategy"
        />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={strategyPerformance}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid.stroke} horizontal={false} />
            <XAxis
              type="number"
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v}`}
            />
            <YAxis
              type="category"
              dataKey="strategy"
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <Tooltip
              {...chartStyles.tooltip}
              formatter={(value, _name, item) => {
                const payload = item.payload as StrategyPerformance
                return [
                  `${formatCurrency(Number(value))} (${payload.trades} trades)`,
                  'P/L',
                ]
              }}
            />
            <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
              {strategyPerformance.map((entry) => (
                <Cell
                  key={entry.strategy}
                  fill={entry.pnl >= 0 ? '#22d3a5' : '#ff5c5c'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-3 flex flex-wrap gap-3">
          {strategyPerformance.map((s) => (
            <div
              key={s.strategy}
              className="rounded-lg border border-border-subtle bg-surface/40 px-3 py-2"
            >
              <p className="text-[10px] text-text-muted">{s.strategy}</p>
              <p
                className={cn(
                  'font-mono text-sm font-bold',
                  s.pnl >= 0 ? 'text-accent' : 'text-danger',
                )}
              >
                {formatCurrency(s.pnl)}
              </p>
              <p className="text-[10px] text-text-muted">{s.trades} trades</p>
            </div>
          ))}
        </div>
      </TerminalCard>
    </div>
  )
}
