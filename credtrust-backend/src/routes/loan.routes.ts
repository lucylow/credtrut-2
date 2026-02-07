import { Router } from 'express';
import { loanController } from '../controllers/loan.controller';

const router = Router();

router.post('/apply', loanController.apply);

export default router;
