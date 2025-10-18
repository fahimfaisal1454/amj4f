// src/api/auth.js
import axios from "axios";
import { ENDPOINTS } from "./endpoints";
import { setTokens, clearTokens, getTokens } from "./axios";

export async function login(email, password) {
  const res = await axios.post(ENDPOINTS.base + ENDPOINTS.login, {
    username: email,   // or "email" if your backend expects it
    password,
  });
  const tokens = {
    access: res.data.access,
    refresh: res.data.refresh,
  };
  setTokens(tokens);
  return tokens;
}

export function logout() {
  clearTokens();
}

export function isLoggedIn() {
  const t = getTokens();
  return Boolean(t?.access);
}
