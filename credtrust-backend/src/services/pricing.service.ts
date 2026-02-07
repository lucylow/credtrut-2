import { BaseService } from './base.service';

export interface TranchePrice {
  senior: number;
  junior: number;
  equity: number;
  timestamp: number;
  totalPool: number;
  yields: {
    senior: number;
    junior: number;
    equity: number;
  };
}

export class PricingService extends BaseService {
  private prices: TranchePrice = {
    senior: 1.02,
    junior: 0.98,
    equity: 1.12,
    timestamp: Date.now(),
    totalPool: 18500000,
    yields: {
      senior: 5.2,
      junior: 12.5,
      equity: 24.8
    }
  };

  constructor() {
    super('PricingService');
  }

  getPrices(): TranchePrice {
    return this.prices;
  }

  updatePrices(): TranchePrice {
    try {
      // More realistic market simulation
      this.prices = {
        senior: parseFloat(Math.max(0.98, this.prices.senior * (1 + (Math.random() - 0.5) * 0.0005)).toFixed(4)),
        junior: parseFloat(Math.max(0.92, this.prices.junior * (1 + (Math.random() - 0.5) * 0.002)).toFixed(4)),
        equity: parseFloat(Math.max(0.85, this.prices.equity * (1 + (Math.random() - 0.5) * 0.005)).toFixed(4)),
        timestamp: Date.now(),
        totalPool: Math.floor(this.prices.totalPool + (Math.random() - 0.4) * 10000),
        yields: {
          senior: parseFloat((5.2 + (Math.random() - 0.5) * 0.1).toFixed(2)),
          junior: parseFloat((12.5 + (Math.random() - 0.5) * 0.5).toFixed(2)),
          equity: parseFloat((24.8 + (Math.random() - 0.5) * 1.2).toFixed(2))
        }
      };
      return this.prices;
    } catch (error) {
      this.logError('Failed to update prices', error);
      throw error;
    }
  }
}

export const pricingService = new PricingService();
