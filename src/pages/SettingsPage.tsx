import { useEffect, useState } from 'react'
import { Shield } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { BrokerConnectionSection } from '@/components/settings/BrokerConnectionSection'
import { TradingModeSettings } from '@/components/settings/TradingModeSettings'
import { RiskControlsSection } from '@/components/settings/RiskControlsSection'
import { NotificationSettingsSection } from '@/components/settings/NotificationSettingsSection'
import { AccountSecuritySection } from '@/components/settings/AccountSecuritySection'
import { AppearanceSettings } from '@/components/settings/AppearanceSettings'
import { IbkrBackendBanner } from '@/components/ibkr/IbkrBackendBanner'
import { useIbkrData } from '@/hooks/useIbkrData'
import { getIbkrDisconnectedMessage } from '@/services/ibkrMappers'
import {
  DEFAULT_ACCOUNT_SETTINGS,
  type AccountSettingsState,
  type BrokerAccount,
} from '@/types/settings'

function mapStatusToBrokerAccount(
  status: ReturnType<typeof useIbkrData>['status'],
  error: string | null,
  lastUpdated: Date | null,
  loading: boolean,
  connected: boolean,
): BrokerAccount {
  if (loading && !lastUpdated) {
    return {
      status: 'pending',
      accountId: null,
      lastSync: null,
      host: status?.host ?? '127.0.0.1',
      port: status?.port ?? 4002,
      mode: 'paper',
    }
  }

  if (connected && status) {
    return {
      status: 'connected',
      accountId: status.account,
      lastSync: lastUpdated?.toISOString() ?? new Date().toISOString(),
      host: status.host,
      port: status.port,
      mode: status.mode === 'paper' ? 'paper' : 'live',
    }
  }

  return {
    status: 'disconnected',
    accountId: null,
    lastSync: lastUpdated?.toISOString() ?? null,
    host: status?.host ?? '127.0.0.1',
    port: status?.port ?? 4002,
    mode: 'paper',
    errorMessage: getIbkrDisconnectedMessage(error ?? status?.error),
  }
}

export function SettingsPage() {
  const [settings, setSettings] = useState<AccountSettingsState>(DEFAULT_ACCOUNT_SETTINGS)
  const [toast, setToast] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const { status, loading, error, lastUpdated, connected, refresh } = useIbkrData()

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      broker: {
        ...prev.broker,
        paper: mapStatusToBrokerAccount(status, error, lastUpdated, loading, connected),
      },
    }))
  }, [status, error, lastUpdated, loading, connected])

  const showToast = (message: string, duration = 3000) => {
    setToast(message)
    setTimeout(() => setToast(null), duration)
  }

  const updateSettings = (partial: Partial<AccountSettingsState>) => {
    setSettings((prev) => ({ ...prev, ...partial }))
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
              {settings.risk.emergencyStopActive ? 'TRADING HALTED' : 'IBKR Paper Trading Mode'}
            </span>
          </div>
        }
      />

      <IbkrBackendBanner
        loading={loading}
        error={error}
        connected={connected}
        lastUpdated={lastUpdated}
        onRetry={() => void refresh()}
      />

      {toast && (
        <div className="rounded-lg border border-ai/20 bg-ai/5 px-4 py-2.5 text-sm text-ai">
          {toast}
        </div>
      )}

      <BrokerConnectionSection
        paper={settings.broker.paper}
        live={settings.broker.live}
        loading={loading}
        onRefreshPaper={() => void refresh()}
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
