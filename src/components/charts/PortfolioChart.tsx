import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import type { PortfolioSnapshot } from '@/types'
import { chartStyles } from '@/lib/chartStyles'
import { formatCurrency } from '@/lib/utils'

const CHART_COLORS = ['#22d3a5', '#5b9dff', '#f5a623', '#ff5c5c', '#64748b']

interface PortfolioChartProps {
  data: PortfolioSnapshot[]
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3a5" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#22d3a5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartStyles.grid.stroke} vertical={false} />
        <XAxis
          dataKey="date"
          tick={chartStyles.axisTick}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => {
            const date = new Date(value)
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={chartStyles.axisTick}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
          domain={['auto', 'auto']}
          width={55}
        />
        <Tooltip
          {...chartStyles.tooltip}
          formatter={(value) => [formatCurrency(Number(value)), 'Value']}
          labelFormatter={(label) =>
            new Date(String(label)).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
          }
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#22d3a5"
          strokeWidth={2}
          fill="url(#portfolioGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

interface AllocationChartProps {
  data: { name: string; value: number }[]
}

export function AllocationChart({ data }: AllocationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          {...chartStyles.tooltip}
          formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Allocation']}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

interface AllocationLegendProps {
  data: { name: string; value: number }[]
}

export function AllocationLegend({ data }: AllocationLegendProps) {
  return (
    <div className="mt-2 space-y-2">
      {data.map((item, index) => (
        <div key={item.name} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span className="text-text-secondary">{item.name}</span>
          </div>
          <span className="font-mono text-text-primary">{item.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}
