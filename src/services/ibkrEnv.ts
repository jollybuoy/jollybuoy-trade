export const IBKR_BACKEND_NOT_CONNECTED = 'IBKR local backend not connected'

export function isProductionDeployment(): boolean {
  return import.meta.env.PROD
}

export function isLocalDevelopment(): boolean {
  return import.meta.env.DEV
}

export function isLocalHost(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

export function isNetlifyDeployment(): boolean {
  if (typeof window === 'undefined') return isProductionDeployment() && !isLocalHost()
  return isProductionDeployment() && !isLocalHost()
}

export function isIbkrBackendConfigured(): boolean {
  const configured = import.meta.env.VITE_IBKR_API_URL?.trim()
  if (configured) return true
  if (isLocalDevelopment() || isLocalHost()) return true
  return false
}

/** Empty string = same-origin (Vite dev/preview proxy to port 8000). */
export function getIbkrApiBaseUrl(): string | null {
  const configured = import.meta.env.VITE_IBKR_API_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')

  if (isLocalDevelopment() || isLocalHost()) {
    return ''
  }

  return null
}

export function getIbkrBackendMessage(error?: string | null, errorCode?: string | null): string {
  if (errorCode === 'user_disconnected') {
    return 'IBKR disconnected. Connect your paper account (IB Gateway port 4002) in Settings.'
  }

  if (errorCode === 'gateway_not_running' || errorCode === 'connection_timeout' || errorCode === 'api_port_unavailable') {
    return 'IB Gateway not reachable on port 4002. Open IB Gateway in Paper Trading mode and enable API connections.'
  }

  if (error && error !== IBKR_BACKEND_NOT_CONNECTED) return error

  if (isNetlifyDeployment() || !isIbkrBackendConfigured()) {
    return IBKR_BACKEND_NOT_CONNECTED
  }

  return 'Start IB Gateway (Paper, port 4002), then click Connect Paper Account in Settings.'
}
