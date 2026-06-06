import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getIbkrAccount,
  getIbkrOpenOrders,
  getIbkrPositions,
  getIbkrStatus,
} from '@/services/ibkrApi'
import { getIbkrBackendMessage } from '@/services/ibkrEnv'
import type { IbkrAccount, IbkrOpenOrder, IbkrPosition, IbkrStatus } from '@/types/ibkr'

export interface UseIbkrDataOptions {
  enabled?: boolean
  refreshIntervalMs?: number
}

export interface UseIbkrDataResult {
  status: IbkrStatus | null
  account: IbkrAccount | null
  positions: IbkrPosition[]
  openOrders: IbkrOpenOrder[]
  loading: boolean
  error: string | null
  connected: boolean
  lastUpdated: Date | null
  refresh: () => Promise<void>
}

const IbkrDataContext = createContext<UseIbkrDataResult | null>(null)

function useIbkrDataInternal(options: UseIbkrDataOptions = {}): UseIbkrDataResult {
  const { enabled = true, refreshIntervalMs = 60_000 } = options

  const [status, setStatus] = useState<IbkrStatus | null>(null)
  const [account, setAccount] = useState<IbkrAccount | null>(null)
  const [positions, setPositions] = useState<IbkrPosition[]>([])
  const [openOrders, setOpenOrders] = useState<IbkrOpenOrder[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refresh = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    try {
      const nextStatus = await getIbkrStatus()
      setStatus(nextStatus)

      if (!nextStatus.connected) {
        setAccount(null)
        setPositions([])
        setOpenOrders([])
        setError(getIbkrBackendMessage(nextStatus.error))
        return
      }

      const [nextAccount, nextPositions, nextOrders] = await Promise.all([
        getIbkrAccount(),
        getIbkrPositions(),
        getIbkrOpenOrders(),
      ])

      if (!nextAccount) {
        setAccount(null)
        setPositions([])
        setOpenOrders([])
        setError(getIbkrBackendMessage())
        return
      }

      setAccount(nextAccount)
      setPositions(nextPositions)
      setOpenOrders(nextOrders)
      setError(null)
      setLastUpdated(new Date())
    } catch {
      setStatus(null)
      setAccount(null)
      setPositions([])
      setOpenOrders([])
      setError(getIbkrBackendMessage())
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (!enabled || refreshIntervalMs <= 0) return undefined

    const timer = window.setInterval(() => {
      void refresh()
    }, refreshIntervalMs)

    return () => window.clearInterval(timer)
  }, [enabled, refreshIntervalMs, refresh])

  const connected = Boolean(status?.connected && account)

  return useMemo(
    () => ({
      status,
      account,
      positions,
      openOrders,
      loading,
      error,
      connected,
      lastUpdated,
      refresh,
    }),
    [status, account, positions, openOrders, loading, error, connected, lastUpdated, refresh],
  )
}

export function IbkrDataProvider({ children }: { children: React.ReactNode }) {
  const value = useIbkrDataInternal()
  return <IbkrDataContext.Provider value={value}>{children}</IbkrDataContext.Provider>
}

export function useIbkrData(): UseIbkrDataResult {
  const context = useContext(IbkrDataContext)
  if (!context) {
    throw new Error('useIbkrData must be used within IbkrDataProvider')
  }
  return context
}
