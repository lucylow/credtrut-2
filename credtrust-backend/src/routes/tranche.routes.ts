import { Router } from 'express';
import { trancheController } from '../controllers/tranche.controller';

const router = Router();

router.get('/prices', trancheController.getPrices);
router.get('/:id', trancheController.getTrancheDetails);
router.post('/mint', trancheController.mint);

export default router;
