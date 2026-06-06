import { useCallback, useEffect, useState } from 'react'
import {
  getIbkrAccount,
  getIbkrOpenOrders,
  getIbkrPositions,
  getIbkrStatus,
  IbkrApiError,
} from '@/services/ibkrApi'
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
  refreshing: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => Promise<void>
}

export function useIbkrData(options: UseIbkrDataOptions = {}): UseIbkrDataResult {
  const { enabled = true, refreshIntervalMs = 0 } = options

  const [status, setStatus] = useState<IbkrStatus | null>(null)
  const [account, setAccount] = useState<IbkrAccount | null>(null)
  const [positions, setPositions] = useState<IbkrPosition[]>([])
  const [openOrders, setOpenOrders] = useState<IbkrOpenOrder[]>([])
  const [loading, setLoading] = useState(enabled)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refresh = useCallback(async () => {
    if (!enabled) return

    setRefreshing(true)

    try {
      const nextStatus = await getIbkrStatus()
      setStatus(nextStatus)

      if (!nextStatus.connected) {
        setAccount(null)
        setPositions([])
        setOpenOrders([])
        setError(nextStatus.error ?? 'IB Gateway not connected')
        return
      }

      const [nextAccount, nextPositions, nextOrders] = await Promise.all([
        getIbkrAccount(),
        getIbkrPositions(),
        getIbkrOpenOrders(),
      ])

      setAccount(nextAccount)
      setPositions(nextPositions)
      setOpenOrders(nextOrders)
      setError(null)
      setLastUpdated(new Date())
    } catch (cause) {
      const message =
        cause instanceof IbkrApiError
          ? cause.message
          : cause instanceof Error
            ? cause.message
            : 'Failed to load IBKR data'
      setError(message)
      setAccount(null)
      setPositions([])
      setOpenOrders([])
    } finally {
      setLoading(false)
      setRefreshing(false)
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

  return {
    status,
    account,
    positions,
    openOrders,
    loading,
    refreshing,
    error,
    lastUpdated,
    refresh,
  }
}
