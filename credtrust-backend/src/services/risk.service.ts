import { BaseService } from './base.service';
import { RiskTier } from '../types/credtrust.types';

export interface RiskFactors {
  income: number;
  employmentMonths: number;
  existingDebt: number;
  walletAge: number;
  txCount90d: number;
  paymentHistoryGood: boolean;
}

export interface RiskResult {
  score: number;
  tier: RiskTier;
  confidence: number;
  factors: {
    financial: number;
    onChain: number;
    behavioral: number;
  };
  timestamp: string;
}

export class RiskService extends BaseService {
  constructor() {
    super('RiskService');
  }

  calculateScore(factors: RiskFactors): RiskResult {
    try {
      let financialScore = 0;
      let onChainScore = 0;
      let behavioralScore = 0;

      // Financial (0-400) - Weighted: Income 60%, DTI 40%
      const incomeScore = Math.min(240, (factors.income / 100000) * 240);
      financialScore += incomeScore;
      
      const dti = factors.existingDebt / (factors.income || 1);
      const dtiScore = Math.max(0, 160 * (1 - dti * 2)); // DTI > 50% starts penalizing heavily
      financialScore += dtiScore;

      // On-chain (0-300) - Weighted: Age 40%, Activity 60%
      const ageScore = Math.min(120, (factors.walletAge / 730) * 120); // 2 years for max age score
      onChainScore += ageScore;
      
      const activityScore = Math.min(180, (factors.txCount90d / 100) * 180); // 100 tx in 90 days for max activity
      onChainScore += activityScore;

      // Behavioral (0-150)
      behavioralScore += factors.paymentHistoryGood ? 150 : (factors.txCount90d > 0 ? 50 : 0);

      // Base score is 300, max is 850
      const weightedSum = financialScore + onChainScore + behavioralScore;
      const finalScore = Math.max(300, Math.min(850, 300 + weightedSum * 0.65));

      let tier: RiskTier;
      if (finalScore >= 740) tier = 'A';
      else if (finalScore >= 670) tier = 'B';
      else if (finalScore >= 580) tier = 'C';
      else tier = 'D';

      // Confidence depends on data completeness
      const dataCompleteness = (factors.income > 0 ? 0.4 : 0) + 
                               (factors.walletAge > 0 ? 0.3 : 0) + 
                               (factors.txCount90d > 0 ? 0.3 : 0);
      
      const confidence = parseFloat((0.85 + (dataCompleteness * 0.1) + (Math.random() * 0.05)).toFixed(3));

      return {
        score: Math.floor(finalScore),
        tier,
        confidence,
        factors: {
          financial: Math.floor(financialScore),
          onChain: Math.floor(onChainScore),
          behavioral: Math.floor(behavioralScore)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logError('Risk calculation failed', error);
      throw error;
    }
  }
}

export const riskService = new RiskService();
