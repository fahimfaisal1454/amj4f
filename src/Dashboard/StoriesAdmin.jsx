// src/Dashboard/StoriesAdmin.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS } from "../api/endpoints";

/* helpers (same pattern as ProgramsAdmin) */
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");
const buildUrl = (base, id) => {
  const trimmed = String(base).replace(/\/+$/, "");
  const path = id ? `${trimmed}/${id}/` : `${trimmed}/`;
  return /^https?:\/\//i.test(base) ? path : `${API_BASE}${path}`;
};
const fileUrl = (p) => (p ? (/^https?:\/\//i.test(p) ? p : `${API_BASE}${p}`) : "");
const getAccessToken = () => {
  try {
    const key = import.meta.env.VITE_TOKEN_STORAGE_KEY || "aj_tokens";
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw)?.access || JSON.parse(raw)?.token || null) : null;
  } catch { return null; }
};
const authHeaders = ({ isForm = false } = {}) => {
  const t = getAccessToken();
  const h = {};
  if (t) h.Authorization = `Bearer ${t}`;
  if (!isForm) h["Content-Type"] = "application/json";
  return h;
};
const parseError = async (res) => {
  try {
    const j = await res.json();
    const msg = j?.detail || j?.message || (j && typeof j === "object" ? Object.values(j)[0] : "");
    return new Error(msg || `${res.status} ${res.statusText}`);
  } catch { return new Error(`${res.status} ${res.statusText}`); }
};

export default function StoriesAdmin() {
  const { data, loading, error, refetch } = useApiQuery(ENDPOINTS.stories, []);
  const items = useMemo(() => (Array.isArray(data) ? data : data?.results ?? []), [data]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const openCreate = () => { setEditing(null); setSubmitError(""); setShowModal(true); };
  const openEdit = (item) => { setEditing(item); setSubmitError(""); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setSubmitError(""); };

  const handleDelete = async (id) => {
    if (!confirm("Delete this story?")) return;
    try {
      const url = buildUrl(ENDPOINTS.storiesManage, id);
      const res = await fetch(url, { method: "DELETE", headers: authHeaders(), credentials: "include" });
      if (!res.ok) throw await parseError(res);
      await refetch();
    } catch (e) { alert(e.message || "Delete failed"); }
  };

  const handleSubmit = async (payload) => {
    setSaving(true); setSubmitError("");
    try {
      const isEdit = Boolean(editing?.id);
      const url = buildUrl(ENDPOINTS.storiesManage, isEdit ? editing.id : undefined);
      const body = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") body.append(k, v);
      });
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders({ isForm: true }),
        body, credentials: "include",
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
        <h1 className="text-2xl font-bold text-pactPurple">Stories</h1>
        <button onClick={openCreate} className="rounded bg-pactPurple px-4 py-2 text-white font-semibold hover:opacity-90">
          + New Story
        </button>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{String(error)}</div>}

      {!loading && !error && (
        items.length === 0 ? (
          <div className="rounded border bg-white p-6 text-gray-600">
            No stories yet. Click <span className="font-semibold">“New Story”</span> to create one.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => (
              <StoryCard key={s.id} story={s} onEdit={() => openEdit(s)} onDelete={() => handleDelete(s.id)} />
            ))}
          </div>
        )
      )}

      {showModal && (
        <StoryModal initial={editing} onClose={closeModal} onSubmit={handleSubmit} saving={saving} error={submitError} />
      )}
    </DashboardLayout>
  );
}

function StoryCard({ story, onEdit, onDelete }) {
  const imageUrl = fileUrl(story.image);
  return (
    <div className="rounded border bg-white shadow-sm overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={story.title || ""} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
      )}
      <div className="p-3">
        <div className="text-[10px] px-2 py-0.5 rounded bg-gray-200 inline-block">{story.tag}</div>
        <div className="font-semibold mt-1">{story.title || "Untitled"}</div>
        <div className="text-sm text-gray-600 mt-1">{story.desc || "No description"}</div>
        {story.href && <a href={story.href} className="text-xs text-indigo-600 underline mt-1 inline-block">Link</a>}
        <div className="text-xs mt-1">
          {story.is_active ? <span className="text-green-600 font-semibold">Active</span> : <span className="text-gray-500">Inactive</span>}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button onClick={onEdit} className="rounded bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700 text-sm">Edit</button>
          <button onClick={onDelete} className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
}

function StoryModal({ initial, onClose, onSubmit, saving, error }) {
  const isEdit = Boolean(initial?.id);
  const [title, setTitle] = useState(initial?.title || "");
  const [desc, setDesc] = useState(initial?.desc || "");
  const [tag, setTag] = useState(initial?.tag || "STORY"); // optional; model defaults to STORY
  const [href, setHref] = useState(initial?.href || "");
  const [isActive, setIsActive] = useState(Boolean(initial?.is_active));
  const [previewUrl, setPreviewUrl] = useState(fileUrl(initial?.image) || "");
  const fileRef = useRef(null);

  useEffect(() => {
    const f = fileRef.current?.files?.[0];
    if (!f) return;
    const obj = URL.createObjectURL(f);
    setPreviewUrl(obj);
    return () => URL.revokeObjectURL(obj);
  }, [fileRef.current?.files?.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { title, desc, tag, href, is_active: isActive };
    if (fileRef.current?.files?.[0]) payload.image = fileRef.current.files[0];
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit Story" : "New Story"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-5">
          {error && <div className="rounded bg-red-50 p-3 text-red-700">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" className="w-full rounded border px-3 py-2" value={title}
                     onChange={(e) => setTitle(e.target.value)} placeholder="Story title" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tag (optional)</label>
              <input type="text" className="w-full rounded border px-3 py-2" value={tag}
                     onChange={(e) => setTag(e.target.value)} placeholder="STORY / FEATURED / …" />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea className="w-full rounded border px-3 py-2 min-h-[100px]" value={desc}
                        onChange={(e) => setDesc(e.target.value)} placeholder="Short summary…" />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-1">Link (optional)</label>
              <input type="url" className="w-full rounded border px-3 py-2" value={href}
                     onChange={(e) => setHref(e.target.value)} placeholder="https://example.com/post" />
            </div>

            <div className="flex items-center gap-2 lg:col-span-2">
              <input id="isActive" type="checkbox" checked={isActive}
                     onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-pactPurple" />
              <label htmlFor="isActive" className="text-sm font-medium">Active</label>
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
                  {previewUrl ? <img src={previewUrl} alt="" className="h-full w-full object-cover" /> :
                    <span className="text-gray-400 text-sm">No image selected</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded border px-4 py-2 hover:bg-gray-50" disabled={saving}>Cancel</button>
            <button type="submit" disabled={saving} className="rounded bg-pactPurple px-4 py-2 text-white font-semibold hover:opacity-90 disabled:opacity-60">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
