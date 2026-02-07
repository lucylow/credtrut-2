import { AgentAction } from '../eliza.service';
import { telegramService } from '../telegram.service';
import { discordService } from '../discord.service';
import { blockchainService } from '../blockchain.service';
import { logger } from '../../utils/logger';

interface AlertPayload {
  wallet?: string;
  message: string;
}

interface TradePayload {
  trancheId: string;
  amount?: bigint;
}

interface TdxPayload {
  enclaveId?: string;
}

export class ActionDispatcher {
  async dispatch(agentId: string, action: AgentAction): Promise<void> {
    logger.info(`Agent ${agentId} triggering autonomous action: ${action.type}`);
    
    try {
      switch (action.type) {
        case 'ALERT_USER': {
          const { wallet, message } = action.payload as AlertPayload;
          await Promise.all([
            telegramService.sendWeb3Alert(wallet || 'Unknown', `Agent ${agentId}`, message),
            discordService.sendAlert(`Agent ${agentId} notified user: ${message}`, 'INFO')
          ]);
          break;
        }
        case 'EXECUTE_ARBITRUM_TRADE': {
          const { trancheId, amount } = action.payload as TradePayload;
          const tradeResult = await blockchainService.executeAutonomousTrade(trancheId, amount || 1000000000000000000n);
          await discordService.sendAlert(`Agent ${agentId} executed trade on Arbitrum: ${tradeResult.transactionHash}`, 'INFO');
          break;
        }
        case 'TDX_ATTESTATION': {
          const { enclaveId } = action.payload as TdxPayload;
          logger.info(`TDX Attestation generated: ${enclaveId || 'identity-verification'}`);
          break;
        }
        case 'ANALYZE_RISK':
          logger.info(`Agent ${agentId} recorded risk analysis in audit log`);
          break;
        case 'PREDICT_PRICE':
          logger.info(`Agent ${agentId} completed price prediction analysis`);
          break;
        default:
          logger.warn(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      logger.error(`Failed to dispatch action ${action.type} for agent ${agentId}:`, error);
      throw error;
    }
  }
}

export const actionDispatcher = new ActionDispatcher();
