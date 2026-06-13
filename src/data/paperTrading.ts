import type {
  PaperAccountSummary,
  PaperBotState,
  PaperPositionRow,
  PaperTradeRecord,
} from '@/types/paperTrading'
import { MEGA_CAP_7_STOCKS, MEGA_CAP_7_SYMBOLS } from '@/data/megaCap7'

export const PAPER_ACCOUNT: PaperAccountSummary = {
  equity: 108_420.5,
  cashBalance: 45_230,
  buyingPower: 87_550,
  dayPnL: 842.18,
  dayPnLPercent: 0.78,
  openPositions: 4,
  marginUsed: 12_450,
}

export const PAPER_POSITIONS: PaperPositionRow[] = [
  {
    id: 'pos-1',
    symbol: 'TSLA',
    name: MEGA_CAP_7_STOCKS.TSLA.company,
    quantity: 25,
    avgPrice: 238.5,
    currentPrice: 0,
  },
  {
    id: 'pos-2',
    symbol: 'NVDA',
    name: MEGA_CAP_7_STOCKS.NVDA.company,
    quantity: 10,
    avgPrice: 850,
    currentPrice: 0,
  },
  {
    id: 'pos-3',
    symbol: 'AAPL',
    name: MEGA_CAP_7_STOCKS.AAPL.company,
    quantity: 40,
    avgPrice: 192.45,
    currentPrice: 0,
  },
  {
    id: 'pos-4',
    symbol: 'MSFT',
    name: MEGA_CAP_7_STOCKS.MSFT.company,
    quantity: 20,
    avgPrice: 405,
    currentPrice: 0,
  },
]

export const PAPER_TRADE_HISTORY: PaperTradeRecord[] = [
  {
    id: 'pt-1',
    timestamp: '2026-06-06T10:15:00Z',
    symbol: 'TSLA',
    side: 'buy',
    quantity: 25,
    entryPrice: 245.18,
    exitPrice: null,
    pnl: null,
    strategy: 'Manual',
  },
  {
    id: 'pt-2',
    timestamp: '2026-06-06T09:45:00Z',
    symbol: 'MSFT',
    side: 'sell',
    quantity: 20,
    entryPrice: 410.85,
    exitPrice: 408.2,
    pnl: -53,
    strategy: 'Mean Reversion',
  },
  {
    id: 'pt-3',
    timestamp: '2026-06-06T09:30:00Z',
    symbol: 'AMZN',
    side: 'buy',
    quantity: 50,
    entryPrice: 182.4,
    exitPrice: null,
    pnl: null,
    strategy: 'AI Momentum',
  },
  {
    id: 'pt-4',
    timestamp: '2026-06-05T15:30:00Z',
    symbol: 'NVDA',
    side: 'sell',
    quantity: 10,
    entryPrice: 885.2,
    exitPrice: 890,
    pnl: 48,
    strategy: 'Breakout',
  },
  {
    id: 'pt-5',
    timestamp: '2026-06-05T14:00:00Z',
    symbol: 'AAPL',
    side: 'buy',
    quantity: 40,
    entryPrice: 192.45,
    exitPrice: 195.87,
    pnl: 136.8,
    strategy: 'AI Momentum',
  },
  {
    id: 'pt-6',
    timestamp: '2026-06-05T11:20:00Z',
    symbol: 'META',
    side: 'sell',
    quantity: 15,
    entryPrice: 508,
    exitPrice: 512.84,
    pnl: 72.6,
    strategy: 'Manual',
  },
  {
    id: 'pt-7',
    timestamp: '2026-06-04T16:45:00Z',
    symbol: 'GOOGL',
    side: 'buy',
    quantity: 20,
    entryPrice: 168.72,
    exitPrice: 172.38,
    pnl: 73.2,
    strategy: 'Breakout',
  },
]

export const PAPER_BOT_STATE: PaperBotState = {
  status: 'running',
  activeStrategies: ['AI Momentum Strategy', 'Mean Reversion Strategy'],
  riskStatus: 'normal',
  tradesToday: 6,
  lastAction: 'Monitoring Mega Cap 7 universe — NVDA, AAPL, MSFT, GOOGL, AMZN, META, TSLA',
}

export const SYMBOL_OPTIONS = [...MEGA_CAP_7_SYMBOLS]
