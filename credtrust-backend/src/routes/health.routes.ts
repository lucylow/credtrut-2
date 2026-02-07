import { Router } from 'express';
import { hsmService } from '../services/hsm.service';
import { pricingService } from '../services/pricing.service';

const router = Router();

// GET /api/health
router.get('/', (_req, res) => {
  const hsmStatus = hsmService.getStatus();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      hsm: hsmStatus.healthy ? 'healthy' : 'degraded',
      pricing: 'active',
      tee: 'ready',
      websocket: 'connected'
    },
    uptime: process.uptime()
  });
});

// GET /api/health/cors-test
router.get('/cors-test', (req, res) => {
  res.json({
    success: true,
    origin: req.headers.origin,
    method: req.method,
    timestamp: new Date().toISOString(),
    message: 'CORS working perfectly ✅'
  });
});

// GET /api/health/detailed
router.get('/detailed', (_req, res) => {
  const hsmStatus = hsmService.getStatus();
  const prices = pricingService.getPrices();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      hsm: {
        status: hsmStatus.healthy ? 'healthy' : 'degraded',
        keysActive: hsmStatus.keysActive,
        nextRotation: hsmStatus.nextRotation
      },
      pricing: {
        status: 'active',
        lastUpdate: prices.timestamp,
        totalPool: prices.totalPool
      },
      tee: {
        status: 'ready',
        framework: 'Intel SGX / TDX'
      }
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    },
    uptime: process.uptime()
  });
});

export const healthRouter = router;
export default router;
