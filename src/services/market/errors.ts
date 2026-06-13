export type MarketDataErrorCode =
  | 'unavailable'
  | 'rate_limit'
  | 'symbol_not_found'
  | 'unknown'

export class MarketDataError extends Error {
  readonly code: MarketDataErrorCode
  readonly symbol?: string
  readonly statusCode?: number

  constructor(
    message: string,
    code: MarketDataErrorCode,
    options?: { symbol?: string; statusCode?: number; cause?: unknown },
  ) {
    super(message, { cause: options?.cause })
    this.name = 'MarketDataError'
    this.code = code
    this.symbol = options?.symbol
    this.statusCode = options?.statusCode
  }
}

export class MarketDataUnavailableError extends MarketDataError {
  constructor(message = 'Market data API is unavailable', options?: { cause?: unknown; statusCode?: number }) {
    super(message, 'unavailable', options)
    this.name = 'MarketDataUnavailableError'
  }
}

export class MarketDataRateLimitError extends MarketDataError {
  constructor(message = 'Market data rate limit exceeded. Try again shortly.', options?: { cause?: unknown }) {
    super(message, 'rate_limit', options)
    this.name = 'MarketDataRateLimitError'
  }
}

export class MarketDataSymbolNotFoundError extends MarketDataError {
  constructor(symbol: string, message?: string) {
    super(message ?? `Symbol not found: ${symbol}`, 'symbol_not_found', { symbol })
    this.name = 'MarketDataSymbolNotFoundError'
  }
}

export function toMarketDataError(error: unknown, symbol?: string): MarketDataError {
  if (error instanceof MarketDataError) return error

  if (error instanceof TypeError && /fetch|network/i.test(error.message)) {
    return new MarketDataUnavailableError('Unable to reach market data API', { cause: error })
  }

  return new MarketDataError(
    error instanceof Error ? error.message : 'Unknown market data error',
    'unknown',
    { symbol, cause: error },
  )
}

export function getMarketDataErrorMessage(error: MarketDataError): string {
  switch (error.code) {
    case 'rate_limit':
      return 'Market data rate limit reached. Quotes will retry automatically.'
    case 'symbol_not_found':
      return error.symbol
        ? `${error.symbol} is not available from the market data provider.`
        : 'One or more symbols could not be found.'
    case 'unavailable':
      return 'Live market data is temporarily unavailable.'
    default:
      return error.message
  }
}
