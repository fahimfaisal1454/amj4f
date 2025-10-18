// src/Dashboard/NewsAdmin.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS, ABS } from "../api/endpoints";

/* ============================== helpers ============================== */

// Turn /media/... into absolute for <img src>
const fileUrl = (p) => (!p ? "" : ABS(p));

// JWT helpers (reads from localStorage using VITE_TOKEN_STORAGE_KEY or "aj_tokens")
function getAccessToken() {
  try {
    const key = import.meta.env.VITE_TOKEN_STORAGE_KEY || "aj_tokens";
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const t = JSON.parse(raw);
    return t?.access || t?.token || null;
  } catch {
    return null;
  }
}
function authHeaders({ isForm = false } = {}) {
  const token = getAccessToken();
  const h = {};
  if (token) h.Authorization = `Bearer ${token}`;
  // IMPORTANT: don't set Content-Type for FormData
  if (!isForm) h["Content-Type"] = "application/json";
  return h;
}

// DRF error parser
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

/** If editing with PUT and no new image chosen, fetch the existing image and attach as a File */
async function fetchExistingImageFile(imagePathOrUrl) {
  if (!imagePathOrUrl) return null;
  const url = ABS(imagePathOrUrl);
  const resp = await fetch(url, { credentials: "include" });
  if (!resp.ok) return null;
  const blob = await resp.blob();
  const name =
    url.split("?")[0].split("#")[0].split("/").filter(Boolean).pop() ||
    "image.jpg";
  return new File([blob], name, { type: blob.type || "image/jpeg" });
}

/* ============================== main ============================== */

export default function NewsAdmin() {
  // GET uses read-only list
  const { data, loading, error, refetch } = useApiQuery(ENDPOINTS.news, []);
  const items = useMemo(
    () => (Array.isArray(data) ? data : data?.results ?? []),
    [data]
  );

  // UI state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // news item or null
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const openCreate = () => {
    setEditing(null);
    setSubmitError("");
    setShowModal(true);
  };
  const openEdit = (n) => {
    setEditing(n);
    setSubmitError("");
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setSubmitError("");
  };

  // DELETE -> writable endpoint
  const handleDelete = async (id) => {
    if (!confirm("Delete this news item?")) return;
    try {
      const url = ABS(`${ENDPOINTS.newsManage}${id}/`); // /api/news/manage/<id>/
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

  // CREATE/UPDATE -> writable endpoint
  const handleSubmit = async (payload) => {
    setSaving(true);
    setSubmitError("");
    try {
      const isEdit = Boolean(editing?.id);

      // Correct URLs (DRF expects trailing slash)
      const url = isEdit
        ? ABS(`${ENDPOINTS.newsManage}${editing.id}/`)
        : ABS(ENDPOINTS.newsManage);

      // Build multipart body
      const body = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") body.append(k, v);
      });

      // Require image on CREATE (model typically needs it)
      if (!isEdit && !payload.image) {
        setSubmitError("Please select an image.");
        setSaving(false);
        return;
      }

      // If PUT and no new image chosen, attach existing image file
      if (isEdit && !payload.image && editing?.image) {
        const existingFile = await fetchExistingImageFile(editing.image);
        if (existingFile) body.append("image", existingFile);
      }

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders({ isForm: true }), // Authorization only
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
        <h1 className="text-2xl font-bold text-pactPurple">News</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center rounded bg-pactPurple px-4 py-2 text-white font-semibold hover:opacity-90"
        >
          + New News
        </button>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{String(error)}</div>}

      {!loading && !error && (
        items.length === 0 ? (
          <div className="rounded border bg-white p-6 text-gray-600">
            No news yet. Click <span className="font-semibold">“New News”</span>{" "}
            to create one.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <NewsCard
                key={n.id}
                news={n}
                onEdit={() => openEdit(n)}
                onDelete={() => handleDelete(n.id)}
              />
            ))}
          </div>
        )
      )}

      {showModal && (
        <NewsModal
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

function NewsCard({ news, onEdit, onDelete }) {
  const imageUrl = fileUrl(news.image);

  return (
    <div className="rounded border bg-white shadow-sm overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={news.title || ""}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}
      <div className="p-3">
        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200">
          {news.tag || "No tag"}
        </span>
        <div className="font-semibold mt-1">{news.title || "Untitled"}</div>
        <div className="text-xs text-gray-500 mt-1">
          {news.is_active ? (
            <span className="text-green-600 font-semibold">Active</span>
          ) : (
            <span className="text-gray-500">Inactive</span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Published: {news.published_at || "—"}
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

/* ============================== modal ============================== */

function NewsModal({ initial, onClose, onSubmit, saving, error }) {
  const isEdit = Boolean(initial?.id);
  const [title, setTitle] = useState(initial?.title || "");
  const [tag, setTag] = useState(initial?.tag || "");
  const [content, setContent] = useState(initial?.content || "");
  const [publishedAt, setPublishedAt] = useState(initial?.published_at || "");
  const [isActive, setIsActive] = useState(Boolean(initial?.is_active));
  const [previewUrl, setPreviewUrl] = useState(fileUrl(initial?.image) || "");
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
      tag,
      content,
      published_at: publishedAt,
      is_active: isActive,
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
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit News" : "New News"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
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
                placeholder="News title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tag</label>
              <input
                type="text"
                className="w-full rounded border px-3 py-2"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Category or tag"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                className="w-full rounded border px-3 py-2 min-h-[120px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="News content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Published Date</label>
              <input
                type="date"
                className="w-full rounded border px-3 py-2"
                value={publishedAt || ""}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </div>

            {/* Active toggle */}
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
                <p className="text-xs text-gray-500 mt-1">
                  PNG/JPG. Recommended width ≥ 1600px.
                </p>
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
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
