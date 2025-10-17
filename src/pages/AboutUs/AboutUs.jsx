// src/pages/AboutUs/AboutUs.jsx
import React from "react";

// API base (configure in .env: VITE_API_BASE=http://localhost:8000)
const API = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// helper to prefix /media paths from DRF
const fileUrl = (p) => (p ? `${API}${p}` : "");

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

        // MVV cards (keep your same color scheme & structure)
        setMvv([
          {
            key: "Mission",
            tagColor: "bg-pactPurple text-white",
            image: fileUrl(data.mission_image),
            title: data.mission_title,
            body: data.mission_description,
          },
          {
            key: "Vision",
            tagColor: "bg-yellow-400 text-black",
            image: fileUrl(data.vision_image),
            title: data.vision_title,
            body: data.vision_description,
          },
          {
            key: "Values",
            tagColor: "bg-green-500 text-white",
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
    <section id="about" className="scroll-mt-[72px] relative overflow-hidden py-5">
      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f3e9ff] via-white to-[#d9f3ff]" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.3)_1px,transparent_0)] [background-size:20px_20px]" />

      {/* Content */}
      <div className="relative max-w-container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-pactPurple">
            {about?.heading || "About Us"}
          </h2>
          <p className="mt-3 max-w-3xl text-neutral-700">
            {about?.description}
          </p>
        </div>

        {/* Intro: image + stats */}
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            {heroImg && (
              <>
                <img
                  src={heroImg}
                  alt={about?.heading || "About image"}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent" />
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.v} className="rounded-xl bg-pactBg p-6 text-center shadow">
                <div className="text-3xl font-extrabold text-pactPurple">{s.k}</div>
                <div className="mt-1 text-neutral-700 font-medium">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission / Vision / Values */}
        <div className="mt-5">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {mvv.map((item, i) => (
              <article
                key={i}
                className="isolate overflow-hidden rounded-md border border-[#dcd8d3] bg-white cursor-pointer"
                onClick={() => setActive(item)}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.key}
                    className="block h-56 w-full object-cover"
                  />
                )}
                <div className="bg-[#efeeec] p-5 border-l-8 border-[#d4d0cb]">
                  <span
                    className={`inline-block rounded-md px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${item.tagColor}`}
                  >
                    {item.key}
                  </span>
                  {item.title && (
                    <h4 className="mt-3 text-[1.15rem] leading-snug font-semibold text-[#2b2b2b]">
                      {item.title}
                    </h4>
                  )}
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

        {/* What we do */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-pactPurple mb-8 text-center">
            What We Do
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bullets.map((b, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-lg border border-gray-200 bg-[#f8f7f6] p-6 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="text-lg font-semibold text-pactPurple mb-2">
                    {b.title}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {b.text}
                  </p>
                </div>

                <div className="mt-4 h-1 w-12 bg-pactPurple rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey / timeline */}
        <div className="mt-12 rounded-2xl bg-pactBg p-6 shadow">
          <h3 className="text-xl font-semibold text-pactPurple">Our Journey</h3>
          <ol className="mt-3 space-y-2 text-neutral-700">
            {journey.map((j, idx) => (
              <li key={idx}>
                <span className="font-semibold">{j.year}:</span> {j.text}
              </li>
            ))}
          </ol>

          <div className="mt-5 flex flex-wrap gap-3">
            {about?.cta_primary_label && (
              <a
                href={about?.cta_primary_href || "#"}
                className="inline-flex items-center rounded-lg bg-pactPurple px-4 py-2 font-bold text-white hover:opacity-90"
              >
                {about.cta_primary_label}
              </a>
            )}
            {about?.cta_secondary_label && (
              <a
                href={about?.cta_secondary_href || "#"}
                className="inline-flex items-center rounded-lg border-2 border-pactPurple px-4 py-2 font-bold text-pactPurple hover:bg-pactPurple/5"
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <span
                  className={`inline-block rounded-md px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${active.tagColor}`}
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
                  Press <kbd className="rounded bg-[#eee] px-1 py-[2px]">Esc</kbd> to close
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
