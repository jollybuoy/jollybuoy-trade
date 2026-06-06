import { MovingAverageCrossStrategy } from '@/strategies/MovingAverageCrossStrategy'
import { MomentumStrategy } from '@/strategies/MomentumStrategy'
import { RsiStrategy } from '@/strategies/RsiStrategy'
import type { Strategy, StrategyDefinition } from '@/strategies/types'

export const STRATEGY_DEFINITIONS: StrategyDefinition[] = [
  {
    id: 'rsi',
    name: 'RSI Strategy',
    description: 'Mean reversion using RSI oversold/overbought levels.',
    riskLevel: 'medium',
    create: () => new RsiStrategy(),
  },
  {
    id: 'ma_cross',
    name: 'Moving Average Cross',
    description: 'Trend following via 50/200 moving average crossover.',
    riskLevel: 'low',
    create: () => new MovingAverageCrossStrategy(),
  },
  {
    id: 'momentum',
    name: 'Momentum Strategy',
    description: 'Breakout above 20-day high, exit below 10-day low.',
    riskLevel: 'high',
    create: () => new MomentumStrategy(),
  },
]

export class StrategyRegistry {
  private readonly definitions = new Map<string, StrategyDefinition>(
    STRATEGY_DEFINITIONS.map((d) => [d.id, d]),
  )

  list(): StrategyDefinition[] {
    return [...this.definitions.values()]
  }

  get(id: string): StrategyDefinition | undefined {
    return this.definitions.get(id)
  }

  create(id: string): Strategy {
    const definition = this.definitions.get(id)
    if (!definition) {
      throw new Error(`Unknown strategy: ${id}`)
    }
    return definition.create()
  }

  /** Register custom strategies at runtime (e.g. user-defined rules from Supabase). */
  register(definition: StrategyDefinition) {
    this.definitions.set(definition.id, definition)
  }
}

export const strategyRegistry = new StrategyRegistry()
