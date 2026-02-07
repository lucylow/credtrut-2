import { Router } from 'express';
import { teeController } from '../controllers/tee.controller';

const router = Router();

router.post('/protect', teeController.protect);
router.post('/run', teeController.runJob);
router.get('/status', teeController.getStatus);

export default router;
