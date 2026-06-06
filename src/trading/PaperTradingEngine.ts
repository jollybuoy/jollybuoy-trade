import type { MarketDataService } from '@/services/market/MarketDataService'
import type { RiskEngine } from '@/risk/RiskEngine'
import type {
  CreateOrderInput,
  PaperAccountState,
  PaperOrder,
  PaperPosition,
  PaperTrade,
} from '@/trading/types'

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Simulated brokerage account for strategy validation before IBKR live routing.
 * State is in-memory; future: persist orders/positions to Supabase `paper_*` tables.
 */
export class PaperTradingEngine {
  private orders: PaperOrder[] = []
  private positions: PaperPosition[] = []
  private trades: PaperTrade[] = []
  private marketData: MarketDataService
  private account: PaperAccountState
  private risk?: RiskEngine

  constructor(
    marketData: MarketDataService,
    account: PaperAccountState = {
      cashBalance: 100_000,
      initialCash: 100_000,
      dailyRealizedPnL: 0,
    },
    risk?: RiskEngine,
  ) {
    this.marketData = marketData
    this.account = account
    this.risk = risk
  }

  getAccountState(): PaperAccountState {
    return { ...this.account }
  }

  createOrder(input: CreateOrderInput): PaperOrder {
    const order: PaperOrder = {
      id: generateId('ord'),
      symbol: input.symbol.toUpperCase(),
      side: input.side,
      quantity: input.quantity,
      orderType: input.orderType ?? 'MARKET',
      status: 'pending',
      strategyId: input.strategyId,
      createdAt: new Date().toISOString(),
    }
    this.orders.unshift(order)
    return order
  }

  async executeOrder(orderId: string): Promise<PaperOrder> {
    const order = this.orders.find((o) => o.id === orderId)
    if (!order) throw new Error(`Order not found: ${orderId}`)
    if (order.status !== 'pending') throw new Error(`Order ${orderId} is not pending`)

    const quote = await this.marketData.getQuote(order.symbol)
    const fillPrice = quote.currentPrice
    const notional = fillPrice * order.quantity

    if (this.risk) {
      const validation = this.risk.validateTrade({
        order: {
          symbol: order.symbol,
          side: order.side,
          quantity: order.quantity,
          orderType: 'MARKET',
          strategyId: order.strategyId,
        },
        context: {
          limits: this.risk.getLimits(),
          dailyRealizedPnL: this.account.dailyRealizedPnL,
          openPositionCount: this.getOpenPositions().length,
          orderNotional: notional,
        },
      })

      if (validation.decision === 'Rejected') {
        order.status = 'rejected'
        return order
      }
    }

    if (order.side === 'BUY' && notional > this.account.cashBalance) {
      order.status = 'rejected'
      return order
    }

    order.status = 'filled'
    order.filledAt = new Date().toISOString()
    order.fillPrice = fillPrice

    if (order.side === 'BUY') {
      this.account.cashBalance -= notional
      this.openOrAddPosition(order, fillPrice)
      this.recordTrade(order, fillPrice)
    } else {
      this.closePositionBySymbol(order.symbol, order.quantity, fillPrice, order.strategyId)
      this.account.cashBalance += notional
      this.recordTrade(order, fillPrice)
    }

    return order
  }

  async closePosition(positionId: string): Promise<PaperPosition> {
    const position = this.positions.find((p) => p.id === positionId && p.status === 'open')
    if (!position) throw new Error(`Open position not found: ${positionId}`)

    const quote = await this.marketData.getQuote(position.symbol)
    const exitPrice = quote.currentPrice
    position.exitPrice = exitPrice
    position.status = 'closed'
    position.closedAt = new Date().toISOString()
    position.realizedPnL = (exitPrice - position.entryPrice) * position.quantity
    position.unrealizedPnL = 0
    this.account.cashBalance += exitPrice * position.quantity
    this.account.dailyRealizedPnL += position.realizedPnL

    this.trades.unshift({
      id: generateId('trd'),
      orderId: 'manual_close',
      symbol: position.symbol,
      side: 'SELL',
      quantity: position.quantity,
      entryPrice: position.entryPrice,
      exitPrice,
      pnl: position.realizedPnL,
      status: 'closed',
      timestamp: new Date().toISOString(),
      strategyId: position.strategyId,
    })

    return position
  }

  getOpenPositions(): PaperPosition[] {
    return this.positions.filter((p) => p.status === 'open').map((p) => ({ ...p }))
  }

  getTradeHistory(): PaperTrade[] {
    return [...this.trades]
  }

  getOrders(): PaperOrder[] {
    return [...this.orders]
  }

  private openOrAddPosition(order: PaperOrder, fillPrice: number): PaperPosition {
    const existing = this.positions.find(
      (p) => p.symbol === order.symbol && p.status === 'open',
    )

    if (existing) {
      const totalQty = existing.quantity + order.quantity
      existing.entryPrice =
        (existing.entryPrice * existing.quantity + fillPrice * order.quantity) / totalQty
      existing.quantity = totalQty
      return existing
    }

    const position: PaperPosition = {
      id: generateId('pos'),
      symbol: order.symbol,
      quantity: order.quantity,
      entryPrice: fillPrice,
      exitPrice: null,
      status: 'open',
      openedAt: new Date().toISOString(),
      unrealizedPnL: 0,
      realizedPnL: null,
      strategyId: order.strategyId,
    }
    this.positions.unshift(position)
    return position
  }

  private closePositionBySymbol(
    symbol: string,
    quantity: number,
    exitPrice: number,
    strategyId?: string,
  ) {
    const position = this.positions.find((p) => p.symbol === symbol && p.status === 'open')
    if (!position) return

    const closeQty = Math.min(quantity, position.quantity)
    const pnl = (exitPrice - position.entryPrice) * closeQty
    this.account.dailyRealizedPnL += pnl

    if (closeQty >= position.quantity) {
      position.status = 'closed'
      position.exitPrice = exitPrice
      position.closedAt = new Date().toISOString()
      position.realizedPnL = pnl
      position.unrealizedPnL = 0
    } else {
      position.quantity -= closeQty
      position.realizedPnL = (position.realizedPnL ?? 0) + pnl
    }

    this.trades.unshift({
      id: generateId('trd'),
      orderId: 'partial_close',
      symbol,
      side: 'SELL',
      quantity: closeQty,
      entryPrice: position.entryPrice,
      exitPrice,
      pnl,
      status: closeQty >= position.quantity ? 'closed' : 'open',
      timestamp: new Date().toISOString(),
      strategyId: strategyId ?? position.strategyId,
    })
  }

  private recordTrade(order: PaperOrder, fillPrice: number) {
    this.trades.unshift({
      id: generateId('trd'),
      orderId: order.id,
      symbol: order.symbol,
      side: order.side,
      quantity: order.quantity,
      entryPrice: fillPrice,
      exitPrice: order.side === 'SELL' ? fillPrice : null,
      pnl: null,
      status: order.side === 'BUY' ? 'open' : 'closed',
      timestamp: order.filledAt ?? new Date().toISOString(),
      strategyId: order.strategyId,
    })
  }
}
