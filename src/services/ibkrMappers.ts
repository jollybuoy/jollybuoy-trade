import type { Position } from '@/types'
import type { IbkrAccount, IbkrOpenOrder, IbkrPosition } from '@/types/ibkr'
import type { PaperAccountSummary, PaperPositionRow } from '@/types/paperTrading'
import type { PortfolioHolding, PortfolioSummary } from '@/types/portfolio'

export function mapIbkrAccountToPortfolioSummary(account: IbkrAccount): PortfolioSummary {
  const investedValue = Math.max(account.netLiquidation - account.totalCashValue, 0)
  const costBasis = investedValue - account.unrealizedPnL
  const unrealizedPnLPercent = costBasis > 0 ? (account.unrealizedPnL / costBasis) * 100 : 0

  return {
    totalValue: account.netLiquidation,
    cashBalance: account.totalCashValue,
    investedValue,
    unrealizedPnL: account.unrealizedPnL,
    unrealizedPnLPercent,
    realizedPnL: account.realizedPnL,
    dayChangePercent: 0,
    dayChange: 0,
  }
}

export function mapIbkrAccountToPaperSummary(
  account: IbkrAccount,
  openPositions: number,
): PaperAccountSummary {
  return {
    equity: account.netLiquidation,
    cashBalance: account.totalCashValue,
    buyingPower: account.buyingPower,
    dayPnL: account.unrealizedPnL + account.realizedPnL,
    dayPnLPercent: 0,
    openPositions,
    marginUsed: Math.max(account.netLiquidation - account.excessLiquidity, 0),
  }
}

export function mapIbkrPositionToPortfolioHolding(
  position: IbkrPosition,
  index: number,
): PortfolioHolding {
  return {
    id: `${position.symbol}-${index}`,
    symbol: position.symbol,
    company: position.symbol,
    quantity: Math.abs(position.quantity),
    avgCost: position.averageCost,
    currentPrice: position.marketPrice,
    sector: position.exchange || position.secType,
    assetClass: position.secType,
  }
}

export function mapIbkrPositionToDashboardPosition(position: IbkrPosition): Position {
  return {
    symbol: position.symbol,
    name: position.symbol,
    shares: Math.abs(position.quantity),
    avgCost: position.averageCost,
    currentPrice: position.marketPrice,
    sector: position.secType,
  }
}

export function mapIbkrPositionToPaperRow(position: IbkrPosition, index: number): PaperPositionRow {
  return {
    id: `${position.symbol}-${index}`,
    symbol: position.symbol,
    name: position.symbol,
    quantity: Math.abs(position.quantity),
    avgPrice: position.averageCost,
    currentPrice: position.marketPrice,
  }
}

export function formatIbkrCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${value.toFixed(2)} ${currency}`
  }
}

export function getIbkrDisconnectedMessage(error?: string | null): string {
  if (error) return error
  return 'Open IB Gateway and login to Paper Trading, then click Refresh.'
}

export type { IbkrOpenOrder }
