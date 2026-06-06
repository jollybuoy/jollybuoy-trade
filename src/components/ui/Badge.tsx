import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'muted'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-hover text-text-secondary border-border',
  success: 'bg-accent/10 text-accent border-accent/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  info: 'bg-info/10 text-info border-info/20',
  muted: 'bg-surface-hover text-text-muted border-border-subtle',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, BadgeVariant> = {
    active: 'success',
    filled: 'success',
    paused: 'warning',
    pending: 'info',
    draft: 'muted',
    cancelled: 'danger',
    partial: 'warning',
    open: 'info',
    buy: 'success',
    sell: 'danger',
    breakout: 'success',
    momentum: 'info',
    oversold: 'warning',
    volume_spike: 'info',
  }

  return (
    <Badge variant={variantMap[status] ?? 'default'}>
      {status.replace('_', ' ')}
    </Badge>
  )
}
