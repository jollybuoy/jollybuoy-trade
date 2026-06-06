import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import type {
  DrawdownPoint,
  EquityPoint,
  MonthlyReturnPoint,
  StrategyComparisonPoint,
} from '@/types/backtesting'
import { chartStyles } from '@/lib/chartStyles'
import { formatCurrency } from '@/lib/utils'

interface BacktestChartsProps {
  equityCurve: EquityPoint[]
  drawdownSeries: DrawdownPoint[]
  monthlyReturns: MonthlyReturnPoint[]
  strategyComparison: StrategyComparisonPoint[]
}

export function BacktestCharts({
  equityCurve,
  drawdownSeries,
  monthlyReturns,
  strategyComparison,
}: BacktestChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <TerminalCard>
        <TerminalCardHeader title="Equity Curve" description="Portfolio value over backtest period" />
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={equityCurve} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3a5" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22d3a5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid.stroke} vertical={false} />
            <XAxis dataKey="date" tick={chartStyles.axisTickSm} tickLine={false} axisLine={false} />
            <YAxis
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              width={44}
            />
            <Tooltip
              {...chartStyles.tooltip}
              formatter={(value) => [formatCurrency(Number(value)), 'Equity']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22d3a5"
              strokeWidth={2}
              fill="url(#equityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </TerminalCard>

      <TerminalCard>
        <TerminalCardHeader title="Drawdown" description="Peak-to-trough decline (%)" />
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={drawdownSeries} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff5c5c" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ff5c5c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid.stroke} vertical={false} />
            <XAxis dataKey="date" tick={chartStyles.axisTickSm} tickLine={false} axisLine={false} />
            <YAxis
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
              width={40}
            />
            <Tooltip
              {...chartStyles.tooltip}
              formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Drawdown']}
            />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="#ff5c5c"
              strokeWidth={2}
              fill="url(#drawdownGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </TerminalCard>

      <TerminalCard>
        <TerminalCardHeader title="Monthly Returns" description="Return % by calendar month" />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyReturns} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid.stroke} vertical={false} />
            <XAxis dataKey="month" tick={chartStyles.axisTickSm} tickLine={false} axisLine={false} />
            <YAxis
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
              width={40}
            />
            <Tooltip
              {...chartStyles.tooltip}
              formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Return']}
            />
            <Bar dataKey="returnPercent" radius={[4, 4, 0, 0]}>
              {monthlyReturns.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.returnPercent >= 0 ? '#22d3a5' : '#ff5c5c'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </TerminalCard>

      <TerminalCard>
        <TerminalCardHeader
          title="Strategy Comparison"
          description="Return % vs benchmarks over same period"
        />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={strategyComparison}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid.stroke} horizontal={false} />
            <XAxis
              type="number"
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="strategy"
              tick={chartStyles.axisTickSm}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              {...chartStyles.tooltip}
              formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Return']}
            />
            <Bar dataKey="returnPercent" radius={[0, 4, 4, 0]}>
              {strategyComparison.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.strategy === 'AI Momentum' ? '#5b9dff' : '#22d3a5'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </TerminalCard>
    </div>
  )
}
