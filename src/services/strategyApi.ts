import type { Mega7CycleResult, Mega7StrategyStatus } from '@/types/mega7Strategy'

const REQUEST_TIMEOUT_MS = 30_000

async function parseError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: string; error?: string }
    return payload.detail ?? payload.error ?? response.statusText
  } catch {
    return response.statusText || 'Request failed'
  }
}

async function strategyRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(path, { ...init, signal: controller.signal })
    if (!response.ok) {
      throw new Error(await parseError(response))
    }
    return (await response.json()) as T
  } finally {
    window.clearTimeout(timeout)
  }
}

export function getMega7StrategyStatus(): Promise<Mega7StrategyStatus> {
  return strategyRequest<Mega7StrategyStatus>('/api/strategy/mega7/status')
}

export function runMega7StrategyOnce(): Promise<Mega7CycleResult> {
  return strategyRequest<Mega7CycleResult>('/api/strategy/mega7/run-once', { method: 'POST' })
}

export function startMega7Strategy(): Promise<Mega7StrategyStatus> {
  return strategyRequest<Mega7StrategyStatus>('/api/strategy/mega7/start', { method: 'POST' })
}

export function pauseMega7Strategy(): Promise<Mega7StrategyStatus> {
  return strategyRequest<Mega7StrategyStatus>('/api/strategy/mega7/pause', { method: 'POST' })
}

export function emergencyStopMega7Strategy(): Promise<Mega7StrategyStatus> {
  return strategyRequest<Mega7StrategyStatus>('/api/strategy/mega7/emergency-stop', {
    method: 'POST',
  })
}
