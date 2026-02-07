import { Request, Response } from 'express';
import { sessions } from './telegram.controller';
import { submitToTEE, pollTEEResult } from '../tee/iexec';
import { mintCreditProofNFT } from '../blockchain/nft';
import { logger } from '../utils/logger';

export class ChatController {
  async getCreditScore(req: Request, res: Response) {
    const { sessionId, income, debt, employmentMonths } = req.body;

    const session = sessions.get(sessionId);
    if (!session) return res.status(401).json({ error: 'Invalid session' });

    try {
      // 1. TEE TASK: Submit encrypted data to iExec
      const taskId = await submitToTEE({
        wallet: session.wallet,
        income: parseInt(income),
        debt: parseInt(debt),
        employmentMonths: parseInt(employmentMonths),
      });

      // 2. Poll for TEE result (In production, use webhooks)
      const teeResult = await pollTEEResult(taskId);
      
      // 3. Extract ZK proof + tier from TEE output
      const { riskTier, zkProof, publicInputHash, scoreHash, teeAttestation } = teeResult;
      
      // 4. MINT CREDIT PROOF NFT (gasless via AA)
      const mintResult = await mintCreditProofNFT({
        borrower: session.wallet,
        riskTier,
        zkProof,
        publicInputHash,
        scoreHash,
        teeAttestation,
        underwriter: process.env.UNDERWRITER_ADDRESS!,
      });

      res.json({
        success: true,
        tokenId: mintResult.tokenId,
        riskTier: tierToLetter(riskTier),
        scoreRange: getScoreRange(riskTier),
        txHash: mintResult.txHash,
      });
    } catch (error: any) {
      logger.error('Credit score pipeline failed:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

function tierToLetter(tier: number): string {
  return ['A', 'B', 'C', 'D'][tier] || 'F';
}

function getScoreRange(tier: number): string {
  const ranges = ['750-850', '650-749', '550-649', '300-549'];
  return ranges[tier] || 'N/A';
}

export const chatController = new ChatController();
