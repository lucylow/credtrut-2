export async function underwriteLoan(params: {
  wallet: string;
  requestedAmount: number;
  durationDays: number;
  riskTier: number;
}) {
  const { riskTier } = params;
  
  const tiers: Record<number, { maxAmount: number, apr: number }> = {
    0: { maxAmount: 50000, apr: 0.042 }, // A
    1: { maxAmount: 25000, apr: 0.072 }, // B
    2: { maxAmount: 10000, apr: 0.112 }, // C
    3: { maxAmount: 2500, apr: 0.212 },  // D
  };

  const approvedAmount = Math.min(params.requestedAmount, tiers[riskTier]?.maxAmount || 0);
  
  return {
    approvedAmount,
    apr: tiers[riskTier]?.apr || 0.3,
    ltv: params.requestedAmount > 0 ? approvedAmount / params.requestedAmount : 0,
  };
}
