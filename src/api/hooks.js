// src/api/hooks.js
import React from "react";
import api, { getTokens } from "./axios";
import { login as loginApi, logout as logoutApi, isLoggedIn } from "./auth";

export function useAuth() {
  const [authed, setAuthed] = React.useState(isLoggedIn());

  const login = async (email, password) => {
    await loginApi(email, password);
    setAuthed(true);
  };

  const logout = () => {
    logoutApi();
    setAuthed(false);
  };

  return { authed, login, logout, tokens: getTokens() };
}

export function useApiQuery(url, deps = []) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(url);
      setData(res.data);
    } catch (err) {
      setError(err?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }, [url]);

  // initial load
  React.useEffect(() => {
    fetchData();
  }, deps); // eslint-disable-line

  return { data, loading, error, refetch: fetchData };
}

export function useApiMutation() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const run = async (method, url, body) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.request({ method, url, data: body });
      return res.data;
    } catch (e) {
      setError(e?.message || "Failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, error };
}
