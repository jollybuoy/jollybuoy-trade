export const IBKR_BACKEND_NOT_CONNECTED = 'IBKR local backend not connected'

export function isProductionDeployment(): boolean {
  return import.meta.env.PROD
}

export function isLocalDevelopment(): boolean {
  return import.meta.env.DEV
}

export function isNetlifyDeployment(): boolean {
  if (typeof window === 'undefined') return isProductionDeployment()
  return isProductionDeployment() && !window.location.hostname.includes('localhost')
}

export function isIbkrBackendConfigured(): boolean {
  const configured = import.meta.env.VITE_IBKR_API_URL?.trim()
  if (configured) return true
  return isLocalDevelopment()
}

export function getIbkrApiBaseUrl(): string | null {
  const configured = import.meta.env.VITE_IBKR_API_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  if (isLocalDevelopment()) return 'http://localhost:8000'
  return null
}

export function getIbkrBackendMessage(error?: string | null): string {
  if (error) return error
  if (!isIbkrBackendConfigured() || isNetlifyDeployment()) {
    return IBKR_BACKEND_NOT_CONNECTED
  }
  return 'IBKR local backend not connected. Open IB Gateway Paper Trading and run uvicorn on port 8000.'
}
