import { useState } from 'react'
import { Shield } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { BrokerConnectionSection } from '@/components/settings/BrokerConnectionSection'
import { TradingModeSettings } from '@/components/settings/TradingModeSettings'
import { RiskControlsSection } from '@/components/settings/RiskControlsSection'
import { NotificationSettingsSection } from '@/components/settings/NotificationSettingsSection'
import { AccountSecuritySection } from '@/components/settings/AccountSecuritySection'
import { AppearanceSettings } from '@/components/settings/AppearanceSettings'
import { IBKR_PAPER_ACCOUNT_ID } from '@/data/settingsAnalytics'
import {
  DEFAULT_ACCOUNT_SETTINGS,
  type AccountSettingsState,
} from '@/types/settings'

export function SettingsPage() {
  const [settings, setSettings] = useState<AccountSettingsState>(DEFAULT_ACCOUNT_SETTINGS)
  const [toast, setToast] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const showToast = (message: string, duration = 3000) => {
    setToast(message)
    setTimeout(() => setToast(null), duration)
  }

  const updateSettings = (partial: Partial<AccountSettingsState>) => {
    setSettings((prev) => ({ ...prev, ...partial }))
  }

  const connectPaper = () => {
    setSettings((prev) => ({
      ...prev,
      broker: {
        ...prev.broker,
        paper: { ...prev.broker.paper, status: 'pending' },
      },
    }))

    setTimeout(() => {
      setSettings((prev) => ({
        ...prev,
        broker: {
          ...prev.broker,
          paper: {
            status: 'connected',
            accountId: IBKR_PAPER_ACCOUNT_ID,
            lastSync: new Date().toISOString(),
          },
        },
      }))
      showToast('IBKR Paper Account connected (mock)')
    }, 1200)
  }

  const disconnectPaper = () => {
    setSettings((prev) => ({
      ...prev,
      broker: {
        ...prev.broker,
        paper: { status: 'disconnected', accountId: null, lastSync: null },
      },
    }))
    showToast('IBKR Paper Account disconnected (mock)')
  }

  const triggerEmergencyStop = () => {
    updateSettings({
      risk: { ...settings.risk, emergencyStopActive: true },
    })
    showToast('Emergency stop activated — all trading halted (mock)')
  }

  const resetEmergencyStop = () => {
    updateSettings({
      risk: { ...settings.risk, emergencyStopActive: false },
    })
    showToast('Emergency stop reset — trading may resume (mock)')
  }

  const exportData = () => {
    showToast('Data export queued — download link will be emailed (mock)')
  }

  const deleteAccount = () => {
    showToast('Account deletion requires email confirmation (mock)')
  }

  const saveChanges = () => {
    setSaveMessage('Settings saved locally (mock — no backend)')
    setTimeout(() => setSaveMessage(null), 3000)
  }

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Settings & Risk Control"
        description="Broker connections, trading mode, risk limits, and account preferences"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-accent">
              {settings.risk.emergencyStopActive ? 'TRADING HALTED' : 'RISK CONTROLS ARMED'}
            </span>
          </div>
        }
      />

      {toast && (
        <div className="rounded-lg border border-ai/20 bg-ai/5 px-4 py-2.5 text-sm text-ai">
          {toast}
        </div>
      )}

      <BrokerConnectionSection
        paper={settings.broker.paper}
        live={settings.broker.live}
        onConnectPaper={connectPaper}
        onDisconnectPaper={disconnectPaper}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <TradingModeSettings
          settings={settings.tradingMode}
          onChange={(tradingMode) => updateSettings({ tradingMode })}
        />
        <AppearanceSettings />
      </div>

      <RiskControlsSection
        settings={settings.risk}
        onChange={(risk) => updateSettings({ risk })}
        onEmergencyStop={triggerEmergencyStop}
        onResetEmergencyStop={resetEmergencyStop}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <NotificationSettingsSection
          settings={settings.notifications}
          onChange={(notifications) => updateSettings({ notifications })}
        />
        <AccountSecuritySection
          profile={settings.profile}
          subscriptionPlan={settings.subscriptionPlan}
          apiKeyMasked={settings.apiKeyMasked}
          onProfileChange={(profile) => updateSettings({ profile })}
          onExportData={exportData}
          onDeleteAccount={deleteAccount}
          saveMessage={saveMessage}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveChanges}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-muted"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
