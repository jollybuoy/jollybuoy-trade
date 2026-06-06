export type BrokerAccountStatus = 'connected' | 'disconnected' | 'pending'

export interface BrokerAccount {
  status: BrokerAccountStatus
  accountId: string | null
  lastSync: string | null
  host?: string | null
  port?: number | null
  mode?: 'paper' | 'live' | null
  errorMessage?: string | null
}

export interface BrokerConnectionState {
  paper: BrokerAccount
  live: BrokerAccount
}

export interface TradingModeSettings {
  paperModeActive: boolean
  liveModeLocked: boolean
  requireLiveConfirmation: boolean
}

export interface RiskControlSettings {
  maxDailyLoss: number
  maxTradeSize: number
  maxOpenPositions: number
  stopAfterLosses: number
  blockOptionsTrading: boolean
  emergencyStopActive: boolean
}

export interface NotificationSettings {
  emailAlerts: boolean
  whatsappAlerts: boolean
  tradeExecutionAlerts: boolean
  dailyReportAlerts: boolean
  riskWarningAlerts: boolean
}

export interface UserProfile {
  displayName: string
  email: string
  timezone: string
  memberSince: string
}

export interface AccountSettingsState {
  profile: UserProfile
  subscriptionPlan: string
  apiKeyMasked: string
  broker: BrokerConnectionState
  tradingMode: TradingModeSettings
  risk: RiskControlSettings
  notifications: NotificationSettings
}

export const DEFAULT_ACCOUNT_SETTINGS: AccountSettingsState = {
  profile: {
    displayName: 'Trader',
    email: 'trader@jollybuoy.com',
    timezone: 'America/New_York',
    memberSince: '2026-01-15',
  },
  subscriptionPlan: 'Pro Terminal — $49/mo (placeholder)',
  apiKeyMasked: 'jb_live_••••••••••••4f2a',
  broker: {
    paper: {
      status: 'disconnected',
      accountId: null,
      lastSync: null,
    },
    live: {
      status: 'disconnected',
      accountId: null,
      lastSync: null,
    },
  },
  tradingMode: {
    paperModeActive: true,
    liveModeLocked: true,
    requireLiveConfirmation: true,
  },
  risk: {
    maxDailyLoss: 2500,
    maxTradeSize: 10000,
    maxOpenPositions: 12,
    stopAfterLosses: 3,
    blockOptionsTrading: true,
    emergencyStopActive: false,
  },
  notifications: {
    emailAlerts: true,
    whatsappAlerts: false,
    tradeExecutionAlerts: true,
    dailyReportAlerts: true,
    riskWarningAlerts: true,
  },
}
