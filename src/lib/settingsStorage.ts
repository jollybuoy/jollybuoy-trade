import type { AccountSettingsState } from '@/types/settings'
import { DEFAULT_ACCOUNT_SETTINGS } from '@/types/settings'

const STORAGE_KEY = 'jollybuoy-account-settings'

export function loadAccountSettings(): AccountSettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_ACCOUNT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<AccountSettingsState>
    return {
      ...DEFAULT_ACCOUNT_SETTINGS,
      ...parsed,
      broker: {
        ...DEFAULT_ACCOUNT_SETTINGS.broker,
        ...parsed.broker,
      },
      brokerSession: {
        ...DEFAULT_ACCOUNT_SETTINGS.brokerSession,
        ...parsed.brokerSession,
      },
      tradingMode: {
        ...DEFAULT_ACCOUNT_SETTINGS.tradingMode,
        ...parsed.tradingMode,
      },
      risk: {
        ...DEFAULT_ACCOUNT_SETTINGS.risk,
        ...parsed.risk,
      },
      notifications: {
        ...DEFAULT_ACCOUNT_SETTINGS.notifications,
        ...parsed.notifications,
      },
      profile: {
        ...DEFAULT_ACCOUNT_SETTINGS.profile,
        ...parsed.profile,
      },
    }
  } catch {
    return DEFAULT_ACCOUNT_SETTINGS
  }
}

export function saveAccountSettings(settings: AccountSettingsState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
