import { Request, Response } from 'express';
import { sessions } from './telegram.controller';
import { underwriteLoan } from '../services/underwriter.service';
import { logger } from '../utils/logger';

export class LoanController {
  async apply(req: Request, res: Response) {
    const { sessionId, amount, durationDays } = req.body;
    const session = sessions.get(sessionId);
    
    if (!session) return res.status(401).json({ error: 'Invalid session' });

    try {
      // In a real scenario, verify user has valid CreditProof NFT on-chain
      // const latestProof = await getLatestCreditProof(session.wallet);
      // For this implementation, we assume a mock risk tier of 0 (A) if not set
      const riskTier = session.riskTier ?? 0;

      const underwritingResult = await underwriteLoan({
        wallet: session.wallet,
        requestedAmount: parseInt(amount),
        durationDays: parseInt(durationDays),
        riskTier: riskTier,
      });

      // Execute gasless loan via AA bundler (Simulated)
      const loanTx = `0x${Math.random().toString(16).substring(2, 66)}`;

      res.json({
        approved: true,
        amount: underwritingResult.approvedAmount,
        apr: underwritingResult.apr,
        txHash: loanTx,
      });
    } catch (error: any) {
      logger.error('Loan application failed:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const loanController = new LoanController();
