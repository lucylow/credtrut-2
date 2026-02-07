import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';

const router = Router();

router.post('/credit-score', chatController.getCreditScore);

export default router;
