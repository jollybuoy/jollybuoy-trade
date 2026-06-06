import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary',
        className,
      )}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className="flex items-center gap-2">
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        {showLabel && (
          <span className="text-sm font-medium">{isDark ? 'Light' : 'Dark'}</span>
        )}
      </span>
    </button>
  )
}

interface ThemeSelectorProps {
  className?: string
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme()

  const options = [
    { id: 'dark' as const, label: 'Dark', icon: Moon },
    { id: 'light' as const, label: 'Light', icon: Sun },
  ]

  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTheme(id)}
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all',
            theme === id
              ? 'border-ai/40 bg-ai/10 text-ai ring-1 ring-ai/20'
              : 'border-border-subtle bg-surface/40 text-text-secondary hover:border-border hover:bg-surface-hover',
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
