// src/Dashboard/EventsAdmin.jsx
import React, { useMemo, useRef, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS, ABS } from "../api/endpoints";

/* ------------------ auth + helpers ------------------ */
function getToken() {
  try {
    const key = import.meta.env.VITE_TOKEN_STORAGE_KEY || "aj_tokens";
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.access || parsed?.token || null;
  } catch { return null; }
}
function authHeaders({ isForm=false }={}) {
  const t = getToken();
  const h = {};
  if (t) h.Authorization = `Bearer ${t}`;
  // DO NOT set Content-Type for FormData
  if (!isForm) h["Content-Type"] = "application/json";
  return h;
}
async function parseError(res) {
  try {
    const j = await res.json();
    const msg = j?.detail || j?.message || (j && typeof j === "object" ? Object.values(j)[0] : "");
    return new Error(msg || `${res.status} ${res.statusText}`);
  } catch { return new Error(`${res.status} ${res.statusText}`); }
}

/* ------------------ Page ------------------ */
export default function EventsAdmin() {
  const [tab, setTab] = useState("categories");

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-pactPurple">Events</h1>
        <div className="rounded bg-gray-100 p-1">
          {["categories","events","photos"].map(id=>(
            <button
              key={id}
              onClick={()=>setTab(id)}
              className={`px-3 py-2 rounded ${tab===id?"bg-white border":""}`}
            >
              {id[0].toUpperCase()+id.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tab==="categories" && <CategoriesTab/>}
      {tab==="events" && <EventsTab/>}
      {tab==="photos" && <PhotosTab/>}
    </DashboardLayout>
  );
}

/* ------------------ Categories ------------------ */
function CategoriesTab() {
  const { data, loading, error, refetch } =
    useApiQuery(ENDPOINTS.eventCategoriesManage, []);
  const items = useMemo(()=> Array.isArray(data)? data : data?.results ?? [], [data]);

  const [form, setForm] = useState({ name:"", slug:"", order:0, is_active:true });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg("");
    try {
      const url = editing
        ? ABS(`${ENDPOINTS.eventCategoriesManage}${editing.id}/`)
        : ABS(ENDPOINTS.eventCategoriesManage);
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: authHeaders(), credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw await parseError(res);
      setForm({ name:"", slug:"", order:0, is_active:true });
      setEditing(null);
      await refetch();
      setMsg("✅ Saved");
    } catch (e) {
      setMsg(e.message || "Save failed");
    } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete category?")) return;
    const res = await fetch(ABS(`${ENDPOINTS.eventCategoriesManage}${id}/`), {
      method:"DELETE", headers: authHeaders(), credentials:"include"
    });
    if (!res.ok) alert((await parseError(res)).message);
    else refetch();
  };

  return (
    <div className="bg-white border rounded p-4">
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <Input label="Name" value={form.name} onChange={v=>setForm({...form, name:v})} required/>
        <Input label="Slug" value={form.slug} onChange={v=>setForm({...form, slug:v})} required/>
        <Input label="Order" type="number" value={form.order} onChange={v=>setForm({...form, order:Number(v)})}/>
        <Checkbox label="Active" checked={form.is_active} onChange={v=>setForm({...form, is_active:v})}/>
        <div className="md:col-span-2">
          <button disabled={saving} className="rounded bg-pactPurple text-white px-4 py-2">
            {editing? "Save Changes" : "Create Category"}
          </button>
          {msg && <span className="ml-3 text-sm">{msg}</span>}
        </div>
      </form>

      <div className="h-px bg-gray-200 my-4" />
      {loading && "Loading…"}
      {error && <div className="text-red-600">{String(error)}</div>}
      <div className="grid gap-3 md:grid-cols-3">
        {items.map(c=>(
          <div key={c.id} className="rounded border p-3">
            <div className="font-semibold">{c.name}</div>
            <div className="text-xs text-gray-500">{c.slug}</div>
            <div className="text-xs mt-1">Order: {c.order} · {c.is_active? "Active":"Inactive"}</div>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 rounded bg-indigo-600 text-white"
                onClick={()=>{ setEditing(c); setForm({ name:c.name, slug:c.slug, order:c.order, is_active:c.is_active }); }}>
                Edit
              </button>
              <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={()=>del(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ Events ------------------ */
function EventsTab() {
  const cats = useApiQuery(ENDPOINTS.eventCategoriesManage, []);
  const events = useApiQuery(ENDPOINTS.eventsManage, []);
  const items = useMemo(()=> Array.isArray(events.data)? events.data : events.data?.results ?? [], [events.data]);

  const [form, setForm] = useState({ category:"", title:"", year:"", date:"", description:"", order:0, is_active:true });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? ABS(`${ENDPOINTS.eventsManage}${editing.id}/`) : ABS(ENDPOINTS.eventsManage);
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: authHeaders(), credentials:"include",
        body: JSON.stringify({ ...form, category: Number(form.category)||form.category })
      });
      if (!res.ok) throw await parseError(res);
      setForm({ category:"", title:"", year:"", date:"", description:"", order:0, is_active:true });
      setEditing(null);
      events.refetch();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete event?")) return;
    const res = await fetch(ABS(`${ENDPOINTS.eventsManage}${id}/`), { method:"DELETE", headers: authHeaders(), credentials:"include" });
    if (!res.ok) alert((await parseError(res)).message);
    else events.refetch();
  };

  return (
    <div className="bg-white border rounded p-4 space-y-4">
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <Select label="Category" value={form.category} onChange={v=>setForm({...form, category:v})}
          options={(cats.data||[]).map(c=>({ value:c.id, label:c.name }))} required />
        <Input label="Title" value={form.title} onChange={v=>setForm({...form, title:v})} required/>
        <Input label="Year" value={form.year} onChange={v=>setForm({...form, year:v})} required/>
        <Input label="Date" type="date" value={form.date||""} onChange={v=>setForm({...form, date:v})}/>
        <Textarea label="Description" value={form.description} onChange={v=>setForm({...form, description:v})} className="md:col-span-2"/>
        <Input label="Order" type="number" value={form.order} onChange={v=>setForm({...form, order:Number(v)})}/>
        <Checkbox label="Active" checked={form.is_active} onChange={v=>setForm({...form, is_active:v})}/>
        <div className="md:col-span-2">
          <button disabled={saving} className="rounded bg-pactPurple text-white px-4 py-2">
            {editing? "Save Changes" : "Create Event"}
          </button>
        </div>
      </form>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map(e=>(
          <div key={e.id} className="rounded border p-3">
            <div className="font-semibold">{e.title} {e.year? `(${e.year})`:""}</div>
            <div className="text-xs text-gray-500">{(cats.data||[]).find(c=>c.id===e.category)?.name || ""}</div>
            <div className="text-xs mt-1">Order: {e.order} · {e.is_active? "Active":"Inactive"}</div>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={()=>{ setEditing(e); setForm(e); }}>
                Edit
              </button>
              <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={()=>del(e.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ Photos (multi-upload + EDIT) ------------------ */
function PhotosTab() {
  const events = useApiQuery(ENDPOINTS.eventsManage, []);
  const photos = useApiQuery(ENDPOINTS.eventPhotosManage, []);
  const items = useMemo(()=> Array.isArray(photos.data)? photos.data : photos.data?.results ?? [], [photos.data]);

  const [form, setForm] = useState({ event:"", caption:"", order:0, is_active:true });
  const fileRef = useRef(null);
  const [saving, setSaving] = useState(false);

  // Local edit state per card
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ event:"", caption:"", order:0, is_active:true });
  const editFileRef = useRef(null);
  const [editSaving, setEditSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const files = Array.from(fileRef.current?.files || []);
    if (!files.length) { alert("Pick one or more images"); return; }
    if (!form.event) { alert("Choose an event"); return; }
    setSaving(true);
    try {
      await Promise.all(files.map(async (file, idx) => {
        const body = new FormData();
        body.append("event", form.event);
        body.append("caption", form.caption || "");
        body.append("order", Number(form.order) + idx);
        body.append("is_active", form.is_active);
        body.append("image", file);

        const res = await fetch(ABS(ENDPOINTS.eventPhotosManage), {
          method:"POST", headers: authHeaders({ isForm:true }), body, credentials:"include"
        });
        if (!res.ok) throw await parseError(res);
      }));
      setForm({ event:"", caption:"", order:0, is_active:true });
      if (fileRef.current) fileRef.current.value = "";
      photos.refetch();
    } catch (e) { alert(e.message); } finally { setSaving(false); }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditForm({
      event: p.event,             // assumes serializer returns event id
      caption: p.caption || "",
      order: p.order || 0,
      is_active: !!p.is_active,
    });
    if (editFileRef.current) editFileRef.current.value = "";
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ event:"", caption:"", order:0, is_active:true });
    if (editFileRef.current) editFileRef.current.value = "";
  };

  const saveEdit = async (id) => {
    setEditSaving(true);
    try {
      const body = new FormData();
      // Only send the fields that changed is optional; sending all is fine with PATCH
      body.append("event", editForm.event);
      body.append("caption", editForm.caption || "");
      body.append("order", editForm.order);
      body.append("is_active", editForm.is_active);
      if (editFileRef.current?.files?.[0]) {
        body.append("image", editFileRef.current.files[0]); // optional replace
      }

      const res = await fetch(ABS(`${ENDPOINTS.eventPhotosManage}${id}/`), {
        method:"PATCH",
        headers: authHeaders({ isForm:true }),
        body,
        credentials:"include",
      });
      if (!res.ok) throw await parseError(res);

      cancelEdit();
      photos.refetch();
    } catch (e) {
      alert(e.message);
    } finally {
      setEditSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete photo?")) return;
    const res = await fetch(ABS(`${ENDPOINTS.eventPhotosManage}${id}/`), { method:"DELETE", headers: authHeaders(), credentials:"include" });
    if (!res.ok) alert((await parseError(res)).message);
    else photos.refetch();
  };

  return (
    <div className="bg-white border rounded p-4 space-y-4">
      {/* MULTI UPLOAD */}
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <Select label="Event" value={form.event} onChange={v=>setForm({...form, event:v})}
          options={(events.data||[]).map(ev=>({ value:ev.id, label:`${ev.title} (${ev.year||""})` }))} required/>
        <Input label="Caption (applies to all, optional)" value={form.caption} onChange={v=>setForm({...form, caption:v})}/>
        <Input label="Starting Order" type="number" value={form.order} onChange={v=>setForm({...form, order:Number(v)})}/>
        <Checkbox label="Active" checked={form.is_active} onChange={v=>setForm({...form, is_active:v})}/>
        <div className="md:col-span-2">
          <input ref={fileRef} type="file" accept="image/*" multiple className="block w-full text-sm"/>
        </div>
        <div className="md:col-span-2">
          <button disabled={saving} className="rounded bg-pactPurple text-white px-4 py-2">
            {saving ? "Uploading…" : "Upload Photos"}
          </button>
        </div>
      </form>

      {/* GRID WITH EDIT/DELETE */}
      <div className="grid gap-3 md:grid-cols-3">
        {items.map(p=>(
          <div key={p.id} className="rounded border overflow-hidden">
            {p.image ? <img src={p.image} className="h-40 w-full object-cover" /> :
              <div className="h-40 w-full bg-gray-100"/>}

            <div className="p-3 text-sm">
              {editingId === p.id ? (
                <div className="space-y-2">
                  <Select
                    label="Event"
                    value={editForm.event}
                    onChange={(v)=>setEditForm({...editForm, event:v})}
                    options={(events.data||[]).map(ev=>({ value:ev.id, label:`${ev.title} (${ev.year||""})` }))}
                    required
                  />
                  <Input label="Caption" value={editForm.caption} onChange={(v)=>setEditForm({...editForm, caption:v})}/>
                  <Input label="Order" type="number" value={editForm.order} onChange={(v)=>setEditForm({...editForm, order:Number(v)})}/>
                  <Checkbox label="Active" checked={editForm.is_active} onChange={(v)=>setEditForm({...editForm, is_active:v})}/>
                  <label className="block">
                    <span className="block text-sm font-medium mb-1">Replace image (optional)</span>
                    <input ref={editFileRef} type="file" accept="image/*" className="block w-full text-sm" />
                  </label>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-green-600 text-white"
                      disabled={editSaving}
                      onClick={()=>saveEdit(p.id)}
                      type="button"
                    >
                      {editSaving ? "Saving…" : "Save"}
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-gray-300"
                      onClick={cancelEdit}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="line-clamp-2">{p.caption || "—"}</div>
                  <div className="text-xs text-gray-500 mt-1">Order: {p.order} · {p.is_active? "Active":"Inactive"}</div>
                  <div className="mt-2 flex gap-2">
                    <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={()=>startEdit(p)}>
                      Edit
                    </button>
                    <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={()=>del(p.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- tiny UI bits --- */
function Input({ label, value, onChange, type="text", className="", required }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium mb-1">{label}</span>
      <input type={type} value={value??""} onChange={e=>onChange(e.target.value)}
        required={required} className="w-full rounded border px-3 py-2"/>
    </label>
  );
}
function Textarea({ label, value, onChange, className="" }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium mb-1">{label}</span>
      <textarea value={value??""} onChange={e=>onChange(e.target.value)}
        className="w-full rounded border px-3 py-2 min-h-[100px]"/>
    </label>
  );
}
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" className="h-4 w-4 accent-pactPurple"
        checked={!!checked} onChange={e=>onChange(e.target.checked)} />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}
function Select({ label, value, onChange, options, required }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      <select value={value??""} onChange={e=>onChange(e.target.value)} required={required}
        className="w-full rounded border px-3 py-2">
        <option value="">Select…</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
