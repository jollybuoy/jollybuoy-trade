import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  MarketDataError,
  getMarketDataErrorMessage,
  toMarketDataError,
} from '@/services/market/errors'
import { marketDataService } from '@/services/market/MarketDataService'
import type { Quote } from '@/services/market/types'

export interface UseMarketQuotesOptions {
  refreshIntervalMs?: number
  enabled?: boolean
}

export interface UseMarketQuotesResult {
  quotes: Quote[]
  quotesBySymbol: Map<string, Quote>
  loading: boolean
  refreshing: boolean
  error: MarketDataError | null
  symbolErrors: MarketDataError[]
  errorMessage: string | null
  lastUpdated: Date | null
  refresh: () => Promise<void>
}

export function useMarketQuotes(
  symbols: string[],
  options: UseMarketQuotesOptions = {},
): UseMarketQuotesResult {
  const { refreshIntervalMs = 60_000, enabled = true } = options
  const normalizedSymbols = useMemo(
    () => [...new Set(symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean))],
    [symbols],
  )
  const symbolKey = normalizedSymbols.join(',')

  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(enabled && normalizedSymbols.length > 0)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<MarketDataError | null>(null)
  const [symbolErrors, setSymbolErrors] = useState<MarketDataError[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const hasLoadedRef = useRef(false)

  const refresh = useCallback(async () => {
    if (!enabled || normalizedSymbols.length === 0) {
      setQuotes([])
      setLoading(false)
      setRefreshing(false)
      setError(null)
      setSymbolErrors([])
      return
    }

    const isInitialLoad = !hasLoadedRef.current
    if (isInitialLoad) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    try {
      const results = await Promise.allSettled(
        normalizedSymbols.map((symbol) => marketDataService.getQuote(symbol)),
      )

      const nextQuotes: Quote[] = []
      const nextSymbolErrors: MarketDataError[] = []

      results.forEach((result, index) => {
        const symbol = normalizedSymbols[index]
        if (result.status === 'fulfilled') {
          nextQuotes.push(result.value)
          return
        }
        nextSymbolErrors.push(toMarketDataError(result.reason, symbol))
      })

      setQuotes(nextQuotes)
      setSymbolErrors(nextSymbolErrors)
      setLastUpdated(new Date())
      hasLoadedRef.current = true

      if (nextQuotes.length === 0) {
        setError(nextSymbolErrors[0] ?? new MarketDataError('No quotes returned', 'unknown'))
      } else {
        setError(null)
      }
    } catch (cause) {
      const nextError = toMarketDataError(cause)
      setError(nextError)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [enabled, symbolKey, normalizedSymbols])

  useEffect(() => {
    hasLoadedRef.current = false
    setQuotes([])
    setError(null)
    setSymbolErrors([])
    setLastUpdated(null)
  }, [symbolKey, enabled])

  useEffect(() => {
    void refresh()
    if (!enabled || refreshIntervalMs <= 0) return undefined

    const timer = window.setInterval(() => {
      void refresh()
    }, refreshIntervalMs)

    return () => window.clearInterval(timer)
  }, [refresh, refreshIntervalMs, enabled])

  const quotesBySymbol = useMemo(
    () => new Map(quotes.map((quote) => [quote.symbol.toUpperCase(), quote])),
    [quotes],
  )

  const errorMessage = error ? getMarketDataErrorMessage(error) : null

  return {
    quotes,
    quotesBySymbol,
    loading,
    refreshing,
    error,
    symbolErrors,
    errorMessage,
    lastUpdated,
    refresh,
  }
}
