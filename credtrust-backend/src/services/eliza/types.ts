import { AgentAction, AgentMessage } from '../eliza.service';

export interface AgentHandler {
  agentId: string;
  name: string;
  persona: string;
  capabilities: string[];
  process(message: string, context?: any): Promise<{ content: string; actions: AgentAction[] }>;
}
