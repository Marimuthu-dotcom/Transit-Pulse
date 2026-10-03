import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import db from '../config/db.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
  parseDuration,
} from '../utils/tokens.js';
import {
  GOOGLE_CLIENT_ID,
  JWT_REFRESH_EXPIRES,
  REFRESH_COOKIE_NAME,
} from '../config/env.js';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const REFRESH_MAX_AGE = parseDuration(JWT_REFRESH_EXPIRES);

// ── Helpers ──────────────────────────────────────────────────────────────

function makeUserPayload(row) {
  return { id: row.id, email: row.email, name: row.name };
}

function makeAccessPayload(row) {
  return { sub: String(row.id), email: row.email, name: row.name };
}

async function findUserByEmail(email) {
  const [rows] = await db.promise().query(
    'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await db.promise().query(
    'SELECT id, name, email FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

async function createUser({ name, email, password_hash }) {
  const [result] = await db.promise().query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, password_hash]
  );
  return findUserById(result.insertId);
}

function issueTokens(res, user) {
  const accessToken = signAccessToken(makeAccessPayload(user));
  const refreshToken = signRefreshToken({ sub: String(user.id) });

  setRefreshCookie(res, refreshToken, REFRESH_MAX_AGE);

  return { accessToken, user: makeUserPayload(user) };
}

// ── Controllers ──────────────────────────────────────────────────────────

export async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password_hash });

    const tokens = issueTokens(res, user);
    return res.status(201).json(tokens);
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tokens = issueTokens(res, user);
    return res.json(tokens);
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
}

export async function googleAuth(req, res) {
  try {
    const { credential, intent } = req.body || {};

    if (!credential) {
      return res.status(400).json({ error: 'Missing Google credential' });
    }
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Server missing GOOGLE_CLIENT_ID' });
    }
    if (intent !== 'login' && intent !== 'signup') {
      return res.status(400).json({ error: 'Missing or invalid intent (must be "login" or "signup")' });
    }

    // Verify the credential with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, email_verified } = payload;

    if (!email || !email_verified) {
      return res.status(401).json({ error: 'Google account email not verified' });
    }

    const existingUser = await findUserByEmail(email);

    // ── SIGN IN flow ─────────────────────────────────────────────
    if (intent === 'login') {
      if (!existingUser) {
        return res.status(404).json({
          error: 'No account found with this Google email. Please sign up first.',
          code: 'NO_ACCOUNT',
        });
      }
      // User exists → issue tokens
      const tokens = issueTokens(res, existingUser);
      return res.json({ ...tokens, picture });
    }

    // ── SIGN UP flow ─────────────────────────────────────────────
    if (intent === 'signup') {
      if (existingUser) {
        return res.status(409).json({
          error: 'An account with this email already exists. Please sign in instead.',
          code: 'ACCOUNT_EXISTS',
        });
      }
      // New user → create account
      const password_hash = await bcrypt.hash(
        crypto.randomBytes(32).toString('hex'),
        10
      );
      const newUser = await createUser({
        name: name || email.split('@')[0],
        email,
        password_hash,
      });

      const tokens = issueTokens(res, newUser);
      return res.status(201).json({ ...tokens, picture });
    }
  } catch (err) {
    console.error('googleAuth error:', err);
    return res.status(401).json({ error: 'Google authentication failed' });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: 'No refresh token' });
    }

    const payload = verifyRefreshToken(token); // throws if invalid/expired
    const user = await findUserById(payload.sub);

    if (!user) {
      clearRefreshCookie(res);
      return res.status(401).json({ error: 'User no longer exists' });
    }

    // Rotate: issue a fresh access token AND a fresh refresh token
    const tokens = issueTokens(res, user);
    return res.json(tokens);
  } catch (err) {
    clearRefreshCookie(res);
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
}

export async function logout(req, res) {
  clearRefreshCookie(res);
  return res.json({ ok: true });
}

export async function me(req, res) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: makeUserPayload(user) });
  } catch (err) {
    console.error('me error:', err);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
}