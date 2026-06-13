import type { RiskLimits } from '@/risk/types'

/** Default limits aligned with Settings page mock values — load from Supabase later. */
export const DEFAULT_RISK_LIMITS: RiskLimits = {
  maxPositionSize: 10_000,
  maxDailyLoss: 2_500,
  maxOpenPositions: 12,
}
