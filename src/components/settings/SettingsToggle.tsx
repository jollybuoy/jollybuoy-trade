import { cn } from '@/lib/utils'

interface SettingsToggleProps {
  label: string
  description?: string
  enabled: boolean
  onToggle: (value: boolean) => void
  disabled?: boolean
}

export function SettingsToggle({
  label,
  description,
  enabled,
  onToggle,
  disabled = false,
}: SettingsToggleProps) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && <p className="mt-0.5 text-[10px] text-text-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => onToggle(!enabled)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          enabled ? 'bg-accent' : 'bg-surface-elevated',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            enabled ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}
