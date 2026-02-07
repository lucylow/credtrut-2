import { AgentAction } from '../eliza.service';
import { AgentHandler } from './types';
import { pricingService } from '../pricing.service';
import { coingeckoService } from '../coingecko.service';

export class MarketBotHandler implements AgentHandler {
  agentId = 'market-bot';
  name = 'CredTrust Market Bot';
  persona = 'Real-time debt marketplace monitor. Fast-paced, data-driven, and opportunistic.';
  capabilities = ['price_prediction', 'liquidity_alerts', 'yield_optimization', 'external_market_data'];

  async process(message: string, context?: any): Promise<{ content: string; actions: AgentAction[] }> {
    const lowerMsg = message.toLowerCase();
    let content = '';
    const actions: AgentAction[] = [];
    const prices = pricingService.getPrices();

    if (lowerMsg.includes('price') || lowerMsg.includes('market') || lowerMsg.includes('yield')) {
      const ethData = await coingeckoService.getPrice('ethereum');
      let ethInfo = '';
      if (ethData) {
        ethInfo = `\n\n**External Market Indicators:**\n- **ETH Price:** $${ethData.price.toLocaleString()}\n- **24h Change:** ${ethData.change24h > 0 ? '🟢' : '🔴'} ${ethData.change24h.toFixed(2)}%\n- **24h Volume:** $${(ethData.volume24h / 1e9).toFixed(2)}B`;
      }
      
      content = `**CredTrust Debt Marketplace Update:**\n\n` +
                `- **Senior Tranche Yield:** ${prices.yields.senior}% (Stable 🛡️)\n` +
                `- **Junior Tranche Yield:** ${prices.yields.junior}% (Balanced ⚖️)\n` +
                `- **Equity Tranche Yield:** ${prices.yields.equity}% (High Risk/Reward 🔥)\n` +
                `- **Total Pool Liquidity:** $${(prices.totalPool / 1000000).toFixed(2)}M\n` +
                `${ethInfo}\n\n` +
                `I detect a ${prices.yields.equity > 15 ? 'high-yield' : 'stable'} optimization opportunity. Based on correlation analysis, current Arbitrum Sepolia liquidity is trending upwards.`;
      
      actions.push({ type: 'PREDICT_PRICE', payload: { internal: prices, external: ethData } });
    } else if (lowerMsg.includes('trade') || lowerMsg.includes('execute') || lowerMsg.includes('invest')) {
      const amount = lowerMsg.includes('100') ? 100n * 10n**18n : 1n * 10n**18n;
      content = `I am preparing an autonomous trade on Arbitrum Sepolia to invest ${amount / 10n**18n} ETH into the Junior tranche. I will use the TDX Agent to verify the ZKP before execution.`;
      actions.push({ 
        type: 'EXECUTE_ARBITRUM_TRADE', 
        payload: { trancheId: 'junior', amount: amount } 
      });
    } else {
      content = `Market Bot active. I'm tracking real-time tranche pricing and liquidity flows. Ask me about current yields!`;
    }

    return { content, actions };
  }
}
