import { MEGA_CAP_7_SYMBOLS } from '@/data/megaCap7'
import type {
  BacktestResults,
  ConditionOption,
  CreateStrategyForm,
  DeployedStrategy,
  StrategyTypeOption,
} from '@/types/strategy'

export const DEPLOYED_STRATEGIES: DeployedStrategy[] = []

export const SYMBOL_OPTIONS = [...MEGA_CAP_7_SYMBOLS]

export const STRATEGY_TYPE_OPTIONS: StrategyTypeOption[] = [
  { id: 'ai_momentum', label: 'AI Momentum' },
  { id: 'mean_reversion', label: 'Mean Reversion' },
  { id: 'breakout', label: 'Breakout' },
  { id: 'momentum', label: 'Momentum Scalper' },
]

export const ENTRY_CONDITIONS: ConditionOption[] = [
  { id: 'rsi_oversold', label: 'RSI < 30 (Oversold)' },
  { id: 'macd_cross', label: 'MACD Bullish Cross' },
  { id: 'ma_golden', label: 'SMA 20/50 Golden Cross' },
  { id: 'price_breakout', label: '20-Day High Breakout' },
  { id: 'volume_spike', label: 'Volume > 2× Average' },
  { id: 'ai_signal', label: 'AI Confidence > 80%' },
]

export const EXIT_CONDITIONS: ConditionOption[] = [
  { id: 'rsi_overbought', label: 'RSI > 70 (Overbought)' },
  { id: 'macd_bearish', label: 'MACD Bearish Cross' },
  { id: 'stop_loss', label: 'Stop Loss Hit' },
  { id: 'take_profit', label: 'Take Profit Target' },
  { id: 'trailing_stop', label: 'Trailing Stop Triggered' },
  { id: 'time_exit', label: 'End of Session Exit' },
]

export const DEFAULT_CREATE_FORM: CreateStrategyForm = {
  name: '',
  symbol: 'AAPL',
  type: 'ai_momentum',
  entryCondition: 'rsi_oversold',
  exitCondition: 'take_profit',
  stopLossPercent: 3,
  takeProfitPercent: 8,
  maxPositionSize: 10_000,
  maxDailyLoss: 2_500,
}

export const SAMPLE_BACKTEST: BacktestResults = {
  totalReturn: 24_680,
  totalReturnPercent: 24.68,
  winRate: 64.2,
  profitFactor: 1.87,
  maxDrawdown: 8.4,
  totalTrades: 156,
  equityCurve: [
    { date: 'Jul', value: 100_000 },
    { date: 'Aug', value: 102_400 },
    { date: 'Sep', value: 101_200 },
    { date: 'Oct', value: 105_800 },
    { date: 'Nov', value: 108_600 },
    { date: 'Dec', value: 107_100 },
    { date: 'Jan', value: 112_400 },
    { date: 'Feb', value: 115_200 },
    { date: 'Mar', value: 118_900 },
    { date: 'Apr', value: 121_500 },
    { date: 'May', value: 123_800 },
    { date: 'Jun', value: 124_680 },
  ],
}
