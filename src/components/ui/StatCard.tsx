import type { ReactNode } from 'react'
import { cn, getChangeColor } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  change?: string
  changeValue?: number
  icon?: ReactNode
  className?: string
  variant?: 'default' | 'terminal'
}

export function StatCard({
  label,
  value,
  change,
  changeValue,
  icon,
  className,
  variant = 'default',
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-5 transition-colors',
        variant === 'terminal'
          ? 'terminal-glow border-border-subtle bg-surface-elevated/80 hover:border-ai/15'
          : 'border-border-subtle bg-surface-elevated',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </p>
        {icon && (
          <div
            className={cn(
              'rounded-lg p-2',
              variant === 'terminal' ? 'bg-ai/10 text-ai' : 'bg-surface-hover text-text-secondary',
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-text-primary">
        {value}
      </p>
      {change && (
        <p
          className={cn(
            'mt-1 text-xs font-medium',
            changeValue !== undefined && getChangeColor(changeValue),
          )}
        >
          {change}
        </p>
      )}
    </div>
  )
}
