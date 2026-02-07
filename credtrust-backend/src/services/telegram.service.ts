import { BaseService } from './base.service';
import { logger } from '../utils/logger';

export class TelegramService extends BaseService {
  private botToken: string;
  private chatId: string;

  constructor() {
    super('TelegramService');
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
  }

  async sendMessage(message: string): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      const mockResponse = {
        ok: true,
        result: {
          message_id: Math.floor(Math.random() * 1000000),
          from: { id: 12345678, is_bot: true, first_name: 'CredTrust Bot', username: 'CredTrustBot' },
          chat: { id: 87654321, first_name: 'Mock User', type: 'private' },
          date: Math.floor(Date.now() / 1000),
          text: message
        }
      };
      this.logInfo(`[MOCK TELEGRAM] Sent message to @MockUser: "${message}"`);
      this.logInfo(`[MOCK TELEGRAM] Response: ${JSON.stringify(mockResponse)}`);
      return true;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      this.logError('Failed to send Telegram message', error);
      return false;
    }
  }

  async sendWeb3Alert(wallet: string, action: string, details: string): Promise<boolean> {
    const message = `*CredTrust Web3 Alert*\n\n` +
                    `👤 *Wallet:* \`${wallet}\`\n` +
                    `⚡ *Action:* ${action}\n` +
                    `📝 *Details:* ${details}\n\n` +
                    `_Sent via CredTrust Secure Enclave_`;
    return this.sendMessage(message);
  }
}

export const telegramService = new TelegramService();
