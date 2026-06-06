export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1_000_000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getChangeColor(value: number): string {
  if (value > 0) return 'text-accent'
  if (value < 0) return 'text-danger'
  return 'text-text-secondary'
}

export function getPositionValue(position: { shares: number; currentPrice: number }): number {
  return position.shares * position.currentPrice
}

export function getPositionPnL(position: {
  shares: number
  avgCost: number
  currentPrice: number
}): { pnl: number; pnlPercent: number } {
  const cost = position.shares * position.avgCost
  const value = position.shares * position.currentPrice
  const pnl = value - cost
  const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0
  return { pnl, pnlPercent }
}
