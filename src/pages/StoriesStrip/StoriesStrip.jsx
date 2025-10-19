// src/Pages/StoriesStrip/StoriesStrip.jsx
import React from "react";
import bgImage from "../../assets/backgrounds/green_bg.jpg";

// Works with or without .env (VITE_API_BASE=http://127.0.0.1:8000)
const API = import.meta.env?.VITE_API_BASE || "http://127.0.0.1:8000";
const fileUrl = (p) => (p ? (p.startsWith("http") ? p : `${API}${p}`) : "");
const FALLBACK = "/src/assets/news/placeholder.jpg";

// THEME
const HIGHLIGHT = "#C5FB5A";

export default function StoriesStrip() {
  const [items, setItems] = React.useState([]);
  const [active, setActive] = React.useState(null);

  React.useEffect(() => {
    fetch(`${API}/api/stories/`)
      .then((r) => r.json())
      .then((rows) => {
        const mapped = (rows || [])
          .filter((x) => x.is_active !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((s) => ({
            tag: s.tag || "STORY",
            tagColor:
              (s.tag_color?.trim() || "").length
                ? s.tag_color
                : "bg-[#C5FB5A] text-black",
            title: s.title,
            desc: s.desc,
            body: s.body,
            image: fileUrl(s.image),
            href: s.href || "#contact",
          }));
        setItems(mapped);
      })
      .catch(() => setItems([]));
  }, []);

  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="stories"
      className="relative scroll-mt-[72px] min-h-screen flex flex-col justify-start pt-12 pb-20 overflow-hidden"
      style={{
        // backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* soft veil + subtle dot texture (same treatment across pages) */}
      <div className="absolute inset-0 bg-white/40" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)] [background-size:18px_18px]" />

      {/* Content */}
      <div className="relative max-w-container mx-auto px-4">
        <h2 className="text-center text-black font-extrabold uppercase tracking-wide text-3xl sm:text-4xl drop-shadow-sm">
          Impact Stories
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <article
              key={`${s.title}-${i}`}
              onClick={() => setActive(s)}
              className="flex cursor-pointer flex-col overflow-hidden rounded-xl ss-card hover:-translate-y-1 transition-all"
            >
              <img
                src={s.image}
                alt={s.title}
                className="h-48 w-full object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK)}
              />
              <div className="flex-1 px-5 pt-4 pb-6 border-t border-[#C5FB5A]">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${s.tagColor}`}
                >
                  {s.tag}
                </span>
                <h3 className="mt-3 text-[1.1rem] leading-snug font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.95rem] text-white/90 leading-relaxed">
                  {s.desc}
                </p>

                {/* open modal via link as well */}
                <a
                  href={s.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(s);
                  }}
                  className="mt-3 inline-flex font-semibold text-white/90 hover:underline"
                >
                  Read story →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal (details) */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header image */}
            <div className="relative h-56 w-full">
              <img
                src={active.image}
                alt={active.title}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
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
                onClick={() => setActive(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* body */}
            <div className="px-5 py-4">
              <p className="text-[0.95rem] leading-relaxed text-[#363636]">
                {active.body || active.desc}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-[#777]">
                  Press <kbd className="rounded bg-[#eee] px-1 py-[2px]">Esc</kbd> to close
                </span>
                <a
                  href={active.href || "#"}
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(null);
                  }}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition shadow-[0_6px_16px_rgba(0,0,0,0.18)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
                  style={{ backgroundColor: HIGHLIGHT, color: "black" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "black";
                    e.currentTarget.style.color = HIGHLIGHT;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = HIGHLIGHT;
                    e.currentTarget.style.color = "black";
                  }}
                >
                  Close
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Solid green card style (consistent with other sections) */}
      <style>{`
        .ss-card{
          background-color: #74B93D;             /* solid green */
          border: 2px solid #C5FB5A;             /* lime border */
          box-shadow:
            0 12px 28px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .ss-card:hover{
          box-shadow:
            0 18px 46px rgba(0,0,0,0.20),
            0 0 0 4px rgba(197,251,90,0.28);     /* soft lime aura */
        }
      `}</style>
    </section>
  );
}
