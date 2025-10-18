// src/pages/AboutUs/AboutUs.jsx
import React from "react";

// API base (configure in .env: VITE_API_BASE=http://localhost:8000)
const API = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// helper to prefix /media paths from DRF
const fileUrl = (p) => (p ? `${API}${p}` : "");

// THEME
const HIGHLIGHT = "#C5FB5A"; // same lime as your Dashboard
const PAGE_BG = "bg-gradient-to-br from-lime-200 via-lime-100 to-black/80";

export default function AboutUs() {
  // ---- state built FROM backend ----
  const [about, setAbout] = React.useState(null);
  const [heroImg, setHeroImg] = React.useState(null);
  const [stats, setStats] = React.useState([]);
  const [mvv, setMvv] = React.useState([]);
  const [bullets, setBullets] = React.useState([]);
  const [journey, setJourney] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [active, setActive] = React.useState(null);

  // fetch once
  React.useEffect(() => {
    fetch(`${API}/api/about/`)
      .then((r) => r.json())
      .then((data) => {
        if (!data || Object.keys(data).length === 0) return;
        setAbout(data);

        // hero image
        setHeroImg(fileUrl(data.image));

        // stats (keep your same shape: {k, v})
        const s = [1, 2, 3, 4]
          .map((i) => ({
            k: data[`stat${i}_number`],
            v: data[`stat${i}_label`],
          }))
          .filter((x) => x.k || x.v);
        setStats(s);

        // MVV cards (themed chips)
        setMvv([
          {
            key: "Mission",
            tagColor: `bg-[${HIGHLIGHT}] text-black`,
            image: fileUrl(data.mission_image),
            title: data.mission_title,
            body: data.mission_description,
          },
          {
            key: "Vision",
            tagColor: "bg-black text-[#C5FB5A]",
            image: fileUrl(data.vision_image),
            title: data.vision_title,
            body: data.vision_description,
          },
          {
            key: "Values",
            tagColor: `bg-[${HIGHLIGHT}] text-black`,
            image: fileUrl(data.values_image),
            title: data.values_title,
            body: data.values_description,
          },
        ]);

        // What We Do items → bullets (title + text)
        const ww = (data.whatwedo_items || [])
          .filter((i) => i.is_active !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((i) => ({ title: i.title, text: i.description }));
        setBullets(ww);

        // Journey timeline
        const jr = (data.journey_entries || [])
          .filter((i) => i.is_active !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((i) => ({ year: i.year, text: i.text }));
        setJourney(jr);
      })
      .finally(() => setLoading(false));
  }, []);

  // esc closes modal
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-10 text-center">
        Loading…
      </section>
    );
  }

  return (
    <section
      id="about"
      className="scroll-mt-[72px] relative overflow-hidden py-10"
    >
      {/* background */}
      <div className={`absolute inset-0 ${PAGE_BG}`} />
      {/* subtle dotted pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.35)_1px,transparent_0)] [background-size:18px_18px]" />

      {/* Content */}
      <div className="relative max-w-container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black">
            {about?.heading || "About Us"}
          </h2>
          <p className="mt-3 max-w-3xl text-neutral-900/90">
            {about?.description}
          </p>
        </div>

        {/* Intro: image + stats */}
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="relative overflow-hidden rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/10">
            {heroImg && (
              <>
                <img
                  src={heroImg}
                  alt={about?.heading || "About image"}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white/80 backdrop-blur-sm p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/10 transition-transform hover:-translate-y-0.5"
              >
                <div className="text-3xl font-extrabold text-black">{s.k}</div>
                <div className="mt-1 text-neutral-800 font-medium">{s.v}</div>
                <div
                  className="mx-auto mt-4 h-1 w-12 rounded-full"
                  style={{ backgroundColor: HIGHLIGHT }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mission / Vision / Values (3D cards) */}
        <div className="mt-10">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {mvv.map((item, i) => (
              <article
                key={i}
                className="isolate overflow-hidden rounded-xl bg-white/95 backdrop-blur-sm border border-black/10 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:shadow-[0_18px_45px_rgba(0,0,0,0.28)] hover:-translate-y-1 cursor-pointer"
                onClick={() => setActive(item)}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.key}
                    className="block h-56 w-full object-cover"
                  />
                )}
                <div className="p-5 border-t border-black/10">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${item.tagColor}`}
                  >
                    {item.key}
                  </span>
                  {item.title && (
                    <h4 className="mt-3 text-[1.15rem] leading-snug font-semibold text-black">
                      {item.title}
                    </h4>
                  )}
                  <div className="mt-3">
                    <span className="inline-flex items-center text-sm font-semibold text-black/90 hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* What we do (3D cards) */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-black mb-8 text-center">
            What We Do
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bullets.map((b, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-xl border border-black/10 bg-white/95 p-6 shadow-[0_10px_28px_rgba(0,0,0,0.18)] hover:shadow-[0_16px_42px_rgba(0,0,0,0.28)] hover:-translate-y-1 transition-all backdrop-blur-sm"
              >
                <div>
                  <div className="text-lg font-semibold text-black mb-2">
                    {b.title}
                  </div>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    {b.text}
                  </p>
                </div>

                <div
                  className="mt-4 h-1 w-12 rounded-full"
                  style={{ backgroundColor: HIGHLIGHT }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Journey / timeline — WHITE card with 3D effect */}
        <div className="mt-12 rounded-2xl bg-white p-8 border border-[#e6e6e6] shadow-[0_12px_32px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.28)] transition-all hover:-translate-y-1">
          <h3 className="text-xl font-semibold text-black mb-4">Our Journey</h3>
          <ol className="mt-3 space-y-2 text-neutral-800">
            {journey.map((j, idx) => (
              <li key={idx}>
                <span className="font-bold text-black">{j.year}:</span>{" "}
                {j.text}
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            {about?.cta_primary_label && (
              <a
                href={about?.cta_primary_href || "#"}
                className="inline-flex items-center rounded-full px-5 py-2 text-sm font-bold shadow-[0_6px_16px_rgba(0,0,0,0.18)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition-all"
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
                {about.cta_primary_label}
              </a>
            )}
            {about?.cta_secondary_label && (
              <a
                href={about?.cta_secondary_href || "#"}
                className="inline-flex items-center rounded-full border-2 px-5 py-2 text-sm font-bold transition-all hover:-translate-y-0.5"
                style={{ borderColor: HIGHLIGHT, color: HIGHLIGHT }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = HIGHLIGHT;
                  e.currentTarget.style.color = "black";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = HIGHLIGHT;
                }}
              >
                {about.cta_secondary_label}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* MVV Modal */}
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
              {active.image && (
                <img
                  src={active.image}
                  alt={active.key}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${active.tagColor}`}
                >
                  {active.key}
                </span>
                {active.title && (
                  <h3 className="mt-2 text-2xl font-extrabold text-white drop-shadow">
                    {active.title}
                  </h3>
                )}
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
                {active.body}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-[#777]">
                  Press{" "}
                  <kbd className="rounded bg-[#eee] px-1 py-[2px]">Esc</kbd> to
                  close
                </span>
                <button
                  className="rounded-full px-4 py-2 text-sm font-semibold transition"
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
    </section>
  );
}
