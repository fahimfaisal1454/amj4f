// src/pages/ProgramsGrid/ProgramsGrid.jsx
import React from "react";
import { ABS } from "../../api/endpoints";

const fileUrl = (p) => (!p ? "" : ABS(p));
const FALLBACK = new URL("../../assets/news/placeholder.jpg", import.meta.url).href;

// THEME
const HEADER = "#74B93D";   // green banner
const ACCENT = "#C5FB5A";   // lime accent
const DARK = "#163e1e";     // deep green for text accents

const MODAL_STATE_KEY = "programs:modal";

export default function ProgramsGrid() {
  const [programs, setPrograms] = React.useState([]);
  const [active, setActive] = React.useState(null);

  React.useEffect(() => {
    fetch(ABS(`/api/programs/`))
      .then((r) => r.json())
      .then((rows) => {
        const mapped = (rows || [])
          .filter((x) => x.is_active !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((p) => ({
            tag: p.tag || "PROGRAM",
            tagColor:
              (p.tag_color?.trim() || "").length
                ? p.tag_color
                : "bg-[#C5FB5A] text-black",
            title: p.title,
            desc: p.desc,
            body: p.body,
            image: fileUrl(p.image),
          }));
        setPrograms(mapped);
      })
      .catch(() => setPrograms([]));
  }, []);

  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && active && safeCloseModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const openModal = (p) => {
    try {
      if (!(history.state && history.state[MODAL_STATE_KEY])) {
        history.pushState({ ...(history.state || {}), [MODAL_STATE_KEY]: true }, "");
      }
    } catch {}
    setActive(p);
  };

  const safeCloseModal = () => {
    setActive(null);
    try {
      if (history.state && history.state[MODAL_STATE_KEY]) history.back();
    } catch {}
  };

  React.useEffect(() => {
    const onPop = () => active && setActive(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [active]);

  return (
    <section
      id="programs"
      className="relative scroll-mt-[72px] min-h-screen pb-20"
    >
      {/* Header */}
      <div className="relative">
        <div
          className="text-white text-2xl sm:text-3xl font-extrabold tracking-wide py-6 text-center"
          style={{ background: HEADER }}
        >
          OUR ACTIVITIES
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rotate-45"
          style={{ background: HEADER, bottom: -16 }}
        />
      </div>

      {/* Soft background pattern */}
      <div className="absolute inset-0 -z-10 bg-white/70" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,#1b1b1b_1px,transparent_0)] [background-size:18px_18px]" />

      {/* Content */}
      <div className="relative max-w-container mx-auto px-4 mt-16">
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {programs.map((p, i) => (
            <article
              key={`${p.title}-${i}`}
              onClick={() => openModal(p)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-[#e7f4da] shadow-[0_8px_26px_rgba(23,57,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_46px_rgba(23,57,0,0.14)]"
            >
              {/* Vertical accent bar (unique to Programs) */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-[6px]"
                style={{
                  background:
                    "linear-gradient(180deg, #74B93D 0%, #C5FB5A 100%)",
                }}
              />

              {/* Image */}
              <div className="relative">
                <img
                  src={p.image || FALLBACK}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                  onError={(e) => (e.currentTarget.src = FALLBACK)}
                  loading="lazy"
                  decoding="async"
                />
                {/* Tag ribbon over image */}
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-sm ${p.tagColor}`}
                >
                  {p.tag}
                </span>
              </div>

              {/* Body */}
              <div className="px-5 pt-4 pb-5">
                <h3 className="text-lg font-bold text-[#1a1a1a]">
                  {p.title}
                </h3>
                {p.desc && (
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-[#4b4b4b] line-clamp-3">
                    {p.desc}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[#d8efbd] bg-[#f8fff0] px-4 py-2 text-sm font-semibold text-[#2a4b1f] transition group-hover:bg-[#ecffd1]"
                  >
                    Explore program
                    <span
                      className="transition-transform group-hover:translate-x-0.5"
                      style={{ color: DARK }}
                    >
                      →
                    </span>
                  </button>

                  {/* tiny accent dot */}
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: ACCENT }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={safeCloseModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 w-full">
              <img
                src={active.image || FALLBACK}
                alt={active.title}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK)}
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-black/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${active.tagColor}`}
                >
                  {active.tag}
                </span>
                <h3 className="mt-2 text-2xl font-extrabold text-white drop-shadow">
                  {active.title}
                </h3>
              </div>
              <button
                className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#333] hover:bg-white"
                onClick={safeCloseModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-5">
              <p className="text-[0.98rem] leading-relaxed text-[#2f2f2f] whitespace-pre-line">
                {active.body || active.desc}
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={safeCloseModal}
                  className="rounded-full border border-[#e6f4d7] bg-white px-4 py-2 text-sm font-semibold text-[#2e2e2e] hover:bg-[#f6ffea]"
                >
                  Close
                </button>
                <a
                  href="#contact"
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                  style={{ background: ACCENT, color: "#111" }}
                >
                  Get involved
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
