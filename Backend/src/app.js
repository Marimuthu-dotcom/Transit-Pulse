import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { CORS_ORIGIN } from './config/env.js';

import healthRoutes  from './routes/health.routes.js';
import transitRoutes from './routes/transit.routes.js';
import aiRoutes      from './routes/ai.routes.js';
import authRoutes    from './routes/auth.routes.js';   // NEW

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // ── Route mounts ──
  app.use('/api/health',  healthRoutes);
  app.use('/api/transit', transitRoutes);
  app.use('/api/ai',      aiRoutes);
  app.use('/api/auth',    authRoutes);   // NEW

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
  });

  app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: err.message });
  });

  return app;
}