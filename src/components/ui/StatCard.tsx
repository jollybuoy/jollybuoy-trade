import type { ReactNode } from 'react'
import { cn, getChangeColor } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  change?: string
  changeValue?: number
  icon?: ReactNode
  className?: string
}

export function StatCard({ label, value, change, changeValue, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border-subtle bg-surface-elevated p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          {label}
        </p>
        {icon && (
          <div className="rounded-lg bg-surface-hover p-2 text-text-secondary">{icon}</div>
        )}
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-text-primary">
        {value}
      </p>
      {change && (
        <p className={cn('mt-1 text-sm font-medium', changeValue !== undefined && getChangeColor(changeValue))}>
          {change}
        </p>
      )}
    </div>
  )
}
