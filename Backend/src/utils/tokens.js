import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES,
  JWT_REFRESH_EXPIRES,
  COOKIE_SECURE,
  REFRESH_COOKIE_NAME,
} from '../config/env.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

export function setRefreshCookie(res, token, maxAgeMs) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: 'lax',
    maxAge: maxAgeMs,
    path: '/',
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
}

/**
 * Convert '15m' / '7d' / '3600' to milliseconds.
 * Used to set the cookie's maxAge to match the JWT's exp.
 */
export function parseDuration(str) {
  if (!str) return 0;
  const match = String(str).match(/^(\d+)([smhd])?$/);
  if (!match) return 0;
  const n = Number(match[1]);
  const unit = match[2] || 's';
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * (multipliers[unit] || 1000);
}