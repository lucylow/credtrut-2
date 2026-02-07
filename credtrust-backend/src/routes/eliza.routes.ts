import { Router } from 'express';
import { elizaController } from '../controllers/eliza.controller';

const router = Router();

router.post('/chat', elizaController.chat);
router.get('/agents', elizaController.getAgents);

export default router;
