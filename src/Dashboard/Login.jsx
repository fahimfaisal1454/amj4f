import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../api/hooks";
import { isLoggedIn } from "../api/auth";

export default function Login() {
  if (isLoggedIn()) return <Navigate to="/admin" replace />;

  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = React.useState({ username: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await login(form.username, form.password); // backend expects username+password
      nav("/admin");
    } catch {
      setErr("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen grid place-items-center bg-gradient-to-br from-[#f3e9ff] to-[#d9f3ff]">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-pactPurple mb-5">Admin Login</h1>

        {err && <p className="mb-3 text-sm text-red-600">{err}</p>}

        <label className="block text-sm font-medium">Username</label>
        <input
          className="mt-1 w-full rounded border p-2"
          value={form.username}
          onChange={(e)=>setForm({...form, username:e.target.value})}
          placeholder="admin"
          autoComplete="username"
        />

        <label className="mt-3 block text-sm font-medium">Password</label>
        <input
          className="mt-1 w-full rounded border p-2"
          type="password"
          value={form.password}
          onChange={(e)=>setForm({...form, password:e.target.value})}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded bg-pactPurple py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </section>
  );
}
