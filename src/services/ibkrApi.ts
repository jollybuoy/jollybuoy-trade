import type {
  IbkrAccount,
  IbkrOpenOrder,
  IbkrPosition,
  IbkrStatus,
} from '@/types/ibkr'

const DEFAULT_BASE_URL = 'http://localhost:8000'

function getBaseUrl(): string {
  const configured = import.meta.env.VITE_IBKR_API_URL?.trim()
  return configured && configured.length > 0
    ? configured.replace(/\/$/, '')
    : DEFAULT_BASE_URL
}

export class IbkrApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'IbkrApiError'
    this.status = status
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

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`)

  if (!response.ok) {
    throw new IbkrApiError(await parseError(response), response.status)
  }

  return (await response.json()) as T
}

export function getIbkrStatus(): Promise<IbkrStatus> {
  return request<IbkrStatus>('/api/ibkr/status')
}

export function getIbkrAccount(): Promise<IbkrAccount> {
  return request<IbkrAccount>('/api/ibkr/account')
}

export function getIbkrPositions(): Promise<IbkrPosition[]> {
  return request<IbkrPosition[]>('/api/ibkr/positions')
}

export function getIbkrOpenOrders(): Promise<IbkrOpenOrder[]> {
  return request<IbkrOpenOrder[]>('/api/ibkr/open-orders')
}

export function getIbkrApiBaseUrl(): string {
  return getBaseUrl()
}
