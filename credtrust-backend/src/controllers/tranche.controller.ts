import { Request, Response } from 'express';
import { pricingService } from '../services/pricing.service';

export class TrancheController {
  getPrices(req: Request, res: Response) {
    res.json(pricingService.getPrices());
  }

  getTrancheDetails(req: Request, res: Response) {
    const id = req.params.id as string;
    // Mock detailed info for a specific tranche
    res.json({
      id,
      name: id?.toUpperCase() || 'UNKNOWN',
      description: `Detailed performance metrics for ${id} tranche`,
      utilization: 0.85,
      defaultRate: 0.02
    });
  }

  mint(req: Request, res: Response) {
    const { trancheId, amount, walletAddress } = req.body;
    res.json({
      success: true,
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      trancheId,
      amount,
      walletAddress,
      timestamp: new Date().toISOString()
    });
  }
}

export const trancheController = new TrancheController();
