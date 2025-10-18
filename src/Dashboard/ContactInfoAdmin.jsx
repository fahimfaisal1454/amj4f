import React, { useMemo, useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS, ABS } from "../api/endpoints";

/* ============================== helpers ============================== */

function getAccessToken() {
  try {
    const key = import.meta.env.VITE_TOKEN_STORAGE_KEY || "aj_tokens";
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.access || parsed?.token || null;
  } catch {
    return null;
  }
}
function authHeaders({ isForm = false } = {}) {
  const token = getAccessToken();
  const h = {};
  if (token) h.Authorization = `Bearer ${token}`;
  if (!isForm) h["Content-Type"] = "application/json";
  return h;
}
async function parseError(res) {
  try {
    const j = await res.json();
    const msg =
      j?.detail ||
      j?.message ||
      (j && typeof j === "object" ? Object.values(j)[0] : "");
    return new Error(msg || `${res.status} ${res.statusText}`);
  } catch {
    return new Error(`${res.status} ${res.statusText}`);
  }
}

/* ============================== main ============================== */

export default function ContactInfoAdmin() {
  const { data, loading, error, refetch } = useApiQuery(ENDPOINTS.contactInfo, []);
  const info = useMemo(() => (Array.isArray(data) ? data[0] : data), [data]);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    address: "",
    hours: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // hydrate form when API responds
  useEffect(() => {
    if (info) {
      setForm({
        email: info.email || "",
        phone: info.phone || "",
        address: info.address || "",
        hours: info.hours || "",
      });
    }
  }, [info]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      const isEdit = Boolean(info?.id);
      const url = isEdit
        ? ABS(`${ENDPOINTS.contactInfoManage}${info.id}/`)
        : ABS(ENDPOINTS.contactInfoManage);

      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v ?? ""));

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders({ isForm: true }),
        body,
        credentials: "include",
      });
      if (!res.ok) throw await parseError(res);

      setMsg("✅ Saved successfully");
      await refetch();
    } catch (e) {
      setMsg(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-pactPurple mb-6">Contact Info</h1>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{String(error)}</div>}

      {!loading && !error && (
        <div className="bg-white border rounded p-6 max-w-2xl">
          <div className="grid gap-4">
            <Input name="email" label="Email" value={form.email} onChange={handleChange} />
            <Input name="phone" label="Phone" value={form.phone} onChange={handleChange} />
            <Input name="address" label="Address" value={form.address} onChange={handleChange} />
            <Input name="hours" label="Hours" value={form.hours} onChange={handleChange} />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded bg-pactPurple px-4 py-2 text-white font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : info?.id ? "Save Changes" : "Create"}
            </button>
          </div>

          {msg && <p className="mt-3 text-sm text-gray-700">{msg}</p>}
        </div>
      )}
    </DashboardLayout>
  );
}

/* ============================== subcomponent ============================== */
function Input({ name, label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        className="w-full rounded border px-3 py-2"
        value={value || ""}
        onChange={onChange}
      />
    </div>
  );
}
