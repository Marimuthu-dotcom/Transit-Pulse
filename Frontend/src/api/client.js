const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// In-memory only — never localStorage. Cleared on page reload.
let accessToken = null;

// Guards against multiple concurrent refresh requests.
let refreshPromise = null;

// Background refresh timer handle.
let refreshTimer = null;

// How early to refresh before the actual expiry (in seconds).
const REFRESH_THRESHOLD_SECONDS = 60;

// How often the background check runs (in milliseconds).
const REFRESH_CHECK_INTERVAL_MS = 10000; // every 10 seconds

export function setAccessToken(token) {
  accessToken = token;

  // Whenever a new token arrives (login, signup, manual set),
  // kick off the background refresher against it.
  if (token) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
}

export function getAccessToken() {
  return accessToken;
}

/**
 * Returns the number of seconds until the given JWT expires.
 * Returns 0 if the token is missing, malformed, or already expired.
 */
function secondsUntilExpiry(token) {
  if (!token) return 0;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return 0;
    return Math.max(0, Math.floor((payload.exp * 1000 - Date.now()) / 1000));
  } catch {
    return 0;
  }
}

/**
 * Runs on an interval. If the token has less than the threshold
 * remaining, refresh it silently. Does NOT require any API call.
 */
function startAutoRefresh() {
  stopAutoRefresh(); // clear any existing timer first

  refreshTimer = setInterval(async () => {
    if (!accessToken) {
      stopAutoRefresh();
      return;
    }

    const secondsLeft = secondsUntilExpiry(accessToken);

    // Still healthy — skip this tick.
    if (secondsLeft > REFRESH_THRESHOLD_SECONDS) return;

    // About to expire — refresh proactively.
    console.log(`[auth] Token has ${secondsLeft}s left — refreshing proactively…`);
    await tryRefresh();
  }, REFRESH_CHECK_INTERVAL_MS);
}

function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

/**
 * Wrapper around fetch that:
 *  1. Attaches the current access token to the Authorization header
 *  2. Reactively refreshes and retries once on a 401
 *
 * The proactive refresh is now handled by the background timer above,
 * so apiFetch doesn't need to check freshness itself.
 */
export async function apiFetch(path, options = {}, _retry = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Reactive safety net: if the server rejects with 401 despite our
  // background refresher, try one refresh + retry.
  if (res.status === 401 && _retry && !path.includes('/auth/refresh')) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return apiFetch(path, options, false);
    }
  }

  return res;
}

/**
 * Calls /api/auth/refresh. The browser sends the httpOnly cookie automatically.
 * Updates the in-memory accessToken. Returns true on success.
 * Deduplicates concurrent calls via refreshPromise.
 */
async function tryRefresh() {
  // If a refresh is already running, wait for it instead of starting another.
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        accessToken = null;
        stopAutoRefresh();
        return false;
      }

      const data = await res.json();
      accessToken = data.accessToken;
      return true;
    } catch {
      accessToken = null;
      stopAutoRefresh();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Helper for JSON requests.
 */
export async function apiJson(path, options = {}) {
  const res = await apiFetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ── Dev-only debug helpers ──
if (import.meta.env.DEV) {
  window.__getAccessToken = () => accessToken;
  window.__tokenInfo = () => {
    if (!accessToken) return { status: 'no token' };
    const p = JSON.parse(atob(accessToken.split('.')[1]));
    return {
      sub: p.sub,
      issuedAt: new Date(p.iat * 1000).toLocaleString(),
      expiresAt: new Date(p.exp * 1000).toLocaleString(),
      secondsLeft: Math.round((p.exp * 1000 - Date.now()) / 1000),
    };
  };
}