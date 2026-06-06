import type {
  IbkrAccount,
  IbkrOpenOrder,
  IbkrPosition,
  IbkrStatus,
} from '@/types/ibkr'
import {
  getIbkrApiBaseUrl,
  getIbkrBackendMessage,
  IBKR_BACKEND_NOT_CONNECTED,
  isIbkrBackendConfigured,
} from '@/services/ibkrEnv'

const REQUEST_TIMEOUT_MS = 8_000

export class IbkrApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'IbkrApiError'
    this.status = status
  }
}

function disconnectedStatus(error: string, errorCode = 'backend_unavailable'): IbkrStatus {
  return {
    connected: false,
    account: null,
    mode: 'paper',
    host: '127.0.0.1',
    port: 4002,
    error,
    errorCode,
  }
}

async function parseError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: string; error?: string }
    return payload.detail ?? payload.error ?? response.statusText
  } catch {
    return response.statusText || 'Request failed'
  }
}

async function safeRequest<T>(path: string): Promise<{ data?: T; error?: string }> {
  if (!isIbkrBackendConfigured()) {
    return { error: IBKR_BACKEND_NOT_CONNECTED }
  }

  const baseUrl = getIbkrApiBaseUrl()
  if (baseUrl === null) {
    return { error: IBKR_BACKEND_NOT_CONNECTED }
  }

  const url = baseUrl ? `${baseUrl}${path}` : path
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, { signal: controller.signal })

    if (!response.ok) {
      return { error: await parseError(response) }
    }

    return { data: (await response.json()) as T }
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      return { error: IBKR_BACKEND_NOT_CONNECTED }
    }
    return { error: IBKR_BACKEND_NOT_CONNECTED }
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function getIbkrStatus(): Promise<IbkrStatus> {
  const result = await safeRequest<IbkrStatus>('/api/ibkr/status')
  if (result.data) return result.data
  return disconnectedStatus(getIbkrBackendMessage(result.error))
}

export async function getIbkrAccount(): Promise<IbkrAccount | null> {
  const result = await safeRequest<IbkrAccount>('/api/ibkr/account')
  return result.data ?? null
}

export async function getIbkrPositions(): Promise<IbkrPosition[]> {
  const result = await safeRequest<IbkrPosition[]>('/api/ibkr/positions')
  return result.data ?? []
}

export async function getIbkrOpenOrders(): Promise<IbkrOpenOrder[]> {
  const result = await safeRequest<IbkrOpenOrder[]>('/api/ibkr/open-orders')
  return result.data ?? []
}

export { getIbkrApiBaseUrl, isIbkrBackendConfigured }
