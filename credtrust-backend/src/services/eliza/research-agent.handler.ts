import { AgentAction } from '../eliza.service';
import { AgentHandler } from './types';
import { newsService } from '../news.service';
import { coingeckoService } from '../coingecko.service';

export class ResearchAgentHandler implements AgentHandler {
  agentId = 'research-agent';
  name = 'CredTrust Research Guru';
  persona = 'Deep-dive researcher and sentiment analyst. Synthesizes news, social trends, and external market data into actionable insights.';
  capabilities = ['sentiment_analysis', 'news_aggregation', 'trend_spotting'];

  async process(message: string, context?: any): Promise<{ content: string; actions: AgentAction[] }> {
    const lowerMsg = message.toLowerCase();
    let content = '';
    const actions: AgentAction[] = [];

    if (lowerMsg.includes('news') || lowerMsg.includes('latest') || lowerMsg.includes('sentiment')) {
      const news = await newsService.getLatestNews();
      const sentimentCounts = news.reduce((acc: any, item) => {
        acc[item.sentiment || 'neutral']++;
        return acc;
      }, { positive: 0, negative: 0, neutral: 0 });
      
      const topNews = news.slice(0, 2).map(n => `"${n.title}" (${n.source})`).join('; ');
      content = `I've analyzed the latest market sentiment. Overall sentiment is ${sentimentCounts.positive > sentimentCounts.negative ? 'Bullish' : 'Neutral'}. Key news: ${topNews}. This suggests stable conditions for the CredTrust debt marketplace.`;
      actions.push({ type: 'ALERT_USER', payload: { message: `Market sentiment analysis completed: ${sentimentCounts.positive} pos, ${sentimentCounts.negative} neg.` } });
    } else if (lowerMsg.includes('price') || lowerMsg.includes('eth') || lowerMsg.includes('btc') || lowerMsg.includes('sol')) {
      const coin = lowerMsg.includes('btc') ? 'bitcoin' : lowerMsg.includes('sol') ? 'solana' : 'ethereum';
      const data = await coingeckoService.getPrice(coin);
      if (data) {
        content = `The current price of ${coin.toUpperCase()} is $${data.price.toLocaleString()}. Market Cap: $${(data.marketCap / 1e9).toFixed(2)}B. 24h Volume: $${(data.volume24h / 1e9).toFixed(2)}B. The 24h change is ${data.change24h > 0 ? '+' : ''}${data.change24h.toFixed(2)}%. This ${Math.abs(data.change24h) > 5 ? 'significant' : 'minor'} price movement could impact debt marketplace collateralization ratios.`;
      } else {
        content = `I couldn't fetch the latest price data for ${coin}. Please try again later.`;
      }
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('who')) {
      content = `I am the CredTrust Research Guru. I synthesize news, sentiment, and external market data into actionable insights for the protocol. How can I help your research today?`;
    } else {
      content = `Research Guru here. I can provide you with the latest crypto news, sentiment analysis, or external market prices from CoinGecko. What are you looking for?`;
    }

    return { content, actions };
  }
}
