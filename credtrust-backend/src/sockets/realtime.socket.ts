import type { Server, Socket } from 'socket.io';
import { pricingService } from '../services/pricing.service';
import { hsmService } from '../services/hsm.service';
import { alertsService } from '../services/alerts.service';
import { iexecService } from '../services/iexec.service';
import { logger } from '../utils/logger';

export function initRealtimeSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // === Initial Snapshots ===
    socket.emit('market-snapshot', {
      timestamp: Date.now(),
      prices: pricingService.getPrices()
    });

    socket.emit('hsm-snapshot', hsmService.getStatus());

    socket.emit('alerts-snapshot', {
      alerts: alertsService.getAlerts({ limit: 10 }),
      unacknowledgedCount: alertsService.getUnacknowledgedCount()
    });

    // === Periodic Price Updates (every 1.5s) ===
    const priceInterval = setInterval(() => {
      const prices = pricingService.updatePrices();
      socket.emit('tranche-price', { 
        timestamp: Date.now(), 
        prices 
      });
    }, 1500);

    // === HSM Status Updates (every 10s) ===
    const hsmInterval = setInterval(() => {
      socket.emit('hsm-update', hsmService.getStatus());
    }, 10000);

    // === Simulated Random Alerts (every 30s for demo) ===
    const alertInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const alertTypes = [
          { title: 'New Credit Application', message: 'Borrower 0x7a3f... submitted credit verification request', severity: 'info' as const, category: 'system' as const },
          { title: 'TEE Job Completed', message: 'Credit score computed in SGX enclave. Result: 742 (Tier B)', severity: 'info' as const, category: 'security' as const },
          { title: 'Liquidity Warning', message: 'Senior tranche approaching 90% utilization threshold', severity: 'warning' as const, category: 'performance' as const },
        ];
        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const newAlert = alertsService.createAlert(randomAlert);
        socket.emit('new-alert', newAlert);
      }
    }, 30000);

    // === Client Events ===
    
    // Run TEE job via socket
    socket.on('run-tee-job', async (data: { ipfsHash: string; framework?: 'SGX' | 'TDX' }) => {
      try {
        logger.info(`TEE job requested: ${data.ipfsHash}`);
        socket.emit('tee-job-started', { ipfsHash: data.ipfsHash, timestamp: Date.now() });
        
        const job = await iexecService.runTeeJob(data.ipfsHash, data.framework);
        socket.emit('tee-job-result', job);

        // Create success alert
        alertsService.createAlert({
          title: 'TEE Job Completed',
          message: `Credit score: ${job.creditScore} (Tier ${job.riskTier})`,
          severity: 'info',
          category: 'security'
        });
      } catch (error: any) {
        socket.emit('tee-job-error', { error: error?.message || 'TEE execution failed' });
      }
    });

    // Acknowledge alert
    socket.on('acknowledge-alert', (alertId: string) => {
      const alert = alertsService.acknowledgeAlert(alertId);
      if (alert) {
        socket.emit('alert-acknowledged', { alertId, success: true });
      }
    });

    // Request fresh data
    socket.on('refresh-prices', () => {
      socket.emit('tranche-price', {
        timestamp: Date.now(),
        prices: pricingService.getPrices()
      });
    });

    socket.on('refresh-hsm', () => {
      socket.emit('hsm-update', hsmService.getStatus());
    });

    // === Cleanup on Disconnect ===
    socket.on('disconnect', () => {
      clearInterval(priceInterval);
      clearInterval(hsmInterval);
      clearInterval(alertInterval);
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
}
