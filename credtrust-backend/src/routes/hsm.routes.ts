import { Router } from 'express';
import { hsmService } from '../services/hsm.service';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/hsm/status
router.get('/status', (_req, res) => {
  try {
    const status = hsmService.getStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    logger.error('HSM status error:', error);
    res.status(500).json({ success: false, error: 'Failed to get HSM status' });
  }
});

// POST /api/hsm/status (legacy endpoint compatibility)
router.post('/status', (_req, res) => {
  try {
    const status = hsmService.getStatus();
    res.json({
      status: 'healthy',
      hsm_id: status.hsmId,
      key_rotation: {
        last_rotated: status.lastRotated,
        next_rotation: status.nextRotation,
      },
      provider: status.provider,
      active_keys: status.keysActive
    });
  } catch (error) {
    logger.error('HSM status error:', error);
    res.status(500).json({ success: false, error: 'Failed to get HSM status' });
  }
});

// GET /api/hsm/keys
router.get('/keys', (_req, res) => {
  try {
    const keys = hsmService.getKeys();
    res.json({
      success: true,
      keys
    });
  } catch (error) {
    logger.error('HSM keys error:', error);
    res.status(500).json({ success: false, error: 'Failed to get HSM keys' });
  }
});

// POST /api/hsm/rotate/:keyId
router.post('/rotate/:keyId', (req, res) => {
  try {
    const { keyId } = req.params;
    const key = hsmService.rotateKey(keyId);
    
    if (!key) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }

    logger.info(`Key rotation initiated: ${keyId}`);
    res.json({
      success: true,
      message: 'Key rotation initiated',
      key
    });
  } catch (error) {
    logger.error('Key rotation error:', error);
    res.status(500).json({ success: false, error: 'Failed to rotate key' });
  }
});

export default router;
