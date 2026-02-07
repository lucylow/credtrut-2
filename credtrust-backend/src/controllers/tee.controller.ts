import { Request, Response } from 'express';
import { iexecService } from '../services/iexec.service';
import { riskService } from '../services/risk.service';
import { blockchainService } from '../services/blockchain.service';
import { logger } from '../utils/logger';
import { z } from 'zod';

export class TeeController {
  async protect(req: Request, res: Response) {
    try {
      const schema = z.object({
        data: z.string(),
        wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/)
      });

      const { data, wallet } = schema.parse(req.body);
      const ipfsHash = await iexecService.protectData(data, wallet);
      
      // Notify user via Web3Mail that their data is protected
      await iexecService.sendWeb3Mail(
        wallet, 
        'CredTrust: Data Protected', 
        'Your financial data has been encrypted and stored securely using iExec DataProtector.'
      );

      res.json({ 
        success: true, 
        ipfsHash, 
        message: 'Data protected and user notified via Web3Mail' 
      });
    } catch (error) {
      logger.error('Data protection failed:', error);
      res.status(400).json({ error: 'Invalid data or wallet address' });
    }
  }

  async runJob(req: Request, res: Response, next: any) {
    try {
      const schema = z.object({
        ipfsHash: z.string(),
        framework: z.enum(['SGX', 'TDX']).optional(),
        wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
        factors: z.object({
          income: z.number(),
          employmentMonths: z.number(),
          existingDebt: z.number(),
          walletAge: z.number(),
          txCount90d: z.number(),
          paymentHistoryGood: z.boolean()
        }).optional()
      });

      const { ipfsHash, wallet, factors, framework } = schema.parse(req.body);
      
      // 1. Run TEE Job via iExec
      const job = await iexecService.runTeeJob(ipfsHash, (framework as 'SGX' | 'TDX') || 'SGX');
      
      // 2. If factors provided, calculate risk score (simulating TEE internal logic)
      let riskResult = null;
      if (factors) {
        const result = riskService.calculateScore(factors);
        riskResult = result;
        job.creditScore = result.score;
        job.riskTier = result.tier;
      }

      // 3. If wallet provided, mint a Credit NFT on-chain
      let nftResult = null;
      if (wallet && riskResult) {
        nftResult = await blockchainService.mintCreditNFT(wallet as `0x${string}`, riskResult.score, riskResult.tier);
      }

      // Notify user of credit score result via Web3Mail
      if (wallet) {
        await iexecService.sendWeb3Mail(
          wallet,
          'CredTrust: Credit Score Verified',
          `Your credit score has been verified in a TEE. Result: ${job.creditScore} (Tier ${job.riskTier}).`
        );
      }

      res.json({ 
        success: true, 
        job,
        nft: nftResult,
        message: 'TEE job executed, on-chain results processed, and user notified' 
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getStatus(req: Request, res: Response) {
    const status = await iexecService.getMrenclaveStatus();
    res.json(status);
  }
}

export const teeController = new TeeController();
