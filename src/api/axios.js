import axios from "axios";
import { API_BASE, ENDPOINTS, ABS } from "./endpoints";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || "aj_tokens";

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

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const t = getTokens();
  const access = t?.access || t?.token || t?.access_token || null;
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
      }
    }
    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  const { refresh } = getTokens();
  if (!refresh) throw new Error("No refresh token");

  const url = ABS(ENDPOINTS.refresh);
  const res = await axios.post(url, { refresh }, { withCredentials: true });
  const newTokens = { ...getTokens(), access: res.data.access };
  setTokens(newTokens);
}

export default api;
