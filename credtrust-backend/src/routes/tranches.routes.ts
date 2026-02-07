import { Router } from 'express';
import { z } from 'zod';
import { pricingService } from '../services/pricing.service';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/tranches/prices
router.get('/prices', (_req, res) => {
  try {
    const prices = pricingService.getPrices();
    res.json({
      success: true,
      timestamp: Date.now(),
      prices: {
        senior: {
          price: prices.senior,
          change24h: '+0.8%',
          volume24h: 1250000,
          utilization: 0.87,
          apy: '4-6%'
        },
        junior: {
          price: prices.junior,
          change24h: '-1.2%',
          volume24h: 850000,
          utilization: 0.94,
          apy: '8-12%'
        },
        equity: {
          price: prices.equity,
          change24h: '+3.4%',
          volume24h: 420000,
          utilization: 0.67,
          apy: '15-25%'
        }
      },
      totalPool: prices.totalPool,
      yields: prices.yields
    });
  } catch (error) {
    logger.error('Failed to get prices:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch prices' });
  }
});

// GET /api/tranches/:id
router.get('/:id', (req, res) => {
  const id = req.params.id as 'senior' | 'junior' | 'equity';
  const validTranches = ['senior', 'junior', 'equity'];
  
  if (!validTranches.includes(id)) {
    return res.status(400).json({ success: false, error: 'Invalid tranche ID' });
  }

  const prices = pricingService.getPrices();
  
  const trancheDetails: Record<string, any> = {
    senior: {
      id: 'senior',
      name: 'Senior Tranche',
      description: 'First-loss protected, stable yield tranche for conservative investors',
      riskLevel: 'Low',
      targetYield: '4-6%',
      price: prices.senior,
      utilization: 0.87,
      defaultRate: 0.002,
      lockupPeriod: '30 days',
      minInvestment: 1000,
      totalDeposits: 12500000,
      activeInvestors: 342
    },
    junior: {
      id: 'junior',
      name: 'Junior Tranche',
      description: 'Mezzanine tranche with higher yield and moderate risk exposure',
      riskLevel: 'Medium',
      targetYield: '8-12%',
      price: prices.junior,
      utilization: 0.94,
      defaultRate: 0.015,
      lockupPeriod: '14 days',
      minInvestment: 500,
      totalDeposits: 4200000,
      activeInvestors: 156
    },
    equity: {
      id: 'equity',
      name: 'Equity Tranche',
      description: 'First-loss tranche with highest yield potential for risk-tolerant investors',
      riskLevel: 'High',
      targetYield: '15-25%',
      price: prices.equity,
      utilization: 0.67,
      defaultRate: 0.045,
      lockupPeriod: '7 days',
      minInvestment: 250,
      totalDeposits: 1800000,
      activeInvestors: 89
    }
  };

  res.json({
    success: true,
    tranche: trancheDetails[id]
  });
});

// POST /api/tranches/mint
const MintSchema = z.object({
  tranche: z.enum(['senior', 'junior', 'equity']),
  amount: z.number().positive().min(100),
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/)
});

router.post('/mint', (req, res) => {
  try {
    const parsed = MintSchema.parse(req.body);
    const prices = pricingService.getPrices();
    const tranchePrice = prices[parsed.tranche as keyof typeof prices] as number;
    const tokensReceived = parsed.amount / tranchePrice;

    const result = {
      success: true,
      transaction: {
        nftId: `credtrust-${parsed.tranche}-${Date.now()}`,
        tranche: parsed.tranche,
        amountUsd: parsed.amount,
        tokensReceived: tokensReceived.toFixed(4),
        pricePerToken: tranchePrice,
        wallet: parsed.wallet,
        txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: new Date().toISOString(),
        estimatedGas: '0.0012 ETH'
      }
    };

    logger.info(`Mint: ${parsed.amount} USD -> ${parsed.tranche} for ${parsed.wallet}`);
    res.json(result);
  } catch (error: any) {
    logger.error('Mint error:', error);
    res.status(400).json({ 
      success: false, 
      error: error?.message || 'Invalid mint request' 
    });
  }
});

// POST /api/tranches/redeem
const RedeemSchema = z.object({
  tranche: z.enum(['senior', 'junior', 'equity']),
  tokens: z.number().positive(),
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/)
});

router.post('/redeem', (req, res) => {
  try {
    const parsed = RedeemSchema.parse(req.body);
    const prices = pricingService.getPrices();
    const tranchePrice = prices[parsed.tranche as keyof typeof prices] as number;
    const amountUsd = parsed.tokens * tranchePrice;

    const result = {
      success: true,
      transaction: {
        tranche: parsed.tranche,
        tokensRedeemed: parsed.tokens,
        amountUsd: amountUsd.toFixed(2),
        pricePerToken: tranchePrice,
        wallet: parsed.wallet,
        txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: new Date().toISOString()
      }
    };

    logger.info(`Redeem: ${parsed.tokens} ${parsed.tranche} tokens for ${parsed.wallet}`);
    res.json(result);
  } catch (error: any) {
    logger.error('Redeem error:', error);
    res.status(400).json({ 
      success: false, 
      error: error?.message || 'Invalid redeem request' 
    });
  }
});

export default router;
