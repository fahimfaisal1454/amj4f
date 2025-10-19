// src/pages/NewsSection/NewsSection.jsx
import React from "react";
import bgImage from "../../assets/backgrounds/green_bg.jpg"; // 🔁 same background as AboutUs

const API_BASE = "http://127.0.0.1:8000";
const fileUrl = (p) => (!p ? "" : p.startsWith("http") ? p : `${API_BASE}${p}`);

// THEME
const HIGHLIGHT = "#C5FB5A"; // lime

export default function NewsSection() {
  const [items, setItems] = React.useState([]);
  const [active, setActive] = React.useState(null);

  React.useEffect(() => {
    fetch(`${API_BASE}/api/news/`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data || [])
          .filter((n) => n.is_active)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((n) => ({
            tag: n.tag || "NEWS",
            tagColor: n.tag_color || "bg-[#C5FB5A] text-black",
            title: n.title,
            body: n.body,
            image: fileUrl(n.image),
          }));
        setItems(mapped);
      })
      .catch((err) => console.error("Failed to fetch news:", err));
  }, []);

  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="news"
      className="relative scroll-mt-[72px] min-h-screen flex flex-col justify-start pt-12 pb-20 overflow-hidden"
      style={{
        // backgroundImage: `url(${bgImage})`,      // ✅ same BG image as AboutUs
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* light veil + subtle dots (same treatment as AboutUs) */}
      <div className="absolute inset-0 bg-white/40" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)] [background-size:18px_18px]" />

      <div className="relative max-w-container mx-auto px-4">
        <h2 className="text-center text-black font-extrabold uppercase tracking-wide text-3xl sm:text-4xl drop-shadow-sm mb-10">
          Latest News and Highlights
        </h2>

        {items.length === 0 ? (
          <p className="text-center text-black/70">No news available.</p>
        ) : (
          <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((n, i) => (
              <article
                key={i}
                onClick={() => setActive(n)}
                className="flex cursor-pointer flex-col overflow-hidden rounded-xl news-card hover:-translate-y-1 transition-all"
              >
                {/* image stays as-is */}
                <img
                  src={n.image}
                  alt={n.title}
                  className="h-48 w-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/src/assets/news/placeholder.jpg")}
                />

                {/* green body like AboutUs cards */}
                <div className="flex-1 px-5 pt-4 pb-6 border-t border-[#C5FB5A]">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${n.tagColor}`}
                  >
                    {n.tag}
                  </span>

                  <h3 className="mt-3 text-[1.05rem] leading-snug font-semibold text-white">
                    {n.title}
                  </h3>

                  <div className="mt-3">
                    <span className="inline-flex items-center text-sm font-semibold text-white/90 hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal (unchanged styling) */}
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
            <div className="relative h-56 w-full">
              <img
                src={active.image}
                alt={active.title}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => (e.currentTarget.src = "/src/assets/news/placeholder.jpg")}
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
            <div className="px-5 py-4">
              <p className="text-[0.95rem] leading-relaxed text-[#363636]">
                {active.body || "Details coming soon."}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-[#777]">
                  Press <kbd className="rounded bg-[#eee] px-1 py-[2px]">Esc</kbd> to close
                </span>
                <button
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
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⬇️ Match AboutUs card style */}
      <style>{`
        .news-card {
          background-color: #74B93D;           /* solid green like AboutUs cards */
          border: 2px solid #C5FB5A;           /* lime border */
          box-shadow:
            0 12px 28px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .news-card:hover {
          box-shadow:
            0 18px 46px rgba(0,0,0,0.20),
            0 0 0 4px rgba(197,251,90,0.28);
        }
      `}</style>
    </section>
  );
}
