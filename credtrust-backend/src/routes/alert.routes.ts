import { Router } from 'express';
import { discordService } from '../services/discord.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { type, message, severity } = req.body;
    await discordService.sendAlert(`[${severity || 'INFO'}] ${type}: ${message}`);
    res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send alert' });
  }
});

export const alertRouter = router;
