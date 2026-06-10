import type {
  IbkrAccount,
  IbkrAccountMode,
  IbkrExecution,
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
const CONNECT_TIMEOUT_MS = 45_000

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

async function safeRequest<T>(
  path: string,
  init?: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<{ data?: T; error?: string; status?: number }> {
  if (!isIbkrBackendConfigured()) {
    return { error: IBKR_BACKEND_NOT_CONNECTED }
  }

  const baseUrl = getIbkrApiBaseUrl()
  if (baseUrl === null) {
    return { error: IBKR_BACKEND_NOT_CONNECTED }
  }

  const url = baseUrl ? `${baseUrl}${path}` : path
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { ...init, signal: controller.signal })

    if (!response.ok) {
      return { error: await parseError(response), status: response.status }
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

export async function connectIbkrAccount(mode: IbkrAccountMode): Promise<IbkrStatus> {
  const result = await safeRequest<IbkrStatus>(
    '/api/ibkr/connect',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    },
    CONNECT_TIMEOUT_MS,
  )
  if (result.data) return result.data
  throw new IbkrApiError(getIbkrBackendMessage(result.error), result.status)
}

export async function disconnectIbkrAccount(): Promise<IbkrStatus> {
  const result = await safeRequest<IbkrStatus>('/api/ibkr/disconnect', {
    method: 'POST',
  })
  if (result.data) return result.data
  throw new IbkrApiError(getIbkrBackendMessage(result.error), result.status)
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

export async function getIbkrExecutions(): Promise<IbkrExecution[]> {
  const result = await safeRequest<IbkrExecution[]>('/api/ibkr/executions')
  return result.data ?? []
}

export async function placeIbkrMarketOrder(
  symbol: string,
  action: 'BUY' | 'SELL',
  quantity: number,
): Promise<{ orderId: number; status: string; avgFillPrice: number }> {
  const result = await safeRequest<{
    orderId: number
    status: string
    avgFillPrice: number
  }>('/api/ibkr/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, action, quantity }),
  })
  if (result.data) return result.data
  throw new IbkrApiError(getIbkrBackendMessage(result.error), result.status)
}

export { getIbkrApiBaseUrl, isIbkrBackendConfigured }
