import { describe, it, expect } from 'vitest';
import { elizaService } from '../services/eliza.service';

describe('ElizaService', () => {
  it('should initialize with all default agents', () => {
    const agents = Array.from(elizaService.agents.keys());
    expect(agents).toContain('risk-analyst');
    expect(agents).toContain('market-bot');
    expect(agents).toContain('research-agent');
    expect(agents).toContain('tdx-agent');
    expect(agents).toContain('identity-agent');
  });

  it('should process messages for risk-analyst', async () => {
    const response = await elizaService.processMessage('risk-analyst', 'Analyze my risk score');
    expect(response.role).toBe('agent');
    expect(response.content).toContain('risk score');
    expect(response.actions).toBeDefined();
    expect(response.actions?.[0].type).toBe('ANALYZE_RISK');
  });

  it('should process messages for market-bot', async () => {
    const response = await elizaService.processMessage('market-bot', 'What are the current yields?');
    expect(response.role).toBe('agent');
    expect(response.content).toContain('yield');
    expect(response.actions).toBeDefined();
    expect(response.actions?.[0].type).toBe('PREDICT_PRICE');
  });

  it('should throw error for unknown agent', async () => {
    await expect(elizaService.processMessage('unknown-agent', 'hello')).rejects.toThrow('Agent unknown-agent not found');
  });
});
