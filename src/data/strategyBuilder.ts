import type {
  BacktestResults,
  EntryRuleOption,
  StrategyConfig,
  StrategyTypeOption,
} from '@/types/strategy'

export const STRATEGY_TYPES: StrategyTypeOption[] = [
  { id: 'momentum', label: 'Momentum', description: 'Follow strong price trends with volume', tag: 'Trend' },
  { id: 'mean_reversion', label: 'Mean Reversion', description: 'Fade extremes back to fair value', tag: 'Counter' },
  { id: 'breakout', label: 'Breakout', description: 'Enter on key level violations', tag: 'Aggressive' },
  { id: 'swing_trading', label: 'Swing Trading', description: 'Multi-day holds on swing setups', tag: 'Medium' },
  { id: 'ai_strategy', label: 'AI Strategy', description: 'ML-driven signal generation', tag: 'AI' },
  { id: 'options_strategy', label: 'Options Strategy', description: 'Defined-risk options structures', tag: 'Derivatives' },
]

export const ENTRY_RULES: EntryRuleOption[] = [
  { id: 'rsi', label: 'RSI', description: 'Relative Strength Index threshold', defaultParams: 'Period: 14 · Buy < 30 · Sell > 70' },
  { id: 'macd', label: 'MACD', description: 'Moving Average Convergence Divergence', defaultParams: '12, 26, 9 · Signal cross' },
  { id: 'ma_cross', label: 'Moving Average Cross', description: 'Golden/death cross detection', defaultParams: 'SMA 20 / SMA 50 cross' },
  { id: 'price_breakout', label: 'Price Breakout', description: 'Break above resistance level', defaultParams: '20-day high + 1% buffer' },
  { id: 'volume_spike', label: 'Volume Spike', description: 'Unusual volume confirmation', defaultParams: 'Volume > 2× 20-day avg' },
]

export const DEFAULT_STRATEGY_CONFIG: StrategyConfig = {
  name: 'Untitled Strategy',
  type: 'momentum',
  entryRules: ['rsi', 'volume_spike'],
  risk: {
    positionSize: 10_000,
    stopLossPercent: 3,
    takeProfitPercent: 8,
    maxDailyLoss: 2_500,
  },
  executionMode: 'paper',
}

export const SAMPLE_BACKTEST: BacktestResults = {
  totalReturn: 24_680,
  totalReturnPercent: 24.68,
  winRate: 64.2,
  profitFactor: 1.87,
  maxDrawdown: 8.4,
  totalTrades: 156,
  sharpeRatio: 1.64,
  avgWin: 412,
  avgLoss: 218,
  equityCurve: [
    { date: '2025-07', value: 100_000 },
    { date: '2025-08', value: 102_400 },
    { date: '2025-09', value: 101_200 },
    { date: '2025-10', value: 105_800 },
    { date: '2025-11', value: 108_600 },
    { date: '2025-12', value: 107_100 },
    { date: '2026-01', value: 112_400 },
    { date: '2026-02', value: 115_200 },
    { date: '2026-03', value: 118_900 },
    { date: '2026-04', value: 121_500 },
    { date: '2026-05', value: 123_800 },
    { date: '2026-06', value: 124_680 },
  ],
}
