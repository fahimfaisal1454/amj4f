// src/Dashboard/AboutAdmin.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS, ABS } from "../api/endpoints";

/* ============================== helpers ============================== */

function getToken() {
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
  const t = getToken();
  const h = {};
  if (t) h.Authorization = `Bearer ${t}`;
  // IMPORTANT: never set Content-Type for FormData (browser sets boundary)
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
const fileUrl = (p) => (!p ? "" : ABS(p));

/* ============================== component ============================== */
export default function AboutAdmin() {
  const { data, loading, error, refetch } = useApiQuery(ENDPOINTS.about, []);
  const current = useMemo(() => (Array.isArray(data) ? data[0] : data), [data]);

  const [form, setForm] = useState({
    heading: "",
    description: "",
    stat1_number: "",
    stat1_label: "",
    stat2_number: "",
    stat2_label: "",
    stat3_number: "",
    stat3_label: "",
    stat4_number: "",
    stat4_label: "",
    mission_title: "",
    mission_description: "",
    vision_title: "",
    vision_description: "",
    values_title: "",
    values_description: "",
    cta_primary_label: "",
    cta_primary_href: "",
    cta_secondary_label: "",
    cta_secondary_href: "",
    is_active: true,
  });

  const fileMain = useRef(null);
  const fileMission = useRef(null);
  const fileVision = useRef(null);
  const fileValues = useRef(null);

  const [previewMain, setPreviewMain] = useState("");
  const [previewMission, setPreviewMission] = useState("");
  const [previewVision, setPreviewVision] = useState("");
  const [previewValues, setPreviewValues] = useState("");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // hydrate from API
  useEffect(() => {
    if (!current) return;
    setForm({
      heading: current.heading || "",
      description: current.description || "",
      stat1_number: current.stat1_number || "",
      stat1_label: current.stat1_label || "",
      stat2_number: current.stat2_number || "",
      stat2_label: current.stat2_label || "",
      stat3_number: current.stat3_number || "",
      stat3_label: current.stat3_label || "",
      stat4_number: current.stat4_number || "",
      stat4_label: current.stat4_label || "",
      mission_title: current.mission_title || "",
      mission_description: current.mission_description || "",
      vision_title: current.vision_title || "",
      vision_description: current.vision_description || "",
      values_title: current.values_title || "",
      values_description: current.values_description || "",
      cta_primary_label: current.cta_primary_label || "",
      cta_primary_href: current.cta_primary_href || "",
      cta_secondary_label: current.cta_secondary_label || "",
      cta_secondary_href: current.cta_secondary_href || "",
      is_active: Boolean(current.is_active),
    });
    setPreviewMain(fileUrl(current.image));
    setPreviewMission(fileUrl(current.mission_image));
    setPreviewVision(fileUrl(current.vision_image));
    setPreviewValues(fileUrl(current.values_image));
  }, [current]);

  // preview on file select (reusable)
  const usePreview = (ref, setter) => {
    useEffect(() => {
      const f = ref.current?.files?.[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      setter(url);
      return () => URL.revokeObjectURL(url);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref.current?.files?.length]);
  };
  usePreview(fileMain, setPreviewMain);
  usePreview(fileMission, setPreviewMission);
  usePreview(fileVision, setPreviewVision);
  usePreview(fileValues, setPreviewValues);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const changeBool = (e) => setForm({ ...form, [e.target.name]: e.target.checked });

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      const isEdit = Boolean(current?.id);

      const url = isEdit
        ? ABS(`${ENDPOINTS.aboutManage}${current.id}/`)
        : ABS(ENDPOINTS.aboutManage);

      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v ?? ""));

      if (fileMain.current?.files?.[0]) body.append("image", fileMain.current.files[0]);
      if (fileMission.current?.files?.[0]) body.append("mission_image", fileMission.current.files[0]);
      if (fileVision.current?.files?.[0]) body.append("vision_image", fileVision.current.files[0]);
      if (fileValues.current?.files?.[0]) body.append("values_image", fileValues.current.files[0]);

      // PATCH for edit → unchanged images are not required again
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders({ isForm: true }),
        body,
        credentials: "include",
      });
      if (!res.ok) throw await parseError(res);

      setMsg("✅ About saved successfully");
      await refetch();
    } catch (e) {
      setMsg(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-pactPurple">About Section</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your About page content, imagery, key stats, and mission/vision/values.
        </p>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{String(error)}</div>}

      {!loading && !error && (
        <div className="bg-white border rounded-xl p-6 space-y-8 max-w-5xl shadow-sm">
          {/* Heading & Description */}
          <SectionHeader title="Overview" />
          <div className="grid gap-5 lg:grid-cols-2">
            <Input name="heading" label="Heading" value={form.heading} onChange={change} required />
            <div className="lg:col-span-2">
              <Label strong>Description</Label>
              <textarea
                name="description"
                value={form.description}
                onChange={change}
                className="w-full rounded-lg border px-3 py-2 min-h-[120px]"
                placeholder="About description…"
              />
            </div>

            {/* Main Image */}
            <div>
              <Label strong>Upload Main Image</Label>
              <input ref={fileMain} type="file" accept="image/*" className="block w-full text-sm" />
              <p className="text-xs text-gray-500 mt-1">PNG/JPG. Recommended width ≥ 1600px.</p>
            </div>
            <PreviewCard title="Main Preview" src={previewMain} />
          </div>

          {/* Stats */}
          <SectionHeader title="Key Stats" subtitle="Showcase your impact with up to 4 stats." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border p-3">
                <Input
                  name={`stat${i}_number`}
                  label={`Stat ${i} Number`}
                  value={form[`stat${i}_number`]}
                  onChange={change}
                />
                <Input
                  name={`stat${i}_label`}
                  label={`Stat ${i} Label`}
                  value={form[`stat${i}_label`]}
                  onChange={change}
                />
              </div>
            ))}
          </div>

          {/* Mission / Vision / Values */}
          <SectionHeader title="Mission, Vision & Values" />
          <div className="grid gap-6">
            <MVVSection
              title="Mission"
              titleName="mission_title"
              descName="mission_description"
              fileRef={fileMission}
              preview={previewMission}
              form={form}
              onChange={change}
            />
            <MVVSection
              title="Vision"
              titleName="vision_title"
              descName="vision_description"
              fileRef={fileVision}
              preview={previewVision}
              form={form}
              onChange={change}
            />
            <MVVSection
              title="Values"
              titleName="values_title"
              descName="values_description"
              fileRef={fileValues}
              preview={previewValues}
              form={form}
              onChange={change}
            />
          </div>

          {/* CTAs */}
          <SectionHeader title="Call to Action" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="cta_primary_label"
              label="Primary CTA Label"
              value={form.cta_primary_label}
              onChange={change}
            />
            <Input
              name="cta_primary_href"
              label="Primary CTA URL"
              value={form.cta_primary_href}
              onChange={change}
            />
            <Input
              name="cta_secondary_label"
              label="Secondary CTA Label"
              value={form.cta_secondary_label}
              onChange={change}
            />
            <Input
              name="cta_secondary_href"
              label="Secondary CTA URL"
              value={form.cta_secondary_href}
              onChange={change}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={changeBool}
              className="h-4 w-4 accent-pactPurple"
            />
            <label htmlFor="is_active" className="text-sm font-semibold">
              Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-pactPurple px-4 py-2 text-white font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : current?.id ? "Save Changes" : "Create"}
            </button>
          </div>

          {msg && (
            <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {msg}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

/* ============================== small pieces ============================== */

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-bold">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      <div className="h-px w-full bg-gray-200 mt-2" />
    </div>
  );
}

