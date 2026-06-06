import { useState } from 'react'
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TerminalCard, TerminalCardHeader } from './TerminalCard'
import type { PortfolioSnapshot } from '@/types'
import { formatCurrency, cn } from '@/lib/utils'

const PERIODS = ['1W', '1M', '3M', '6M', 'YTD', 'ALL'] as const

interface PerformanceChartProps {
  data: PortfolioSnapshot[]
  className?: string
}

export function PerformanceChart({ data, className }: PerformanceChartProps) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('6M')

  const filtered = filterByPeriod(data, period)
  const startValue = filtered[0]?.value ?? 0
  const endValue = filtered[filtered.length - 1]?.value ?? 0
  const returnPct = startValue > 0 ? ((endValue - startValue) / startValue) * 100 : 0
  const alpha =
    filtered.length > 0
      ? endValue - (filtered[filtered.length - 1]?.benchmark ?? endValue)
      : 0

  return (
    <TerminalCard glow="ai" scanline className={cn('lg:col-span-2', className)}>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <TerminalCardHeader
            title="Performance"
            description="Portfolio vs S&P 500 benchmark"
          />
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-2xl font-bold text-text-primary">
              {formatCurrency(endValue)}
            </span>
            <span className={cn('font-mono text-sm font-medium', returnPct >= 0 ? 'text-accent' : 'text-danger')}>
              {returnPct >= 0 ? '+' : ''}
              {returnPct.toFixed(2)}%
            </span>
            <span className="text-xs text-text-muted">
              Alpha: <span className="font-mono text-ai">{formatCurrency(alpha)}</span>
            </span>
          </div>
        </div>

        <div className="flex gap-1 rounded-lg border border-border-subtle bg-surface/60 p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                period === p
                  ? 'bg-ai/10 text-ai'
                  : 'text-text-muted hover:text-text-primary',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={filtered} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3a5" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#22d3a5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="benchGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b9dff" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#5b9dff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#141b24" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#5c6b7f', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#5c6b7f', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            domain={['auto', 'auto']}
            width={52}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0c1017',
              border: '1px solid #1e2836',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 8px 32px rgb(0 0 0 / 0.5)',
            }}
            labelStyle={{ color: '#8b9cb3' }}
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name === 'value' ? 'Portfolio' : 'Benchmark',
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
            formatter={(value) => (value === 'value' ? 'Portfolio' : 'S&P 500')}
          />
          <Area
            type="monotone"
            dataKey="benchmark"
            stroke="#5b9dff"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#benchGradient)"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#22d3a5"
            strokeWidth={2}
            fill="url(#perfGradient)"
          />
          <Line type="monotone" dataKey="value" stroke="#22d3a5" strokeWidth={0} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </TerminalCard>
  )
}

function filterByPeriod(data: PortfolioSnapshot[], period: (typeof PERIODS)[number]) {
  const slices: Record<(typeof PERIODS)[number], number> = {
    '1W': 2,
    '1M': 4,
    '3M': 8,
    '6M': data.length,
    YTD: Math.min(16, data.length),
    ALL: data.length,
  }
  return data.slice(-slices[period])
}
