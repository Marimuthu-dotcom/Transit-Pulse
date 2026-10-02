import { verifyAccessToken } from '../utils/tokens.js';

/**
 * Protects routes. Requires an `Authorization: Bearer <token>` header.
 * On success, attaches `req.user = { id, email, name }`.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch (err) {
    // Covers expired AND malformed tokens
    return res.status(401).json({ error: 'Invalid or expired token', code: err.name });
  }
}

/**
 * Same as requireAuth, but does not fail if there's no token.
 * Useful for routes that behave differently for logged-in users.
 */
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme === 'Bearer' && token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = { id: payload.sub, email: payload.email, name: payload.name };
    } catch {
      // ignore — treat as anonymous
    }
  }
  next();
}