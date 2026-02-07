export type RiskTier = 'A' | 'B' | 'C' | 'D';

export interface CreditData {
  walletAddress: string;
  score: number;
  tier: RiskTier;
  timestamp: number;
}

export interface TrancheInfo {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  riskLevel: RiskTier;
}

export interface TEEJobStatus {
  jobId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  resultHash?: string;
  error?: string;
}
