import { Router } from 'express';
import { getLiveEta } from '../controllers/transit.controller.js';

const router = Router();
router.get('/live-eta', getLiveEta);

export default router;