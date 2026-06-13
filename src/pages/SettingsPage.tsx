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
import { loadAccountSettings, saveAccountSettings } from '@/lib/settingsStorage'
import {
  type AccountSettingsState,
  type BrokerAccount,
  type IbkrAccountMode,
} from '@/types/settings'

function deriveBrokerAccount(
  mode: IbkrAccountMode,
  linkedMode: IbkrAccountMode | null,
  linked: boolean,
  gatewayAccountId: string | null,
  gatewayConnected: boolean,
  statusPort: number | undefined,
  statusHost: string | undefined,
  loading: boolean,
  lastUpdated: Date | null,
  error: string | null,
): BrokerAccount {
  const expectedPort = mode === 'paper' ? 4002 : 4001
  const isActiveSession = linked && linkedMode === mode

  if (loading && isActiveSession && !lastUpdated) {
    return {
      status: 'pending',
      accountId: null,
      lastSync: null,
      host: statusHost ?? '127.0.0.1',
      port: expectedPort,
      mode,
    }
  }

  if (isActiveSession && gatewayConnected && gatewayAccountId) {
    return {
      status: 'connected',
      accountId: gatewayAccountId,
      lastSync: lastUpdated?.toISOString() ?? new Date().toISOString(),
      host: statusHost ?? '127.0.0.1',
      port: statusPort ?? expectedPort,
      mode,
    }
  }

  if (isActiveSession && !gatewayConnected) {
    return {
      status: 'disconnected',
      accountId: null,
      lastSync: lastUpdated?.toISOString() ?? null,
      host: statusHost ?? '127.0.0.1',
      port: expectedPort,
      mode,
      errorMessage:
        error ??
        `IB Gateway not connected on port ${expectedPort}. Open IB Gateway in ${mode === 'paper' ? 'Paper' : 'Live'} mode and click Connect.`,
    }
  }

  return {
    status: 'disconnected',
    accountId: null,
    lastSync: lastUpdated?.toISOString() ?? null,
    host: statusHost ?? '127.0.0.1',
    port: expectedPort,
    mode,
  }
}

export function SettingsPage() {
  const [settings, setSettings] = useState<AccountSettingsState>(() => loadAccountSettings())
  const [toast, setToast] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [busyMode, setBusyMode] = useState<IbkrAccountMode | null>(null)
  const [busyAction, setBusyAction] = useState<'connect' | 'disconnect' | null>(null)

  const {
    status,
    loading,
    error,
    lastUpdated,
    connected,
    accountId,
    refresh,
    connectBroker,
    disconnectBroker,
  } = useIbkrData()

  useEffect(() => {
    setSettings((prev) => {
      const linked = prev.brokerSession.linked
      const linkedMode = prev.brokerSession.linkedMode
      const gatewayAccountId = accountId
      const gatewayConnected = connected

      return {
        ...prev,
        broker: {
          paper: deriveBrokerAccount(
            'paper',
            linkedMode,
            linked,
            gatewayAccountId,
            gatewayConnected && (status?.port === 4002 || linkedMode === 'paper'),
            status?.port,
            status?.host,
            loading,
            lastUpdated,
            error,
          ),
          live: deriveBrokerAccount(
            'live',
            linkedMode,
            linked,
            gatewayAccountId,
            gatewayConnected && (status?.port === 4001 || linkedMode === 'live'),
            status?.port,
            status?.host,
            loading,
            lastUpdated,
            error,
          ),
        },
      }
    })
  }, [status, error, lastUpdated, loading, connected, accountId])

  const showToast = (message: string, duration = 4000) => {
    setToast(message)
    setTimeout(() => setToast(null), duration)
  }

  const updateSettings = (partial: Partial<AccountSettingsState>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      saveAccountSettings(next)
      return next
    })
  }

  const connectAccount = async (mode: IbkrAccountMode) => {
    if (mode === 'live' && settings.tradingMode.liveModeLocked) {
      showToast('Enable live account connection in Trading Mode first.')
      return
    }

    if (mode === 'live' && settings.tradingMode.requireLiveConfirmation) {
      const confirmed = window.confirm(
        'Connect to your LIVE IBKR account? Real capital will be at risk when strategies run.',
      )
      if (!confirmed) return
    }

    setBusyMode(mode)
    setBusyAction('connect')
    try {
      const nextStatus = await connectBroker(mode)
      setSettings(loadAccountSettings())
      if (!nextStatus.account) {
        showToast('Connected to IB Gateway but no account ID returned. Check IB Gateway login.')
        return
      }
      showToast(
        mode === 'paper'
          ? `Paper account connected: ${nextStatus.account} (port 4002)`
          : `Live account connected: ${nextStatus.account} (port 4001)`,
      )
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'Connection failed.')
    } finally {
      setBusyMode(null)
      setBusyAction(null)
    }
  }

  const disconnectAccount = async (mode: IbkrAccountMode) => {
    if (!settings.brokerSession.linked || settings.brokerSession.linkedMode !== mode) {
      showToast(`${mode === 'paper' ? 'Paper' : 'Live'} account is not connected.`)
      return
    }

    setBusyMode(mode)
    setBusyAction('disconnect')
    try {
      await disconnectBroker()
      setSettings(loadAccountSettings())
      showToast(`${mode === 'paper' ? 'Paper' : 'Live'} account disconnected.`)
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'Disconnect failed.')
    } finally {
      setBusyMode(null)
      setBusyAction(null)
    }
  }

  const triggerEmergencyStop = () => {
    updateSettings({
      risk: { ...settings.risk, emergencyStopActive: true },
    })
    showToast('Emergency stop activated — bot automation halted')
  }

  const resetEmergencyStop = () => {
    updateSettings({
      risk: { ...settings.risk, emergencyStopActive: false },
    })
    showToast('Emergency stop reset — bot may resume when strategies are running')
  }

  const exportData = () => {
    showToast('Data export queued — download link will be emailed (mock)')
  }

  const deleteAccount = () => {
    showToast('Account deletion requires email confirmation (mock)')
  }

  const saveChanges = () => {
    saveAccountSettings(settings)
    setSaveMessage('Settings saved')
    setTimeout(() => setSaveMessage(null), 3000)
  }

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Settings & Risk Control"
        description="Connect IB Gateway paper (port 4002) or live (port 4001) for real portfolio data"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-accent">
              {connected && accountId
                ? `${accountId} · ${settings.brokerSession.linkedMode === 'live' ? 'Live' : 'Paper'}`
                : 'Not Connected'}
            </span>
          </div>
        }
      />

      <IbkrBackendBanner
        loading={loading}
        error={settings.brokerSession.linked ? error : null}
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
        activeMode={settings.tradingMode.activeMode}
        loading={loading}
        busyMode={busyMode}
        busyAction={busyAction}
        liveConnectLocked={settings.tradingMode.liveModeLocked}
        onRefresh={() => void refresh()}
        onConnectPaper={() => void connectAccount('paper')}
        onConnectLive={() => void connectAccount('live')}
        onDisconnectPaper={() => void disconnectAccount('paper')}
        onDisconnectLive={() => void disconnectAccount('live')}
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
