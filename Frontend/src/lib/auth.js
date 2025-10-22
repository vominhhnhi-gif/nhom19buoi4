import axios from 'axios';

const TOKEN_KEY = 'token';
const REFRESH_MARGIN_SECONDS = 30; // refresh this many seconds before exp

let refreshTimer = null;

function parseJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch (e) {
    return null;
  }
}

export function getUserFromToken(token) {
  const t = token || getToken();
  if (!t) return null;
  return parseJwt(t);
}

function scheduleRefresh(token) {
  clearRefresh();
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return;
  const expiresAt = payload.exp * 1000;
  const now = Date.now();
  const msUntil = expiresAt - now - REFRESH_MARGIN_SECONDS * 1000;
  const delay = Math.max(0, msUntil);
  // schedule refresh
  refreshTimer = setTimeout(() => {
    refreshToken().catch(() => {});
  }, delay);
}

function clearRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

export function setToken(token) {
  if (!token) return clearToken();
  try { localStorage.setItem(TOKEN_KEY, token); } catch (e) {}
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  scheduleRefresh(token);
  try { window.dispatchEvent(new CustomEvent('auth:changed', { detail: { token } })); } catch (e) {}
}

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
}

export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
  delete axios.defaults.headers.common['Authorization'];
  clearRefresh();
  try { window.dispatchEvent(new CustomEvent('auth:changed', { detail: { token: null } })); } catch (e) {}
}

export async function refreshToken() {
  try {
    // POST to refresh endpoint; adjust path if backend differs
    const res = await axios.post('http://localhost:3000/auth/refresh');
    if (res && res.data && res.data.token) {
      setToken(res.data.token);
      return res.data.token;
    }
    // no token returned -> clear
    clearToken();
    throw new Error('No token in refresh response');
  } catch (err) {
    console.error('refreshToken failed', err && (err.response || err));
    clearToken();
    throw err;
  }
}

// initialize from existing token
try {
  const t = getToken();
  if (t) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    scheduleRefresh(t);
  }
} catch (e) {}

export default { setToken, getToken, clearToken, refreshToken };
export { getUserFromToken };
