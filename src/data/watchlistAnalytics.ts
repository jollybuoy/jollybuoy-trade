import type { WatchlistGroup, WatchlistGroupId, WatchlistRow } from '@/types/watchlist'

export const WATCHLIST_GROUPS: WatchlistGroup[] = [
  {
    id: 'ai-growth',
    name: 'AI Growth',
    description: 'High-growth AI and cloud infrastructure names',
    symbolCount: 5,
  },
  {
    id: 'semiconductor',
    name: 'Semiconductor',
    description: 'Chip designers, fabs, and equipment leaders',
    symbolCount: 6,
  },
  {
    id: 'magnificent-7',
    name: 'Magnificent 7',
    description: 'Mega-cap tech leaders driving market breadth',
    symbolCount: 7,
  },
  {
    id: 'high-momentum',
    name: 'High Momentum',
    description: 'Relative strength leaders with elevated volume',
    symbolCount: 5,
  },
  {
    id: 'dividend',
    name: 'Dividend',
    description: 'Income-focused holdings with stable cash flows',
    symbolCount: 5,
  },
  {
    id: 'custom',
    name: 'Custom Watchlist',
    description: 'Your manually curated symbols and notes',
    symbolCount: 4,
  },
]

export const WATCHLIST_BY_GROUP: Record<WatchlistGroupId, WatchlistRow[]> = {
  'ai-growth': [
    { symbol: 'PLTR', company: 'Palantir Technologies', price: 24.86, changePercent: 5.18, marketCap: 54_200_000_000, volume: 68_200_000, rsi: 62, aiScore: 88, signal: 'buy' },
    { symbol: 'SNOW', company: 'Snowflake Inc.', price: 168.42, changePercent: 2.94, marketCap: 55_800_000_000, volume: 4_280_000, rsi: 58, aiScore: 76, signal: 'watch' },
    { symbol: 'CRWD', company: 'CrowdStrike Holdings', price: 312.18, changePercent: 1.42, marketCap: 76_400_000_000, volume: 3_120_000, rsi: 54, aiScore: 82, signal: 'buy' },
    { symbol: 'NET', company: 'Cloudflare Inc.', price: 92.64, changePercent: 3.28, marketCap: 31_600_000_000, volume: 5_840_000, rsi: 61, aiScore: 79, signal: 'watch' },
    { symbol: 'DDOG', company: 'Datadog Inc.', price: 128.92, changePercent: -0.84, marketCap: 42_100_000_000, volume: 2_680_000, rsi: 48, aiScore: 74, signal: 'watch' },
  ],
  semiconductor: [
    { symbol: 'NVDA', company: 'NVIDIA Corp.', price: 892.14, changePercent: 2.18, marketCap: 2_200_000_000_000, volume: 42_800_000, rsi: 68, aiScore: 94, signal: 'buy' },
    { symbol: 'AMD', company: 'Advanced Micro Devices', price: 168.22, changePercent: -2.03, marketCap: 272_000_000_000, volume: 52_340_000, rsi: 44, aiScore: 71, signal: 'watch' },
    { symbol: 'AVGO', company: 'Broadcom Inc.', price: 1_428.56, changePercent: 0.92, marketCap: 668_000_000_000, volume: 2_940_000, rsi: 56, aiScore: 85, signal: 'buy' },
    { symbol: 'QCOM', company: 'Qualcomm Inc.', price: 198.42, changePercent: 1.14, marketCap: 221_000_000_000, volume: 6_820_000, rsi: 52, aiScore: 78, signal: 'watch' },
    { symbol: 'INTC', company: 'Intel Corp.', price: 32.18, changePercent: -1.28, marketCap: 136_000_000_000, volume: 38_420_000, rsi: 38, aiScore: 62, signal: 'avoid' },
    { symbol: 'TSM', company: 'Taiwan Semiconductor', price: 142.68, changePercent: 1.86, marketCap: 740_000_000_000, volume: 12_680_000, rsi: 59, aiScore: 86, signal: 'buy' },
  ],
  'magnificent-7': [
    { symbol: 'AAPL', company: 'Apple Inc.', price: 195.87, changePercent: 1.24, marketCap: 3_020_000_000_000, volume: 58_420_000, rsi: 55, aiScore: 84, signal: 'buy' },
    { symbol: 'MSFT', company: 'Microsoft Corp.', price: 412.35, changePercent: 0.88, marketCap: 3_060_000_000_000, volume: 22_180_000, rsi: 53, aiScore: 87, signal: 'buy' },
    { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 172.38, changePercent: 1.26, marketCap: 2_140_000_000_000, volume: 28_650_000, rsi: 57, aiScore: 83, signal: 'watch' },
    { symbol: 'AMZN', company: 'Amazon.com Inc.', price: 186.54, changePercent: -0.65, marketCap: 1_940_000_000_000, volume: 42_180_000, rsi: 49, aiScore: 80, signal: 'watch' },
    { symbol: 'META', company: 'Meta Platforms', price: 512.84, changePercent: 1.33, marketCap: 1_310_000_000_000, volume: 18_920_000, rsi: 60, aiScore: 86, signal: 'buy' },
    { symbol: 'NVDA', company: 'NVIDIA Corp.', price: 892.14, changePercent: 2.18, marketCap: 2_200_000_000_000, volume: 42_800_000, rsi: 68, aiScore: 94, signal: 'buy' },
    { symbol: 'TSLA', company: 'Tesla Inc.', price: 248.92, changePercent: 3.47, marketCap: 792_000_000_000, volume: 98_420_000, rsi: 64, aiScore: 81, signal: 'watch' },
  ],
  'high-momentum': [
    { symbol: 'SMCI', company: 'Super Micro Computer', price: 842.18, changePercent: 8.42, marketCap: 48_600_000_000, volume: 18_420_000, rsi: 72, aiScore: 92, signal: 'buy' },
    { symbol: 'COIN', company: 'Coinbase Global', price: 218.72, changePercent: -2.51, marketCap: 52_400_000_000, volume: 12_680_000, rsi: 41, aiScore: 68, signal: 'avoid' },
    { symbol: 'MSTR', company: 'MicroStrategy Inc.', price: 1_428.92, changePercent: 6.84, marketCap: 28_200_000_000, volume: 2_840_000, rsi: 69, aiScore: 84, signal: 'watch' },
    { symbol: 'RIVN', company: 'Rivian Automotive', price: 12.68, changePercent: -6.24, marketCap: 12_400_000_000, volume: 28_400_000, rsi: 32, aiScore: 58, signal: 'avoid' },
    { symbol: 'ARM', company: 'Arm Holdings', price: 128.54, changePercent: 3.86, marketCap: 134_000_000_000, volume: 8_620_000, rsi: 66, aiScore: 82, signal: 'buy' },
  ],
  dividend: [
    { symbol: 'JNJ', company: 'Johnson & Johnson', price: 158.42, changePercent: 0.42, marketCap: 382_000_000_000, volume: 6_820_000, rsi: 51, aiScore: 72, signal: 'watch' },
    { symbol: 'PG', company: 'Procter & Gamble', price: 168.24, changePercent: 0.18, marketCap: 396_000_000_000, volume: 4_280_000, rsi: 48, aiScore: 70, signal: 'watch' },
    { symbol: 'KO', company: 'Coca-Cola Co.', price: 62.18, changePercent: 0.32, marketCap: 268_000_000_000, volume: 8_420_000, rsi: 46, aiScore: 68, signal: 'watch' },
    { symbol: 'VZ', company: 'Verizon Communications', price: 42.86, changePercent: -0.28, marketCap: 180_000_000_000, volume: 12_680_000, rsi: 44, aiScore: 65, signal: 'watch' },
    { symbol: 'O', company: 'Realty Income Corp.', price: 58.92, changePercent: 0.54, marketCap: 42_800_000_000, volume: 3_240_000, rsi: 50, aiScore: 71, signal: 'watch' },
  ],
  custom: [
    { symbol: 'CRM', company: 'Salesforce Inc.', price: 278.96, changePercent: 0.66, marketCap: 272_000_000_000, volume: 8_420_000, rsi: 52, aiScore: 77, signal: 'watch' },
    { symbol: 'NFLX', company: 'Netflix Inc.', price: 628.45, changePercent: 2.01, marketCap: 270_000_000_000, volume: 4_280_000, rsi: 58, aiScore: 80, signal: 'buy' },
    { symbol: 'SHOP', company: 'Shopify Inc.', price: 68.42, changePercent: 1.82, marketCap: 88_400_000_000, volume: 6_120_000, rsi: 55, aiScore: 75, signal: 'watch' },
    { symbol: 'UBER', company: 'Uber Technologies', price: 72.18, changePercent: -0.92, marketCap: 148_000_000_000, volume: 14_680_000, rsi: 47, aiScore: 73, signal: 'watch' },
  ],
}

export const SEARCHABLE_SYMBOLS = [
  { symbol: 'AAPL', company: 'Apple Inc.' },
  { symbol: 'AMD', company: 'Advanced Micro Devices' },
  { symbol: 'AMZN', company: 'Amazon.com Inc.' },
  { symbol: 'ARM', company: 'Arm Holdings' },
  { symbol: 'COIN', company: 'Coinbase Global' },
  { symbol: 'CRM', company: 'Salesforce Inc.' },
  { symbol: 'GOOGL', company: 'Alphabet Inc.' },
  { symbol: 'META', company: 'Meta Platforms' },
  { symbol: 'MSFT', company: 'Microsoft Corp.' },
  { symbol: 'NVDA', company: 'NVIDIA Corp.' },
  { symbol: 'PLTR', company: 'Palantir Technologies' },
  { symbol: 'SHOP', company: 'Shopify Inc.' },
  { symbol: 'SMCI', company: 'Super Micro Computer' },
  { symbol: 'TSLA', company: 'Tesla Inc.' },
  { symbol: 'UBER', company: 'Uber Technologies' },
]
