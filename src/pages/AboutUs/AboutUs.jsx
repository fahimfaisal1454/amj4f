// src/pages/AboutUs/AboutUs.jsx
import React from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const fileUrl = (p) => (p ? `${API}${p}` : "");

// THEME
const HIGHLIGHT = "#C5FB5A"; // lime accent

export default function AboutUs() {
  const [about, setAbout] = React.useState(null);
  const [heroImg, setHeroImg] = React.useState(null);
  const [stats, setStats] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch About data
  React.useEffect(() => {
    fetch(`${API}/api/about/`)
      .then((r) => r.json())
      .then((data) => {
        if (!data || Object.keys(data).length === 0) return;

        setAbout(data);
        setHeroImg(fileUrl(data.image));

        const s = [1, 2, 3, 4]
          .map((i) => ({
            k: data[`stat${i}_number`],
            v: data[`stat${i}_label`],
          }))
          .filter((x) => x.k || x.v);
        setStats(s);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-16 text-center text-black">
        Loading…
      </section>
    );
  }

  return (
    <section
      id="about"
      className="relative overflow-hidden py-12 min-h-screen"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* light veil to keep text readable over page bg */}
      <div className="absolute inset-0 bg-white/40" />

      {/* subtle paper dots */}
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] [background-size:18px_18px]" />

      <div className="relative max-w-container mx-auto px-4 text-black">
        {/* Header */}
        <div className="mb-10 text-left max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${HIGHLIGHT}, #7dfc8e)`,
              }}
            >
              {about?.heading || "About Us"}
            </span>
          </h2>
          <p className="text-neutral-700 leading-relaxed md:text-[15.5px]">
            {about?.description}
          </p>
        </div>

        {/* Intro: image + stats */}
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="relative overflow-hidden rounded-2xl aj-card">
            {heroImg && (
              <img
                src={heroImg}
                alt={about?.heading || "About image"}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, idx) => (
              <div key={idx} className="aj-card p-6 text-center">
                <div className="text-3xl font-extrabold text-white">{s.k}</div>
                <div className="mt-1 text-white/90 font-medium">{s.v}</div>
                <div
                  className="mx-auto mt-4 h-1 w-12 rounded-full"
                  style={{ backgroundColor: HIGHLIGHT }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Simple Mission / Vision / Values (no cards) */}
        <div className="mt-12 max-w-4xl mx-auto space-y-10">
          {(about?.mission_title || about?.mission_description) && (
            <section>
              <h3 className="text-2xl font-bold text-black">
                Our Mission
              </h3>
              <div
                className="mt-2 h-1 w-16 rounded-full"
                style={{ backgroundColor: HIGHLIGHT }}
              />
              {about?.mission_title && (
                <p className="mt-3 text-[15.5px] font-semibold text-black/90">
                  {about.mission_title}
                </p>
              )}
              {about?.mission_description && (
                <p className="mt-2 text-neutral-700 leading-relaxed">
                  {about.mission_description}
                </p>
              )}
            </section>
          )}

          {(about?.vision_title || about?.vision_description) && (
            <section>
              <h3 className="text-2xl font-bold text-black">
                Our Vision
              </h3>
              <div
                className="mt-2 h-1 w-16 rounded-full"
                style={{ backgroundColor: HIGHLIGHT }}
              />
              {about?.vision_title && (
                <p className="mt-3 text-[15.5px] font-semibold text-black/90">
                  {about.vision_title}
                </p>
              )}
              {about?.vision_description && (
                <p className="mt-2 text-neutral-700 leading-relaxed">
                  {about.vision_description}
                </p>
              )}
            </section>
          )}

          {(about?.values_title || about?.values_description) && (
            <section>
              <h3 className="text-2xl font-bold text-black">
                Our Values
              </h3>
              <div
                className="mt-2 h-1 w-16 rounded-full"
                style={{ backgroundColor: HIGHLIGHT }}
              />
              {about?.values_title && (
                <p className="mt-3 text-[15.5px] font-semibold text-black/90">
                  {about.values_title}
                </p>
              )}
              {about?.values_description && (
                <p className="mt-2 text-neutral-700 leading-relaxed">
                  {about.values_description}
                </p>
              )}
            </section>
          )}
        </div>
      </div>

      {/* ✅ Solid Green Card Style for stat and hero cards */}
      <style>{`
        .aj-card {
          background-color: #74B93D; /* ✅ Solid green */
          border: 2px solid #C5FB5A; /* lime border */
          border-radius: 1rem;
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .aj-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 18px 46px rgba(0, 0, 0, 0.2),
            0 0 0 4px rgba(197, 251, 90, 0.3);
        }
      `}</style>
    </section>
  );
}
