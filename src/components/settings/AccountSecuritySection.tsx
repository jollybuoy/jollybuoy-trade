import { CreditCard, Download, Key, Trash2, User } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { TIMEZONE_OPTIONS } from '@/data/settingsAnalytics'
import type { UserProfile } from '@/types/settings'
import { formatDate } from '@/lib/utils'

interface AccountSecuritySectionProps {
  profile: UserProfile
  subscriptionPlan: string
  apiKeyMasked: string
  onProfileChange: (profile: UserProfile) => void
  onExportData: () => void
  onDeleteAccount: () => void
  saveMessage?: string | null
}

export function AccountSecuritySection({
  profile,
  subscriptionPlan,
  apiKeyMasked,
  onProfileChange,
  onExportData,
  onDeleteAccount,
  saveMessage,
}: AccountSecuritySectionProps) {
  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    onProfileChange({ ...profile, [key]: value })
  }

  return (
    <TerminalCard>
      <TerminalCardHeader
        title="Account & Security"
        description="Profile, subscription, and data management"
        badge={
          <span className="inline-flex items-center gap-1 rounded-md border border-border-subtle bg-surface/40 px-2 py-0.5 text-[10px] font-semibold uppercase text-text-muted">
            <User className="h-3 w-3" />
            Member since {formatDate(profile.memberSince)}
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Field label="Display Name">
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => update('displayName', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={profile.email}
              onChange={(e) => update('email', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Timezone">
            <select
              value={profile.timezone}
              onChange={(e) => update('timezone', e.target.value)}
              className={inputClass}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="space-y-3">
          <PlaceholderCard
            icon={CreditCard}
            label="Subscription Plan"
            value={subscriptionPlan}
            action="Manage (placeholder)"
            disabled
          />
          <PlaceholderCard
            icon={Key}
            label="API Key"
            value={apiKeyMasked}
            action="Regenerate (placeholder)"
            disabled
          />
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={onExportData}
              className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-ai/30 hover:bg-ai/5"
            >
              <Download className="h-4 w-4 text-ai" />
              Export Data
            </button>
            <button
              type="button"
              onClick={onDeleteAccount}
              className="inline-flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-4 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
          {saveMessage && (
            <p className="text-xs text-accent">{saveMessage}</p>
          )}
        </div>
      </div>
    </TerminalCard>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function PlaceholderCard({
  icon: Icon,
  label,
  value,
  action,
  disabled,
}: {
  icon: typeof Key
  label: string
  value: string
  action: string
  disabled?: boolean
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-text-muted">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {label}
            </p>
            <p className="mt-1 font-mono text-sm text-text-primary">{value}</p>
          </div>
        </div>
        <button
          type="button"
          disabled={disabled}
          className="shrink-0 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {action}
        </button>
      </div>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2.5 text-sm text-text-primary focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20'
