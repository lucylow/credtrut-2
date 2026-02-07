import { REST } from '@discordjs/rest';
import { logger } from '../utils/logger';

// Define the route interface to match @discordjs/rest expectations if needed,
// but for simplicity, we'll use a type-safe helper.
const DISCORD_ROUTES = {
  channelMessages: (channelId: string): `/${string}` => `/channels/${channelId}/messages`
};

export class DiscordService {
  private rest: REST;

  constructor() {
    this.rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN || 'mock_token');
  }

  async sendAlert(message: string, type: 'CRITICAL' | 'WARNING' | 'INFO' | 'TRADE' | 'RISK' = 'INFO'): Promise<void> {
    if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CHANNEL_ID) {
      const mockEmbed = {
        title: `${type} Alert | CredTrust`,
        description: message,
        color: type === 'CRITICAL' ? 0xff0000 : type === 'WARNING' ? 0xffff00 : type === 'TRADE' ? 0x00ff00 : type === 'RISK' ? 0xffa500 : 0x0099ff,
        timestamp: new Date().toISOString(),
        footer: { text: 'CredTrust Secure Enclave' }
      };
      logger.info(`[MOCK DISCORD] Sending alert to #mock-alerts`);
      logger.info(`[MOCK DISCORD] Embed: ${JSON.stringify(mockEmbed, null, 2)}`);
      return;
    }
    try {
      await this.rest.post(
        DISCORD_ROUTES.channelMessages(process.env.DISCORD_CHANNEL_ID),
        {
          body: {
            content: `**${type}** | CredTrust Alert\n\`\`\`${message}\`\`\``,
            username: 'CredTrust Bot'
          }
        }
      );
    } catch (error) {
      logger.error('Discord alert failed:', error);
    }
  }

  async enclaveCrashAlert(enclaveId: string): Promise<void> {
    await this.sendAlert(
      `🛑 ENCLAVE CRASH\nID: ${enclaveId}\nTime: ${new Date().toISOString()}`,
      'CRITICAL'
    );
  }
}

export const discordService = new DiscordService();
