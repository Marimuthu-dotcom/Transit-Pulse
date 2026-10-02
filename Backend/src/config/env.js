import dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const isProduction = NODE_ENV === 'production';

export const PORT = Number(process.env.PORT) || 3000;
export const HOST = process.env.HOST || '0.0.0.0';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

export const DB = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'transitpulse',
};

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const isGeminiConfigured = () => Boolean(GEMINI_API_KEY);
export const isMapsConfigured = () => Boolean(MAPS_API_KEY);

// ── JWT ──
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
export const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

// ── Cookie ──
export const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';
export const REFRESH_COOKIE_NAME = 'tp_refresh';

// Sanity check at boot
if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  console.warn('⚠️  JWT secrets are missing. Authentication will not work. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in .env');
}