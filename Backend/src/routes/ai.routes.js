import { Router } from 'express';
import { postTransitChat, postTTS } from '../controllers/ai.controller.js';

const router = Router();
router.post('/transit-chat', postTransitChat);
router.post('/tts',          postTTS);

export default router;