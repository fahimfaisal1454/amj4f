// src/Pages/NewsSection/NewsSection.jsx
import React from "react";

// ✅ If you don’t have .env, just set your backend URL here:
const API = "http://127.0.0.1:8000"; // <-- change to your domain when you deploy
const fileUrl = (p) => (p ? `${API}${p}` : "");
const FALLBACK_IMG = "/src/assets/news/placeholder.jpg";

export default function NewsSection() {
  const [items, setItems] = React.useState([]);
  const [active, setActive] = React.useState(null);

  // Fetch news items from Django
  React.useEffect(() => {
    fetch(`${API}/api/news/`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        const mapped = data
          .filter((n) => n.is_active)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((n) => ({
            tag: n.tag || "NEWS",
            tagColor: n.tag_color || "bg-pactPurple text-white",
            title: n.title,
            image: fileUrl(n.image),
            body: n.body,
          }));

        setItems(mapped);
      })
      .catch((err) => console.error("Error loading news:", err));
  }, []);

  // ESC closes modal
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="news"
      className="relative scroll-mt-[72px] min-h-screen flex flex-col justify-start pt-10 pb-16 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 blur-[2px] brightness-100"
        style={{
          backgroundImage: "url('/src/assets/backgrounds/background3.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative max-w-container mx-auto px-4">
        <h2 className="text-center text-pactPurple font-extrabold uppercase tracking-wide text-3xl sm:text-4xl drop-shadow-sm mb-10">
          Latest News and Highlights
        </h2>

        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((n, i) => (
            <article
              key={i}
              onClick={() => setActive(n)}
              className="flex cursor-pointer flex-col overflow-hidden rounded-md border border-[#dcd8d3] bg-white shadow-sm hover:shadow-md transition"
            >
              {/* ✅ Fixed: Use backend URL + fallback */}
              <img
                src={fileUrl(n.image)}
                alt={n.title}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                className="block h-48 w-full object-cover"
              />

              <div className="flex-1 bg-[#efeeec] px-5 pt-4 pb-6 border-l-8 border-[#d4d0cb]">
                <span
                  className={`inline-block rounded-md px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${n.tagColor}`}
                >
                  {n.tag}
                </span>

                <h3 className="mt-3 text-[1.05rem] leading-snug font-semibold text-[#2b2b2b]">
                  {n.title}
                </h3>

                <div className="mt-3">
                  <span className="inline-flex items-center text-sm font-semibold text-pactPurple/90 hover:text-pactPurple">
                    Read more →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
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
                src={fileUrl(active.image)}
                alt={active.title}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <span
                  className={`inline-block rounded-md px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${active.tagColor}`}
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
                {active.body || "Details coming soon."}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-[#777]">
                  Tap <kbd className="rounded bg-[#eee] px-1 py-[2px]">Esc</kbd> to close
                </span>
                <button
                  className="rounded-md bg-pactPurple px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
