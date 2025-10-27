// src/Dashboard/AboutAdmin.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS, ABS } from "../api/endpoints";
import { compressImage } from "../utils/compressImage.js";

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
const kb = (n) => (n ? Math.round(n / 1024) : 0);

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

  // file inputs (refs) – still used to open file-picker
  const fileMain = useRef(null);
  const fileMission = useRef(null);
  const fileVision = useRef(null);
  const fileValues = useRef(null);

  // compressed files we will actually upload
  const [mainFile, setMainFile] = useState(null);
  const [missionFile, setMissionFile] = useState(null);
  const [visionFile, setVisionFile] = useState(null);
  const [valuesFile, setValuesFile] = useState(null);

  // previews
  const [previewMain, setPreviewMain] = useState("");
  const [previewMission, setPreviewMission] = useState("");
  const [previewVision, setPreviewVision] = useState("");
  const [previewValues, setPreviewValues] = useState("");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // NEW: which section is open (Overview | Stats | MVV)
  const [active, setActive] = useState("overview");

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

    // show existing images as preview
    setPreviewMain(fileUrl(current.image));
    setPreviewMission(fileUrl(current.mission_image));
    setPreviewVision(fileUrl(current.vision_image));
    setPreviewValues(fileUrl(current.values_image));

    // clear staged files on record change
    setMainFile(null);
    setMissionFile(null);
    setVisionFile(null);
    setValuesFile(null);
  }, [current]);

  // helpers
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const changeBool = (e) =>
    setForm({ ...form, [e.target.name]: e.target.checked });

  // pick + compress + preview (shared handler)
  const handlePick = async (inputRef, setFile, setPreview) => {
    const f = inputRef.current?.files?.[0];
    if (!f) {
      setFile(null);
      // restore API image preview if any (when user clears input manually)
      if (current) {
        if (inputRef === fileMain) setPreview(fileUrl(current.image) || "");
        if (inputRef === fileMission)
          setPreview(fileUrl(current.mission_image) || "");
        if (inputRef === fileVision)
          setPreview(fileUrl(current.vision_image) || "");
        if (inputRef === fileValues)
          setPreview(fileUrl(current.values_image) || "");
      } else {
        setPreview("");
      }
      return;
    }
    try {
      const compressed = await compressImage(f); // ⬅️ uses utils/compressImage.js
      setFile(compressed);
      const obj = URL.createObjectURL(compressed);
      setPreview(obj);
    } catch {
      // if compression fails, fall back to original
      setFile(f);
      const obj = URL.createObjectURL(f);
      setPreview(obj);
    }
  };

  // revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      [previewMain, previewMission, previewVision, previewValues].forEach((u) => {
        if (u && u.startsWith("blob:")) URL.revokeObjectURL(u);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      // only append if user picked a (compressed) file
      if (mainFile) body.append("image", mainFile);
      if (missionFile) body.append("mission_image", missionFile);
      if (visionFile) body.append("vision_image", visionFile);
      if (valuesFile) body.append("values_image", valuesFile);

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

      // clear file inputs after successful save
      if (fileMain.current) fileMain.current.value = "";
      if (fileMission.current) fileMission.current.value = "";
      if (fileVision.current) fileVision.current.value = "";
      if (fileValues.current) fileValues.current.value = "";
      setMainFile(null);
      setMissionFile(null);
      setVisionFile(null);
      setValuesFile(null);
    } catch (e) {
      setMsg(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pactPurple">About Section</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your About page content, imagery, key stats, and mission/vision/values.
          </p>
        </div>

        {/* Quick actions pinned to top on desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={changeBool}
              className="h-4 w-4 accent-pactPurple"
            />
            Active
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-pactPurple px-4 py-2 text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : current?.id ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{String(error)}</div>}

      {!loading && !error && (
        <div className="bg-white border rounded-xl p-0 max-w-5xl shadow-sm overflow-hidden">
          {/* segmented navigation */}
          <SectionNav active={active} onChange={setActive} />

          <div className="p-6 space-y-8">
            {active === "overview" && (
              <div className="space-y-6">
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

                  {/* Main Image (compressed) */}
                  <div>
                    <Label strong>Upload Main Image</Label>
                    <input
                      ref={fileMain}
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm"
                      onChange={() => handlePick(fileMain, setMainFile, setPreviewMain)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      PNG/JPG. We’ll optimize to WebP (≤1600px, ≤400KB).
                      {mainFile && (
                        <span className="ml-2 text-gray-700">New: {kb(mainFile.size)} KB</span>
                      )}
                    </p>
                  </div>
                  <PreviewCard title="Main Preview" src={previewMain} />

                  {/* CTAs */}
                  <div className="lg:col-span-2">
                    <SectionHeader title="Call to Action" />
                  </div>
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
              </div>
            )}

            {active === "stats" && (
              <div className="space-y-6">
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
              </div>
            )}

            {active === "mvv" && (
              <div className="space-y-6">
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
                    onPick={() => handlePick(fileMission, setMissionFile, setPreviewMission)}
                    stagedFile={missionFile}
                  />
                  <MVVSection
                    title="Vision"
                    titleName="vision_title"
                    descName="vision_description"
                    fileRef={fileVision}
                    preview={previewVision}
                    form={form}
                    onChange={change}
                    onPick={() => handlePick(fileVision, setVisionFile, setPreviewVision)}
                    stagedFile={visionFile}
                  />
                  <MVVSection
                    title="Values"
                    titleName="values_title"
                    descName="values_description"
                    fileRef={fileValues}
                    preview={previewValues}
                    form={form}
                    onChange={change}
                    onPick={() => handlePick(fileValues, setValuesFile, setPreviewValues)}
                    stagedFile={valuesFile}
                  />
                </div>
              </div>
            )}
          </div>

          {/* sticky footer actions on mobile */}
          <div className="border-t bg-gray-50/60 p-4 flex items-center justify-between gap-3 sticky bottom-0">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                id="is_active_mobile"
                name="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={changeBool}
                className="h-4 w-4 accent-pactPurple"
              />
              Active
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-3 py-2 text-sm font-medium rounded-lg border hover:bg-gray-100"
                type="button"
              >
                Back to Top
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-pactPurple px-4 py-2 text-white font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Saving…" : current?.id ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>

          {msg && (
            <div className="m-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {msg}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

/* ============================== small pieces ============================== */

function SectionNav({ active, onChange }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "stats", label: "Key Stats" },
    { id: "mvv", label: "Mission, Vision & Values" },
  ];
  return (
    <div className="px-4 pt-3">
      <div className="mx-2 rounded-xl bg-gray-100 p-1 flex gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`whitespace-nowrap flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition
              ${active === t.id ? "bg-white shadow border" : "text-gray-600 hover:bg-white/70"}`}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

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

function MVVSection({ title, titleName, descName, fileRef, preview, form, onChange, onPick, stagedFile }) {
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
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="block w-full text-sm"
            onChange={onPick}
          />
          <p className="text-xs text-gray-500 mt-1">
            PNG/JPG. We’ll optimize to WebP (≤1600px, ≤400KB).
            {stagedFile && <span className="ml-2 text-gray-700">New: {kb(stagedFile.size)} KB</span>}
          </p>
        </div>
        <PreviewCard title={`${title} Preview`} src={preview} />
      </div>
    </div>
  );
}
