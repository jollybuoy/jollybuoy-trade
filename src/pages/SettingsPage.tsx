import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ThemeSelector } from '@/components/ui/ThemeToggle'
import { useTheme } from '@/context/ThemeContext'
import { userSettings } from '@/data/mockData'

function Toggle({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-text-primary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          enabled ? 'bg-accent' : 'bg-surface-hover'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            enabled ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export function SettingsPage() {
  const { theme } = useTheme()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and trading configuration"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Appearance" description="Customize how JollyBuoy Trade looks" />
          <div className="space-y-3">
            <p className="text-xs text-text-secondary">
              Choose light or dark theme. Your preference is saved automatically.
            </p>
            <ThemeSelector />
            <p className="text-[11px] text-text-muted">
              Current theme: <span className="font-medium capitalize text-text-primary">{theme}</span>
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Profile" description="Your account information" />
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-text-secondary">Display Name</label>
              <input
                type="text"
                defaultValue={userSettings.displayName}
                className="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-hover px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary">Email</label>
              <input
                type="email"
                defaultValue={userSettings.email}
                className="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-hover px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary">Timezone</label>
              <select
                defaultValue={userSettings.timezone}
                className="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-hover px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Notifications" description="Choose what alerts you receive" />
          <div className="divide-y divide-border-subtle">
            <Toggle enabled={userSettings.notifications.priceAlerts} label="Price alerts" />
            <Toggle
              enabled={userSettings.notifications.tradeConfirmations}
              label="Trade confirmations"
            />
            <Toggle
              enabled={userSettings.notifications.strategySignals}
              label="Strategy signals"
            />
            <Toggle enabled={userSettings.notifications.dailySummary} label="Daily summary" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Trading Preferences" description="Default order and execution settings" />
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-text-secondary">
                Default Order Type
              </label>
              <select
                defaultValue={userSettings.trading.defaultOrderType}
                className="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-hover px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="market">Market</option>
                <option value="limit">Limit</option>
                <option value="stop">Stop</option>
                <option value="stop_limit">Stop Limit</option>
              </select>
            </div>
            <div className="divide-y divide-border-subtle">
              <Toggle
                enabled={userSettings.trading.confirmBeforeTrade}
                label="Confirm before placing trades"
              />
              <Toggle
                enabled={userSettings.trading.paperTradingEnabled}
                label="Paper trading mode"
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Integrations" description="Connect external services" />
          <div className="space-y-3">
            {[
              { name: 'Interactive Brokers', status: 'Coming Soon', connected: false },
              { name: 'Supabase', status: 'Not Connected', connected: false },
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-hover/50 p-4"
              >
                <div>
                  <p className="font-medium text-text-primary">{integration.name}</p>
                  <p className="text-xs text-text-muted">{integration.status}</p>
                </div>
                <button
                  type="button"
                  disabled={integration.name === 'Interactive Brokers'}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-muted"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
