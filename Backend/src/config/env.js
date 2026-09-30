import dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';

// ── Server ──
export const PORT = Number(process.env.PORT) || 3000;
export const HOST = process.env.HOST || '0.0.0.0';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// ── Database ──
export const DB = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'transitpulse',
};

// ── External APIs ──
export const GEMINI_API_KEY      = process.env.GEMINI_API_KEY;
export const MAPS_API_KEY        = process.env.VITE_GOOGLE_MAPS_API_KEY;

// ── Helpers ──
export const isGeminiConfigured = () => Boolean(GEMINI_API_KEY);
export const isMapsConfigured   = () => Boolean(MAPS_API_KEY);