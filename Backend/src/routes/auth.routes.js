import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  refresh,
  logout,
  me,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login',    login);
router.post('/google',   googleAuth);
router.post('/refresh',  refresh);
router.post('/logout',   logout);
router.get('/me',        requireAuth, me);

export default router;