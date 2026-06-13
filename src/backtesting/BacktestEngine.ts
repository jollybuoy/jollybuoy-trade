import type { MarketDataService } from '@/services/market/MarketDataService'
import type { StrategyContext } from '@/strategies/types'
import type { BacktestRunInput, BacktestRunResult, SimulatedTrade } from '@/backtesting/types'

/**
 * Bar-by-bar backtest simulator.
 * Uses MarketDataService historical bars — swap provider for live Yahoo/IBKR data later.
 */
export class BacktestEngine {
  private marketData: MarketDataService

  constructor(marketData: MarketDataService) {
    this.marketData = marketData
  }

  async runBacktest(input: BacktestRunInput): Promise<BacktestRunResult> {
    const { strategy, symbol, startDate, endDate, initialCapital } = input
    const positionSizePct = input.positionSizePct ?? 0.1

    const historical = await this.marketData.getHistoricalData(symbol, startDate, endDate)
    const bars = historical.bars

    if (bars.length < 2) {
      throw new Error('Insufficient historical data for backtest')
    }

    let cash = initialCapital
    let shares = 0
    let entryPrice = 0
    let peakEquity = initialCapital
    let maxDrawdown = 0
    const equityCurve: { date: string; equity: number }[] = []
    const simulatedTrades: SimulatedTrade[] = []

    for (let i = 1; i < bars.length; i++) {
      const context: StrategyContext = { symbol, bars, index: i }
      const { signal } = strategy.generateSignal(context)
      const bar = bars[i]
      const price = bar.close

      if (signal === 'BUY' && shares === 0) {
        const allocation = cash * positionSizePct
        const qty = Math.floor(allocation / price)
        if (qty > 0) {
          shares = qty
          entryPrice = price
          cash -= qty * price
        }
      } else if (signal === 'SELL' && shares > 0) {
        const proceeds = shares * price
        const pnl = (price - entryPrice) * shares
        simulatedTrades.push({
          entryDate: bars[i - 1]?.date ?? bar.date,
          exitDate: bar.date,
          entryPrice,
          exitPrice: price,
          quantity: shares,
          pnl,
          returnPercent: entryPrice > 0 ? (pnl / (entryPrice * shares)) * 100 : 0,
        })
        cash += proceeds
        shares = 0
        entryPrice = 0
      }

      const equity = cash + shares * price
      equityCurve.push({ date: bar.date, equity })

      if (equity > peakEquity) peakEquity = equity
      const drawdown = peakEquity - equity
      if (drawdown > maxDrawdown) maxDrawdown = drawdown
    }

    const finalBar = bars[bars.length - 1]
    const finalCapital = cash + shares * finalBar.close
    const totalReturn = finalCapital - initialCapital
    const wins = simulatedTrades.filter((t) => t.pnl > 0).length

    return {
      symbol: symbol.toUpperCase(),
      strategyId: strategy.id,
      startDate,
      endDate,
      initialCapital,
      finalCapital,
      totalReturn,
      totalReturnPercent: initialCapital > 0 ? (totalReturn / initialCapital) * 100 : 0,
      winRate: simulatedTrades.length > 0 ? (wins / simulatedTrades.length) * 100 : 0,
      totalTrades: simulatedTrades.length,
      maxDrawdown,
      maxDrawdownPercent: peakEquity > 0 ? (maxDrawdown / peakEquity) * 100 : 0,
      equityCurve,
    }
  }
}
