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
import { formatCurrency } from '@/lib/utils'

const CHART_COLORS = ['#3fb950', '#58a6ff', '#d29922', '#f85149', '#8b949e']

interface PortfolioChartProps {
  data: PortfolioSnapshot[]
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3fb950" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#3fb950" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6e7681', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => {
            const date = new Date(value)
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#6e7681', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
          domain={['auto', 'auto']}
          width={55}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#8b949e' }}
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
          stroke="#3fb950"
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
          contentStyle={{
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '8px',
            fontSize: '12px',
          }}
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
