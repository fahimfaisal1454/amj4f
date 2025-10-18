// src/api/axios.js
import axios from "axios";
import { ENDPOINTS } from "./endpoints";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || "aj_tokens";

// Safer token getters
export function getTokens() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
export function setTokens(tokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens || {}));
}
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
}

// Always have a valid base URL (env → ENDPOINTS.base → fallback)
const base =
  import.meta.env.VITE_API_BASE ||
  ENDPOINTS?.base ||
  "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: base,          // e.g. http://127.0.0.1:8000
  withCredentials: true,  // keep if you also use session/CSRF
});

// Attach Authorization on every request
api.interceptors.request.use((config) => {
  const t = getTokens();
  const access =
    t?.access ||
    t?.token ||
    t?.access_token ||
    t?.auth?.access || null; // be lenient about shape
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!refreshing) {
        refreshing = refreshAccessToken().finally(() => (refreshing = null));
      }
      try {
        await refreshing;
        return api(original);
      } catch {
        clearTokens();
        // Let caller handle redirect to /login
      }
    }
    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  const { refresh } = getTokens();
  if (!refresh) throw new Error("No refresh token");

  const url =
    (import.meta.env.VITE_API_BASE || base) + ENDPOINTS.refresh; // e.g. /api/token/refresh/
  const res = await axios.post(url, { refresh }, { withCredentials: true });
  const newTokens = { ...getTokens(), access: res.data.access };
  setTokens(newTokens);
}

export default api;
