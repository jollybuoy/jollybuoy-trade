import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TerminalCardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  glow?: 'default' | 'ai' | 'none'
  scanline?: boolean
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function TerminalCard({
  children,
  className,
  padding = 'md',
  glow = 'default',
  scanline = false,
}: TerminalCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated/80 backdrop-blur-sm',
        glow === 'default' && 'terminal-glow',
        glow === 'ai' && 'terminal-glow-accent border-ai/20',
        paddingMap[padding],
        className,
      )}
    >
      {scanline && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
          <div className="scan-line absolute inset-0 h-full w-full" />
        </div>
      )}
      {children}
    </div>
  )
}

interface TerminalCardHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  badge?: ReactNode
}

export function TerminalCardHeader({ title, description, action, badge }: TerminalCardHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {badge}
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
