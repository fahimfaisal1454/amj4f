// src/api/axios.js
import axios from "axios";
import { ENDPOINTS } from "./endpoints";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || "aj_tokens";

export function getTokens() {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}");
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
  baseURL: ENDPOINTS.base,
});

api.interceptors.request.use((config) => {
  const { access } = getTokens();
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
        // Let caller handle redirect
      }
    }
    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  const { refresh } = getTokens();
  if (!refresh) throw new Error("No refresh token");

  const res = await axios.post(
    ENDPOINTS.base + ENDPOINTS.refresh,
    { refresh }
  );
  const newTokens = { ...getTokens(), access: res.data.access };
  setTokens(newTokens);
}

export default api;
