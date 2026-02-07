import { BaseService } from './base.service';
import { pricingService, TranchePrice } from './pricing.service';
import { riskService } from './risk.service';
import { blockchainService } from './blockchain.service';

export interface StrategyRecommendation {
  type: 'REBALANCE' | 'HOLD' | 'EXIT';
  trancheId: string;
  reason: string;
  confidence: number;
  expectedYieldDelta: number;
}

export class StrategyService extends BaseService {
  constructor() {
    super('StrategyService');
  }

  async generateRecommendations(): Promise<StrategyRecommendation[]> {
    const prices = pricingService.getPrices();
    const recommendations: StrategyRecommendation[] = [];

    // Logic for Senior Tranche (Lower risk, lower yield)
    if (prices.yields.senior < 5.0) {
      recommendations.push({
        type: 'REBALANCE',
        trancheId: 'senior',
        reason: `Senior yield (${prices.yields.senior}%) is below the risk-free rate + 50bps. Suggesting rebalance to Junior for enhanced yield while maintaining moderate risk.`,
        confidence: 0.88,
        expectedYieldDelta: prices.yields.junior - prices.yields.senior
      });
    } else if (prices.yields.senior > 8.0) {
      recommendations.push({
        type: 'HOLD',
        trancheId: 'senior',
        reason: `Senior yield is exceptionally high at ${prices.yields.senior}%. This is a strong hold for risk-averse portfolios.`,
        confidence: 0.95,
        expectedYieldDelta: 0
      });
    }

    // Logic for Junior Tranche (Moderate risk/yield)
    if (prices.yields.junior > 15.0) {
      recommendations.push({
        type: 'REBALANCE',
        trancheId: 'junior',
        reason: `Junior yield (${prices.yields.junior}%) has surpassed equity targets. Potential risk of defaults in the underlying pool may be increasing. Consider locking in gains.`,
        confidence: 0.72,
        expectedYieldDelta: -2.0
      });
    }

    // Logic for Equity Tranche (High risk/yield)
    if (prices.yields.equity > 25.0) {
      recommendations.push({
        type: 'HOLD',
        trancheId: 'equity',
        reason: `Equity tranche is performing at a massive ${prices.yields.equity}% APY. Momentum indicators suggest continued outperformance in the short term.`,
        confidence: 0.82,
        expectedYieldDelta: 5.0
      });
    } else if (prices.yields.equity < 15.0) {
      recommendations.push({
        type: 'EXIT',
        trancheId: 'equity',
        reason: `Equity yield has dropped to ${prices.yields.equity}%. The risk-premium is no longer justified given current market volatility.`,
        confidence: 0.78,
        expectedYieldDelta: -5.0
      });
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  async executeStrategy(recommendation: StrategyRecommendation): Promise<boolean> {
    this.logInfo(`Executing autonomous strategy: ${recommendation.type} on ${recommendation.trancheId}`);
    
    if (recommendation.type === 'REBALANCE') {
      const result = await blockchainService.executeAutonomousTrade(recommendation.trancheId, 1000000000000000000n);
      return result.success;
    }
    
    return true;
  }
}

export const strategyService = new StrategyService();
