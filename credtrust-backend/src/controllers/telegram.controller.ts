import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyTelegramInitData } from '../utils/telegram';
import { logger } from '../utils/logger';

// Mock session store - in production use Redis
export const sessions = new Map<string, any>();

export class TelegramController {
  async handleWebhook(req: Request, res: Response) {
    try {
      const { initData, user } = req.body;
      
      if (!verifyTelegramInitData(initData)) {
        return res.status(401).json({ error: 'Invalid Telegram signature' });
      }

      // In a real scenario, call a service to create or get a smart wallet
      const wallet = `0x${Math.random().toString(16).substring(2, 42)}`;
      const sessionId = uuidv4();
      
      sessions.set(sessionId, {
        wallet,
        email: `${user.username || 'user'}@credtrust.temp`,
        sessionId,
        createdAt: Date.now(),
      });

      res.json({
        sessionId,
        wallet,
        message: 'Welcome to CredTrust! Chat with agent to get credit score.',
      });
    } catch (error) {
      logger.error('Telegram webhook failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const telegramController = new TelegramController();
