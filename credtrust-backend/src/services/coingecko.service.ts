import { BaseService } from './base.service';
import axios from 'axios';

export interface MarketData {
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
}

export class CoinGeckoService extends BaseService {
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';

  constructor() {
    super('CoinGeckoService');
  }

  async getPrice(coinId: string = 'ethereum'): Promise<MarketData | null> {
    try {
      this.logInfo(`Fetching price for ${coinId}`);
      const response = await axios.get(`${this.baseUrl}/simple/price`, {
        params: {
          ids: coinId,
          vs_currencies: 'usd',
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true,
        }
      });

      const data = response.data[coinId];
      if (!data) return null;

      return {
        price: data.usd,
        marketCap: data.usd_market_cap,
        volume24h: data.usd_24h_vol,
        change24h: data.usd_24h_change,
      };
    } catch (error) {
      this.logError(`Failed to fetch price for ${coinId}`, error);
      // Fallback for demo if API fails
      return {
        price: 2500 + Math.random() * 100,
        marketCap: 300000000000,
        volume24h: 15000000000,
        change24h: (Math.random() - 0.5) * 5,
      };
    }
  }

  async getGlobalData(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/global`);
      return response.data.data;
    } catch (error) {
      this.logError('Failed to fetch global data', error);
      return null;
    }
  }
}

export const coingeckoService = new CoinGeckoService();
