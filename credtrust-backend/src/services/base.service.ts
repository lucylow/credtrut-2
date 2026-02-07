import { logger } from '../utils/logger';

export abstract class BaseService {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  protected logInfo(message: string, meta?: Record<string, any>) {
    logger.info(`[${this.name}] ${message}`, meta);
  }

  protected logError(message: string, error?: unknown, meta?: Record<string, any>) {
    logger.error(`[${this.name}] ${message}`, { error, ...meta });
  }
}
