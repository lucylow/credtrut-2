import { BaseService } from './base.service';
import { AgentHandler } from './eliza/types';
import { RiskAnalystHandler } from './eliza/risk-analyst.handler';
import { MarketBotHandler } from './eliza/market-bot.handler';
import { ResearchAgentHandler } from './eliza/research-agent.handler';
import { TdxAgentHandler } from './eliza/tdx-agent.handler';
import { IdentityAgentHandler } from './eliza/identity-agent.handler';
import { actionDispatcher } from './eliza/action-dispatcher';

export interface AgentMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
  actions?: AgentAction[];
}

export type AgentActionType = 'ANALYZE_RISK' | 'PREDICT_PRICE' | 'ALERT_USER' | 'EXECUTE_ARBITRUM_TRADE' | 'TDX_ATTESTATION';

export interface AgentAction {
  type: AgentActionType;
  payload: any;
}

export class ElizaService extends BaseService {
  public agents: Map<string, AgentHandler> = new Map();

  constructor() {
    super('ElizaService');
    this.initializeDefaultAgents();
  }

  private initializeDefaultAgents() {
    const handlers = [
      new RiskAnalystHandler(),
      new MarketBotHandler(),
      new ResearchAgentHandler(),
      new TdxAgentHandler(),
      new IdentityAgentHandler()
    ];

    for (const handler of handlers) {
      this.agents.set(handler.agentId, handler);
    }
    
    this.logInfo(`Enhanced Eliza agents initialized with ${this.agents.size} handlers`);
  }

  async processMessage(agentId: string, message: string, context?: any): Promise<AgentMessage> {
    const handler = this.agents.get(agentId);
    if (!handler) {
      throw new Error(`Agent ${agentId} not found`);
    }

    this.logInfo(`Processing message for agent ${agentId}: ${message}`);
    
    try {
      const { content, actions } = await handler.process(message, context);

      // Trigger actions asynchronously
      if (actions && actions.length > 0) {
        for (const action of actions) {
          actionDispatcher.dispatch(agentId, action).catch(err => 
            this.logError(`Action trigger failed for agent ${agentId}`, err)
          );
        }
      }

      return {
        role: 'agent',
        content,
        timestamp: Date.now(),
        actions
      };
    } catch (error) {
      this.logError(`Error processing message for agent ${agentId}`, error);
      throw error;
    }
  }

  async triggerAction(agentId: string, action: AgentAction): Promise<void> {
    return actionDispatcher.dispatch(agentId, action);
  }
}

export const elizaService = new ElizaService();
