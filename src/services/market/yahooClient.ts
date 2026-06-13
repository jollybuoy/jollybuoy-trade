import {
  MarketDataRateLimitError,
  MarketDataSymbolNotFoundError,
  MarketDataUnavailableError,
} from '@/services/market/errors'

const DEFAULT_BASE_URL = '/api/yahoo'

export function getYahooFinanceBaseUrl(): string {
  const configured = import.meta.env.VITE_YAHOO_FINANCE_BASE_URL?.trim()
  return configured && configured.length > 0 ? configured.replace(/\/$/, '') : DEFAULT_BASE_URL
}

interface YahooChartResult {
  meta?: {
    symbol?: string
    regularMarketPrice?: number
    chartPreviousClose?: number
    previousClose?: number
    regularMarketVolume?: number
    marketCap?: number
  }
  timestamp?: number[]
  indicators?: {
    quote?: Array<{
      open?: Array<number | null>
      high?: Array<number | null>
      low?: Array<number | null>
      close?: Array<number | null>
      volume?: Array<number | null>
    }>
  }
}

interface YahooChartResponse {
  chart?: {
    error?: { code?: string; description?: string }
    result?: YahooChartResult[] | null
  }
}

export async function fetchYahooChart(symbol: string, query: string): Promise<YahooChartResult> {
  const baseUrl = getYahooFinanceBaseUrl()
  const url = `${baseUrl}/v8/finance/chart/${encodeURIComponent(symbol.toUpperCase())}?${query}`

  let response: Response
  try {
    response = await fetch(url)
  } catch (error) {
    throw new MarketDataUnavailableError('Unable to reach Yahoo Finance', { cause: error })
  }

  if (response.status === 429) {
    throw new MarketDataRateLimitError()
  }

  if (!response.ok) {
    throw new MarketDataUnavailableError(`Yahoo Finance request failed (${response.status})`, {
      statusCode: response.status,
    })
  }

  let payload: YahooChartResponse
  try {
    payload = (await response.json()) as YahooChartResponse
  } catch (error) {
    throw new MarketDataUnavailableError('Invalid response from Yahoo Finance', { cause: error })
  }

  const chartError = payload.chart?.error
  if (chartError) {
    if (chartError.code === 'Not Found') {
      throw new MarketDataSymbolNotFoundError(symbol.toUpperCase(), chartError.description)
    }
    throw new MarketDataUnavailableError(chartError.description ?? 'Yahoo Finance chart error')
  }

  const result = payload.chart?.result?.[0]
  if (!result?.meta?.regularMarketPrice) {
    throw new MarketDataSymbolNotFoundError(symbol.toUpperCase())
  }

  return result
}
