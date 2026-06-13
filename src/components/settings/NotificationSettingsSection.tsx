import { Bell, FileText, Mail, MessageCircle, TrendingDown } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { SettingsToggle } from '@/components/settings/SettingsToggle'
import type { NotificationSettings } from '@/types/settings'
import { cn } from '@/lib/utils'

interface NotificationSettingsSectionProps {
  settings: NotificationSettings
  onChange: (settings: NotificationSettings) => void
}

export function NotificationSettingsSection({
  settings,
  onChange,
}: NotificationSettingsSectionProps) {
  const update = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) => {
    onChange({ ...settings, [key]: value })
  }

  const activeCount = Object.values(settings).filter(Boolean).length

  const items = [
    {
      key: 'emailAlerts' as const,
      icon: Mail,
      label: 'Email alerts',
      description: 'Trade signals, fills, and account updates',
    },
    {
      key: 'whatsappAlerts' as const,
      icon: MessageCircle,
      label: 'WhatsApp alerts',
      description: 'Instant mobile notifications for key events',
    },
    {
      key: 'tradeExecutionAlerts' as const,
      icon: Bell,
      label: 'Trade execution alerts',
      description: 'Notify on every order fill or rejection',
    },
    {
      key: 'dailyReportAlerts' as const,
      icon: FileText,
      label: 'Daily report alerts',
      description: 'End-of-day P/L summary and performance digest',
    },
    {
      key: 'riskWarningAlerts' as const,
      icon: TrendingDown,
      label: 'Risk warning alerts',
      description: 'Drawdown, loss limits, and exposure breaches',
    },
  ]

  return (
    <TerminalCard>
      <TerminalCardHeader
        title="Notification Settings"
        description="Choose how JollyBuoy Trade reaches you"
        badge={
          <span className="rounded-md border border-warning/20 bg-warning/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-warning">
            {activeCount} active
          </span>
        }
      />

      <div className="space-y-2">
        {items.map(({ key, icon: Icon, label, description }) => (
          <div
            key={key}
            className={cn(
              'rounded-lg border px-3 transition-colors',
              settings[key]
                ? 'border-ai/20 bg-ai/5'
                : 'border-border-subtle bg-surface/30',
            )}
          >
            <div className="flex items-start gap-2.5 py-2">
              <div
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  settings[key] ? 'bg-ai/15 text-ai' : 'bg-surface-elevated text-text-muted',
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <SettingsToggle
                  label={label}
                  description={description}
                  enabled={settings[key]}
                  onToggle={(v) => update(key, v)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </TerminalCard>
  )
}
