import { DEPLOYED_STRATEGIES } from '@/data/strategyBuilder'
import { loadAccountSettings, saveAccountSettings } from '@/lib/settingsStorage'
import type { DeployedStrategy } from '@/types/strategy'

const STRATEGIES_KEY = 'jollybuoy-strategies'
const BOT_LOG_KEY = 'jollybuoy-bot-log'
const HALT_FLAG_KEY = 'jollybuoy-trading-halted'

export function isTradingHalted(): boolean {
  return localStorage.getItem(HALT_FLAG_KEY) === 'true'
}

export function haltAllTrading(): void {
  const pausedStrategies: DeployedStrategy[] = loadStoredStrategies().map((strategy) => ({
    ...strategy,
    status: 'paused',
  }))

  localStorage.setItem(STRATEGIES_KEY, JSON.stringify(pausedStrategies))
  localStorage.removeItem(BOT_LOG_KEY)

  const settings = loadAccountSettings()
  saveAccountSettings({
    ...settings,
    risk: { ...settings.risk, emergencyStopActive: true },
  })

  localStorage.setItem(HALT_FLAG_KEY, 'true')
}

function loadStoredStrategies(): DeployedStrategy[] {
  try {
    const raw = localStorage.getItem(STRATEGIES_KEY)
    return raw ? (JSON.parse(raw) as DeployedStrategy[]) : DEPLOYED_STRATEGIES
  } catch {
    return DEPLOYED_STRATEGIES
  }
}
