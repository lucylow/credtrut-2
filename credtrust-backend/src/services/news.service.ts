import { BaseService } from './base.service';
import axios from 'axios';

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  published_at: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export class NewsService extends BaseService {
  // Using CryptoPanic API (free tier requires key, so we'll mock it if key is missing)
  private readonly baseUrl = 'https://cryptopanic.com/api/v1';
  private apiKey: string | null = process.env.CRYPTOPANIC_API_KEY || null;

  constructor() {
    super('NewsService');
  }

  async getLatestNews(filter: string = 'hot'): Promise<NewsItem[]> {
    try {
      if (!this.apiKey) {
        return this.getMockNews();
      }

      this.logInfo(`Fetching latest news with filter: ${filter}`);
      const response = await axios.get(`${this.baseUrl}/posts/`, {
        params: {
          auth_token: this.apiKey,
          filter: filter,
          kind: 'news',
          public: true
        }
      });

      return response.data.results.map((item: any) => ({
        title: item.title,
        source: item.source.title,
        url: item.url,
        published_at: item.published_at,
        sentiment: this.detectSentiment(item.title)
      }));
    } catch (error) {
      this.logError('Failed to fetch news', error);
      return this.getMockNews();
    }
  }

  private detectSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const lower = text.toLowerCase();
    const positiveWords = ['bullish', 'gain', 'surge', 'growth', 'adoption', 'partnership', 'launch'];
    const negativeWords = ['bearish', 'drop', 'crash', 'hack', 'exploit', 'regulation', 'ban', 'lawsuit'];

    if (positiveWords.some(word => lower.includes(word))) return 'positive';
    if (negativeWords.some(word => lower.includes(word))) return 'negative';
    return 'neutral';
  }

  private getMockNews(): NewsItem[] {
    return [
      {
        title: 'Arbitrum TVL reaches new all-time high as DeFi activity surges',
        source: 'DeFi Llama',
        url: '#',
        published_at: new Date().toISOString(),
        sentiment: 'positive'
      },
      {
        title: 'New TEE-based privacy protocols are changing the landscape of Web3 credit',
        source: 'CoinDesk',
        url: '#',
        published_at: new Date().toISOString(),
        sentiment: 'positive'
      },
      {
        title: 'Market volatility increases ahead of upcoming regulatory announcements',
        source: 'Reuters',
        url: '#',
        published_at: new Date().toISOString(),
        sentiment: 'neutral'
      }
    ];
  }
}

export const newsService = new NewsService();
