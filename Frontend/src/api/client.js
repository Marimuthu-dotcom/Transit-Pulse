const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// In-memory only — never localStorage. Cleared on page reload.
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

/**
 * Wrapper around fetch that:
 *  - always sends cookies (credentials: 'include')
 *  - attaches the access token if we have one
 *  - on 401, tries POST /api/auth/refresh once, then retries the original request
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

  // Auto-refresh on expired access token
  if (res.status === 401 && _retry && !path.includes('/auth/refresh')) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return apiFetch(path, options, false); // retry once
    }
  }

  return res;
}

async function tryRefresh() {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      accessToken = null;
      return false;
    }
    const data = await res.json();
    accessToken = data.accessToken;
    return true;
  } catch {
    accessToken = null;
    return false;
  }
}

/**
 * Helper for JSON requests.
 */
export async function apiJson(path, options = {}) {
  const res = await apiFetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) 
  {
    const err = new Error(data.error || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}