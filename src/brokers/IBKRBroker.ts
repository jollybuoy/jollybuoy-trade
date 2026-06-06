import type {
  Broker,
  BrokerAccount,
  BrokerConnectOptions,
  BrokerConnectionStatus,
  BrokerOrder,
  BrokerOrderRequest,
  BrokerPosition,
} from '@/brokers/types'

/**
 * Mock Interactive Brokers adapter.
 *
 * Future IBKR integration path:
 * 1. Python `ib_insync` or Node `ib` service listens on IB Gateway (port 4002 paper / 4001 live)
 * 2. This class becomes a thin client over WebSocket/REST to that service
 * 3. `placeOrder` maps to IBKR Order objects with contract resolution (symbol → conId)
 * 4. Fill events stream back into PaperTradingEngine or Supabase `live_orders` table
 * 5. RiskEngine validates before `placeOrder` is forwarded to IBKR
 */
export class IBKRBroker implements Broker {
  readonly name = 'Interactive Brokers'

  private status: BrokerConnectionStatus = 'disconnected'
  private account: BrokerAccount | null = null
  private positions: BrokerPosition[] = []
  private orders: BrokerOrder[] = []

  getStatus(): BrokerConnectionStatus {
    return this.status
  }

  async connect(options: BrokerConnectOptions = {}): Promise<void> {
    this.status = 'connecting'

    // Simulate Gateway handshake delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    this.account = {
      accountId: options.accountId ?? 'DU1234567',
      netLiquidation: 108_420.5,
      cashBalance: 45_230,
      buyingPower: 90_460,
      currency: 'USD',
    }

    this.positions = [
      {
        symbol: 'NVDA',
        quantity: 45,
        avgCost: 680.5,
        marketValue: 40_146.3,
        unrealizedPnL: 9_513.3,
      },
      {
        symbol: 'AAPL',
        quantity: 150,
        avgCost: 178.42,
        marketValue: 29_380.5,
        unrealizedPnL: 2_617.5,
      },
    ]

    this.status = 'connected'
  }

  async disconnect(): Promise<void> {
    this.status = 'disconnected'
    this.account = null
    this.positions = []
  }

  async placeOrder(request: BrokerOrderRequest): Promise<BrokerOrder> {
    if (this.status !== 'connected') {
      throw new Error('IBKRBroker not connected. Call connect() first.')
    }

    const order: BrokerOrder = {
      id: `ibkr_${Date.now()}`,
      symbol: request.symbol.toUpperCase(),
      side: request.side,
      quantity: request.quantity,
      orderType: request.orderType ?? 'MARKET',
      status: 'filled',
      submittedAt: new Date().toISOString(),
      filledAt: new Date().toISOString(),
      avgFillPrice: 100 + Math.random() * 400,
    }

    this.orders.unshift(order)
    return order
  }

  async cancelOrder(orderId: string): Promise<void> {
    const order = this.orders.find((o) => o.id === orderId)
    if (order && order.status === 'submitted') {
      order.status = 'cancelled'
    }
  }

  async getPositions(): Promise<BrokerPosition[]> {
    if (this.status !== 'connected') {
      throw new Error('IBKRBroker not connected')
    }
    return [...this.positions]
  }

  async getAccount(): Promise<BrokerAccount> {
    if (!this.account) {
      throw new Error('IBKRBroker not connected')
    }
    return { ...this.account }
  }
}

export const ibkrBroker = new IBKRBroker()
