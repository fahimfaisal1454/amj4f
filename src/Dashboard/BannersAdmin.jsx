import React, { useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS } from "../api/endpoints";

/* ============================== helpers ============================== */

/** Build an absolute URL for create/update/delete.
 * If ENDPOINTS.banners is relative (/api/banners/), it prefixes VITE_API_BASE.
 * If it's already absolute, it uses it as-is.
 */
function buildUrl(basePath, id) {
  const isAbs = /^https?:\/\//i.test(basePath);
  const trimmed = String(basePath).replace(/\/+$/, ""); // remove trailing slash
  const path = id ? `${trimmed}/${id}/` : `${trimmed}/`;
  if (isAbs) return path; // already absolute
  const base = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");
  return `${base}${path}`;
}

/** Read the access token from localStorage (VITE_TOKEN_STORAGE_KEY=aj_tokens). */
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

/** Build headers for fetch; adds Authorization if token exists. */
function authHeaders({ isForm = false } = {}) {
  const token = getAccessToken();
  const h = {};
  if (token) h["Authorization"] = `Bearer ${token}`; // DRF SimpleJWT style
  if (!isForm) h["Content-Type"] = "application/json";
  return h;
}

/** Parse DRF error payloads into a readable Error. */
async function parseError(res) {
  try {
    const j = await res.json();
    const msg =
      j?.detail ||
      j?.message ||
      (j && typeof j === "object" ? Object.values(j)[0] : "") ||
      `${res.status} ${res.statusText}`;
    return new Error(msg);
  } catch {
    return new Error(`${res.status} ${res.statusText}`);
  }
}

/* ============================== main ============================== */

export default function BannersAdmin() {
  // List banners via your existing hook (it already handles GET auth/base)
  const { data, loading, error, refetch } = useApiQuery(ENDPOINTS.banners, []);
  const items = useMemo(() => (Array.isArray(data) ? data : data?.results ?? []), [data]);

  // UI state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // banner or null
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Modal open/close
  const openCreate = () => {
    setEditing(null);
    setSubmitError("");
    setShowModal(true);
  };
  const openEdit = (banner) => {
    setEditing(banner);
    setSubmitError("");
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setSubmitError("");
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const url = buildUrl(ENDPOINTS.banners, id);
      const res = await fetch(url, {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw await parseError(res);
      await refetch();
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  // Create/Update submit
  const handleSubmit = async (payload) => {
    setSaving(true);
    setSubmitError("");
    try {
      const isEdit = Boolean(editing?.id);
      const url = buildUrl(ENDPOINTS.banners, isEdit ? editing.id : undefined);

      const body = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") body.append(k, v);
      });

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders({ isForm: true }),
        body,
        credentials: "include",
      });
      if (!res.ok) throw await parseError(res);

      closeModal();
      await refetch();
    } catch (e) {
      setSubmitError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-pactPurple">Banners</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center rounded bg-pactPurple px-4 py-2 text-white font-semibold hover:opacity-90"
        >
          + New Banner
        </button>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{String(error)}</div>}

      {!loading && !error && (
        items.length === 0 ? (
          <div className="rounded border bg-white p-6 text-gray-600">
            No banners yet. Click <span className="font-semibold">“New Banner”</span> to create one.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => (
              <BannerCard
                key={b.id}
                banner={b}
                onEdit={() => openEdit(b)}
                onDelete={() => handleDelete(b.id)}
              />
            ))}
          </div>
        )
      )}

      {showModal && (
        <BannerModal
          initial={editing}
          onClose={closeModal}
          onSubmit={handleSubmit}
          saving={saving}
          error={submitError}
        />
      )}
    </DashboardLayout>
  );
}

/* ============================== subcomponents ============================== */

function BannerCard({ banner, onEdit, onDelete }) {
  return (
    <div className="rounded border bg-white shadow-sm overflow-hidden">
      {banner.image ? (
        <img src={banner.image} alt={banner.title || ""} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}

      <div className="p-3">
        <div className="font-semibold">{banner.title || "Untitled"}</div>
        {banner.caption && <div className="text-sm text-gray-500">{banner.caption}</div>}
        {(banner.cta_label || banner.cta_href) && (
          <div className="text-xs mt-1">
            CTA: <span className="font-medium">{banner.cta_label || "—"}</span> → {banner.cta_href || "—"}
          </div>
        )}
        <div className="text-xs mt-1">
          Status:{" "}
          {banner.is_active ? (
            <span className="text-green-600 font-semibold">Active</span>
          ) : (
            <span className="text-gray-500">Inactive</span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="rounded bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700 text-sm"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function BannerModal({ initial, onClose, onSubmit, saving, error }) {
  const isEdit = Boolean(initial?.id);
  const [title, setTitle] = useState(initial?.title || "");
  const [caption, setCaption] = useState(initial?.caption || "");
  const [ctaLabel, setCtaLabel] = useState(initial?.cta_label || "");
  const [ctaHref, setCtaHref] = useState(initial?.cta_href || "");
  const [isActive, setIsActive] = useState(Boolean(initial?.is_active)); // NEW FIELD
  const [previewUrl, setPreviewUrl] = useState(initial?.image || "");
  const fileRef = useRef(null);

  // Preview when a file is selected
  useEffect(() => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileRef.current?.files?.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title,
      caption,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      is_active: isActive, // ADD TO PAYLOAD
    };
    if (fileRef.current?.files?.[0]) payload.image = fileRef.current.files[0];
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
      {/* Scrollable panel */}
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[80vh] overflow-y-auto">
        {/* Sticky header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit Banner" : "New Banner"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-5">
          {error && <div className="rounded bg-red-50 p-3 text-red-700">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full rounded border px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Banner headline"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Caption</label>
              <input
                type="text"
                className="w-full rounded border px-3 py-2"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Short supporting text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CTA Label</label>
              <input
                type="text"
                className="w-full rounded border px-3 py-2"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="Learn more"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CTA URL</label>
              <input
                type="url"
                className="w-full rounded border px-3 py-2"
                value={ctaHref}
                onChange={(e) => setCtaHref(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            {/* NEW is_active checkbox */}
            <div className="flex items-center gap-2 lg:col-span-2">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 accent-pactPurple"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active
              </label>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">Upload Image</label>
                <input ref={fileRef} type="file" accept="image/*" className="block w-full text-sm" />
                <p className="text-xs text-gray-500 mt-1">PNG/JPG. Recommended width ≥ 1600px.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preview</label>
                <div className="h-32 rounded border bg-gray-50 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">No image selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2 hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-pactPurple px-4 py-2 text-white font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
