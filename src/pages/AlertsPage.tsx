import { useMemo, useState } from 'react'
import { Bell } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { AlertOverviewCards } from '@/components/alerts/AlertOverviewCards'
import { CreateAlertPanel } from '@/components/alerts/CreateAlertPanel'
import { AlertsTable } from '@/components/alerts/AlertsTable'
import { NotificationFeed } from '@/components/alerts/NotificationFeed'
import {
  ALERT_OVERVIEW,
  buildConditionLabel,
  MOCK_ALERT_RULES,
  MOCK_NOTIFICATION_FEED,
} from '@/data/alertsAnalytics'
import {
  DEFAULT_CREATE_ALERT_FORM,
  type AlertRule,
  type CreateAlertForm,
} from '@/types/alerts'

export function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertRule[]>(MOCK_ALERT_RULES)
  const [form, setForm] = useState<CreateAlertForm>(DEFAULT_CREATE_ALERT_FORM)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const overview = useMemo(
    () => ({
      ...ALERT_OVERVIEW,
      activeAlerts: alerts.filter((a) => a.status === 'active').length,
    }),
    [alerts],
  )

  const saveAlert = () => {
    const symbol = form.alertType === 'strategy_trigger' ? '—' : form.symbol
    const newAlert: AlertRule = {
      id: `alert-${Date.now()}`,
      symbol,
      alertType: form.alertType,
      condition: buildConditionLabel(form.alertType, form.threshold, form.symbol),
      status: 'active',
      lastTriggered: null,
      notificationMethod: form.notificationMethod,
    }

    setAlerts((prev) => [newAlert, ...prev])
    setSaveMessage(`Alert saved for ${symbol === '—' ? 'strategy' : symbol} (mock)`)
    setForm(DEFAULT_CREATE_ALERT_FORM)
    setTimeout(() => setSaveMessage(null), 3000)
  }

  const editAlert = (id: string) => {
    const alert = alerts.find((a) => a.id === id)
    if (!alert) return
    setToast(`Edit "${alert.condition}" — form prefill coming in backend phase (mock)`)
    setTimeout(() => setToast(null), 3000)
  }

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    setToast('Alert deleted (mock)')
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Alerts & Notifications"
        description="Price, risk, and strategy alerts with notification delivery"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/5 px-3 py-1.5">
            <Bell className="h-4 w-4 text-warning" />
            <span className="text-xs font-medium text-warning">
              {overview.triggeredToday} triggered today
            </span>
          </div>
        }
      />

      {toast && (
        <div className="rounded-lg border border-ai/20 bg-ai/5 px-4 py-2.5 text-sm text-ai">
          {toast}
        </div>
      )}

      <AlertOverviewCards overview={overview} />

      <div className="grid gap-6 xl:grid-cols-3">
        <CreateAlertPanel
          form={form}
          onChange={setForm}
          onSave={saveAlert}
          saveMessage={saveMessage}
        />

        <div className="space-y-6 xl:col-span-2">
          <AlertsTable alerts={alerts} onEdit={editAlert} onDelete={deleteAlert} />
          <NotificationFeed items={MOCK_NOTIFICATION_FEED} />
        </div>
      </div>
    </div>
  )
}
