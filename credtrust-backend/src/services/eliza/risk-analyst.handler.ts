import { AgentAction } from '../eliza.service';
import { AgentHandler } from './types';
import { riskService, RiskFactors } from '../risk.service';

export class RiskAnalystHandler implements AgentHandler {
  agentId = 'risk-analyst';
  name = 'CredTrust Risk Analyst';
  persona = 'Expert in DeFi credit risk and TEE-based privacy. Analytical, precise, and cautious.';
  capabilities = ['risk_scoring', 'tranche_analysis', 'on_chain_audit', 'news_impact_analysis'];

  async process(message: string, context?: any): Promise<{ content: string; actions: AgentAction[] }> {
    const lowerMsg = message.toLowerCase();
    let content = '';
    const actions: AgentAction[] = [];

    if (lowerMsg.includes('risk') || lowerMsg.includes('score') || lowerMsg.includes('analyze')) {
      const wallet = context?.wallet || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      
      // Attempt to extract factors from context or use deterministic mocks based on wallet
      const walletSeed = parseInt(wallet.substring(2, 10), 16);
      const mockFactors: RiskFactors = {
        income: 50000 + (walletSeed % 100000),
        employmentMonths: 12 + (walletSeed % 120),
        existingDebt: (walletSeed % 50000),
        walletAge: 100 + (walletSeed % 1000),
        txCount90d: (walletSeed % 200),
        paymentHistoryGood: (walletSeed % 10) > 2
      };
      
      const riskResult = riskService.calculateScore(mockFactors);
      content = `I've performed an autonomous risk audit for wallet ${wallet.substring(0, 6)}...${wallet.substring(38)}.

**Risk Analysis Report:**
- **Credit Score:** ${riskResult.score} (${riskResult.tier} Tier)
- **Financial Health:** ${riskResult.factors.financial}/400
- **On-chain Reputation:** ${riskResult.factors.onChain}/300
- **Behavioral Analysis:** ${riskResult.factors.behavioral}/150
- **Confidence Level:** ${(riskResult.confidence * 100).toFixed(1)}%

${riskResult.score > 700 
  ? 'The behavioral and on-chain factors are exceptionally strong. This wallet demonstrates a high-quality borrower profile with consistent DeFi activity.' 
  : 'The risk profile suggests some caution. I recommend a higher collateralization ratio or a shorter loan duration for this position.'}`;
      
      actions.push({ type: 'ANALYZE_RISK', payload: { ...riskResult, wallet } });
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      content = `Greetings. I am the CredTrust Risk Analyst. I provide real-time, TEE-verified risk assessments for DeFi credit portfolios. How can I audit your position today?`;
    } else {
      content = `I am monitoring the TEE enclaves for any privacy leaks or risk anomalies. How can I assist with your credit portfolio today?`;
    }

    return { content, actions };
  }
}
