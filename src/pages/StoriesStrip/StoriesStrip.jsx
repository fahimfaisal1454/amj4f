// src/Pages/StoriesStrip/StoriesStrip.jsx
import React from "react";

// Works with or without .env (VITE_API_BASE=http://127.0.0.1:8000)
const API = import.meta.env?.VITE_API_BASE || "http://127.0.0.1:8000";
const fileUrl = (p) => (p ? (p.startsWith("http") ? p : `${API}${p}`) : "");
const FALLBACK = "/src/assets/news/placeholder.jpg"; // optional

export default function StoriesStrip() {
  const [items, setItems] = React.useState([]); // replaces STORIES
  const [active, setActive] = React.useState(null);

  // fetch stories once
  React.useEffect(() => {
    fetch(`${API}/api/stories/`)
      .then((r) => r.json())
      .then((rows) => {
        const mapped = (rows || [])
          .filter((x) => x.is_active !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((s) => ({
            tag: s.tag || "STORY",
            tagColor: s.tag_color?.trim() || "bg-pactPurple text-white",
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

  // close on ESC (unchanged)
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="stories"
      className="relative scroll-mt-[72px] min-h-screen flex flex-col justify-start pt-10 pb-16 overflow-hidden"
    >
      {/* Background image with light blur */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 blur-[3px] brightness-95"
        style={{ backgroundImage: "url('/src/assets/backgrounds/blue-gradient.jpg')" }}
      />
      {/* Soft veil for readability */}
      <div className="absolute inset-0 bg-white/30" />

      {/* Content */}
      <div className="relative max-w-container mx-auto px-4">
        <h2 className="text-center text-pactPurple font-extrabold uppercase tracking-wide text-3xl sm:text-4xl drop-shadow-sm">
          Impact Stories
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <article
              key={`${s.title}-${i}`}
              onClick={() => setActive(s)}
              className="flex cursor-pointer flex-col overflow-hidden rounded-md border border-[#dcd8d3] bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={s.image}
                alt={s.title}
                className="h-48 w-full object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK)}
              />
              <div className="flex-1 bg-[#efeeec] px-5 pt-4 pb-6 border-l-8 border-[#d4d0cb]">
                <span
                  className={`inline-block rounded-md px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${s.tagColor}`}
                >
                  {s.tag}
                </span>
                <h3 className="mt-3 text-[1.1rem] leading-snug font-semibold text-[#2b2b2b]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.95rem] text-[#444] leading-relaxed">
                  {s.desc}
                </p>
                {/* keep the link, but intercept to open modal */}
                <a
                  href={s.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(s);
                  }}
                  className="mt-3 inline-flex font-semibold text-pactPurple hover:underline"
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
                src={active.image}
                alt={active.title}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK)}
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
                {active.body || active.desc}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-[#777]">
                  Press <kbd className="rounded bg-[#eee] px-1 py-[2px]">Esc</kbd> to close
                </span>
                <a
                  href={active.href || "#"}
                  onClick={(e) => e.preventDefault()}
                  className="rounded-md bg-pactPurple px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  Close
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
