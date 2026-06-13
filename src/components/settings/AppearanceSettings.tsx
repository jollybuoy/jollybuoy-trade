import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { ThemeSelector } from '@/components/ui/ThemeToggle'
import { useTheme } from '@/context/ThemeContext'

export function AppearanceSettings() {
  const { theme } = useTheme()

  return (
    <TerminalCard>
      <TerminalCardHeader
        title="Appearance"
        description="Customize how JollyBuoy Trade looks"
      />
      <div className="space-y-3">
        <p className="text-xs text-text-secondary">
          Choose light or dark theme. Your preference is saved automatically.
        </p>
        <ThemeSelector />
        <p className="text-[11px] text-text-muted">
          Current theme:{' '}
          <span className="font-medium capitalize text-text-primary">{theme}</span>
        </p>
      </div>
    </TerminalCard>
  )
}