function Label({ children, strong = false }) {
  return (
    <label className={`block mb-1 ${strong ? "text-sm font-semibold" : "text-sm font-medium"}`}>
      {children}
    </label>
  );
}

function Input({ name, label, value, onChange, required }) {
  return (
    <div>
      <Label strong>{label}</Label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border px-3 py-2"
        type="text"
      />
    </div>
  );
}

function PreviewCard({ title, src }) {
  return (
    <div>
      <Label strong>{title}</Label>
      <div className="h-32 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>
    </div>
  );
}

function MVVSection({ title, titleName, descName, fileRef, preview, form, onChange }) {
  return (
    <div className="rounded-xl border p-4">
      <h3 className="font-semibold text-base mb-3">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name={titleName} label={`${title} Title`} value={form[titleName]} onChange={onChange} />
        <div>
          <Label strong>{title} Description</Label>
          <textarea
            name={descName}
            value={form[descName]}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2 min-h-[100px]"
          />
        </div>
        <div>
          <Label strong>Upload {title} Image</Label>
          <input ref={fileRef} type="file" accept="image/*" className="block w-full text-sm" />
          <p className="text-xs text-gray-500 mt-1">PNG/JPG. Optional.</p>
        </div>
        <PreviewCard title={`${title} Preview`} src={preview} />
      </div>
    </div>
  );
}
