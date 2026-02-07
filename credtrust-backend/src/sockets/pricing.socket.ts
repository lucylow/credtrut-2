import { Server, Socket } from 'socket.io';
import { pricingService } from '../services/pricing.service';
import { logger } from '../utils/logger';

export function pricingSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    logger.info(`Trader connected: ${socket.id}`);

    // Send initial snapshot
    socket.emit('market-snapshot', pricingService.getPrices());

    // Price updates every 2s
    const interval = setInterval(() => {
      const prices = pricingService.updatePrices();
      socket.emit('tranche-price', prices);
    }, 2000);

    socket.on('disconnect', () => {
      logger.info(`Trader disconnected: ${socket.id}`);
      clearInterval(interval);
    });
  });
}
