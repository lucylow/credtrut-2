import { Request, Response } from 'express';
import { elizaService } from '../services/eliza.service';
import { logger } from '../utils/logger';
import { z } from 'zod';

export class ElizaController {
  async chat(req: Request, res: Response) {
    try {
      const schema = z.object({
        agentId: z.string(),
        message: z.string(),
        context: z.any().optional()
      });

      const { agentId, message, context } = schema.parse(req.body);
      const response = await elizaService.processMessage(agentId, message, context);
      
      res.json({ 
        success: true, 
        data: response 
      });
    } catch (error) {
      logger.error('Eliza chat failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to process agent message';
      res.status(400).json({ success: false, error: message });
    }
  }

  async getAgents(req: Request, res: Response) {
    // Return available agents and their metadata from service
    const agents = Array.from(elizaService.agents.entries()).map(([id, data]: [string, any]) => ({
      id,
      name: data.name,
      description: data.persona
    }));

    res.json({
      success: true,
      agents
    });
  }
}

export const elizaController = new ElizaController();
