import { BacktestEngine } from '@/backtesting/BacktestEngine'
import { IBKRBroker } from '@/brokers/IBKRBroker'
import { RiskEngine } from '@/risk/RiskEngine'
import { MarketDataService } from '@/services/market/MarketDataService'
import { StrategyRegistry } from '@/strategies/StrategyRegistry'
import { PaperTradingEngine } from '@/trading/PaperTradingEngine'

/**
 * Composition root for JollyBuoy Trade backend services.
 * UI pages use live Yahoo Finance quotes via hooks; paper engine uses MarketDataService.
 *
 * Future:
 * - Supabase Edge Functions orchestrate Python strategy workers
 * - IBKRBroker connects to IB Gateway sidecar
 * - MarketDataService switches from mock → Yahoo → IBKR streaming
 */
export interface TradingPlatform {
  marketData: MarketDataService
  strategies: StrategyRegistry
  paperTrading: PaperTradingEngine
  backtesting: BacktestEngine
  risk: RiskEngine
  broker: IBKRBroker
}

export function createTradingPlatform(): TradingPlatform {
  const marketData = new MarketDataService()
  const risk = new RiskEngine()
  const paperTrading = new PaperTradingEngine(marketData, undefined, risk)

  return {
    marketData,
    strategies: new StrategyRegistry(),
    paperTrading,
    backtesting: new BacktestEngine(marketData),
    risk,
    broker: new IBKRBroker(),
  }
}

/** Process-wide default platform for gradual UI integration. */
export const tradingPlatform = createTradingPlatform()
