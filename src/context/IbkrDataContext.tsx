import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  connectIbkrAccount,
  disconnectIbkrAccount,
  getIbkrAccount,
  getIbkrExecutions,
  getIbkrOpenOrders,
  getIbkrPositions,
  getIbkrStatus,
} from '@/services/ibkrApi'
import { getIbkrBackendMessage } from '@/services/ibkrEnv'
import { loadAccountSettings, saveAccountSettings } from '@/lib/settingsStorage'
import type { IbkrAccountMode } from '@/types/settings'
import type {
  IbkrAccount,
  IbkrExecution,
  IbkrOpenOrder,
  IbkrPosition,
  IbkrStatus,
} from '@/types/ibkr'

export interface UseIbkrDataOptions {
  enabled?: boolean
  refreshIntervalMs?: number
}

export interface UseIbkrDataResult {
  status: IbkrStatus | null
  account: IbkrAccount | null
  positions: IbkrPosition[]
  openOrders: IbkrOpenOrder[]
  executions: IbkrExecution[]
  loading: boolean
  error: string | null
  connected: boolean
  accountId: string | null
  lastUpdated: Date | null
  refresh: () => Promise<void>
  connectBroker: (mode: IbkrAccountMode) => Promise<IbkrStatus>
  disconnectBroker: () => Promise<void>
}

const IbkrDataContext = createContext<UseIbkrDataResult | null>(null)

function resolveAccountId(status: IbkrStatus | null, account: IbkrAccount | null): string | null {
  return account?.accountId ?? status?.account ?? null
}

function useIbkrDataInternal(options: UseIbkrDataOptions = {}): UseIbkrDataResult {
  const { enabled = true, refreshIntervalMs = 30_000 } = options

  const [status, setStatus] = useState<IbkrStatus | null>(null)
  const [account, setAccount] = useState<IbkrAccount | null>(null)
  const [positions, setPositions] = useState<IbkrPosition[]>([])
  const [openOrders, setOpenOrders] = useState<IbkrOpenOrder[]>([])
  const [executions, setExecutions] = useState<IbkrExecution[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const restoredRef = useRef(false)

  const refresh = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const nextStatus = await getIbkrStatus()
      setStatus(nextStatus)

      const statusAccountId = nextStatus.account
      if (!nextStatus.connected || !statusAccountId) {
        setAccount(null)
        setPositions([])
        setOpenOrders([])
        setExecutions([])
        setError(getIbkrBackendMessage(nextStatus.error, nextStatus.errorCode))
        return
      }

      const [nextAccount, nextPositions, nextOrders, nextExecutions] = await Promise.all([
        getIbkrAccount(),
        getIbkrPositions(),
        getIbkrOpenOrders(),
        getIbkrExecutions(),
      ])

      setAccount(nextAccount)
      setPositions(nextPositions)
      setOpenOrders(nextOrders)
      setExecutions(nextExecutions)
      setError(nextAccount ? null : getIbkrBackendMessage())
      setLastUpdated(new Date())
    } catch {
      setStatus(null)
      setAccount(null)
      setPositions([])
      setOpenOrders([])
      setExecutions([])
      setError(getIbkrBackendMessage())
    } finally {
      setLoading(false)
    }
  }, [enabled])

  const connectBroker = useCallback(
    async (mode: IbkrAccountMode) => {
      const nextStatus = await connectIbkrAccount(mode)
      setStatus(nextStatus)

      const saved = loadAccountSettings()
      saveAccountSettings({
        ...saved,
        brokerSession: { linked: true, linkedMode: mode },
        tradingMode: {
          ...saved.tradingMode,
          activeMode: mode,
          paperModeActive: mode === 'paper',
        },
      })

      await refresh()
      return nextStatus
    },
    [refresh],
  )

  const disconnectBroker = useCallback(async () => {
    const nextStatus = await disconnectIbkrAccount()
    setStatus(nextStatus)
    setAccount(null)
    setPositions([])
    setOpenOrders([])
    setExecutions([])
    setLastUpdated(null)

    const saved = loadAccountSettings()
    saveAccountSettings({
      ...saved,
      brokerSession: { linked: false, linkedMode: null },
    })

    setError(getIbkrBackendMessage(nextStatus.error, nextStatus.errorCode))
  }, [])

  useEffect(() => {
    if (restoredRef.current) return
    restoredRef.current = true

    const restore = async () => {
      const saved = loadAccountSettings()
      if (saved.brokerSession.linked && saved.brokerSession.linkedMode) {
        try {
          await connectIbkrAccount(saved.brokerSession.linkedMode)
        } catch {
          // refresh surfaces gateway errors
        }
      }
      await refresh()
    }

    void restore()
  }, [refresh])

  useEffect(() => {
    if (!enabled || refreshIntervalMs <= 0) return undefined

    const timer = window.setInterval(() => {
      void refresh()
    }, refreshIntervalMs)

    return () => window.clearInterval(timer)
  }, [enabled, refreshIntervalMs, refresh])

  const accountId = resolveAccountId(status, account)
  const connected = Boolean(status?.connected && accountId)

  return useMemo(
    () => ({
      status,
      account,
      positions,
      openOrders,
      executions,
      loading,
      error,
      connected,
      accountId,
      lastUpdated,
      refresh,
      connectBroker,
      disconnectBroker,
    }),
    [
      status,
      account,
      positions,
      openOrders,
      executions,
      loading,
      error,
      connected,
      accountId,
      lastUpdated,
      refresh,
      connectBroker,
      disconnectBroker,
    ],
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
