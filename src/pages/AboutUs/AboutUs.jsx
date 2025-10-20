// src/pages/AboutUs/AboutUs.jsx
import React from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const fileUrl = (p) => (p ? `${API}${p}` : "");

// THEME
const ACCENT = "#C5FB5A"; // lime accent
const BRAND  = "#74B93D"; // green brand

export default function AboutUs() {
  const [about, setAbout] = React.useState(null);
  const [heroImg, setHeroImg] = React.useState(null);
  const [stats, setStats] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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
      className="relative overflow-hidden py-12"
    >
      {/* page texture */}
      <div className="absolute inset-0 bg-white/50" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)] [background-size:18px_18px]" />

      <div className="relative max-w-7xl mx-auto px-4 text-black">
        {/* ========= Hero ========= */}
        <header className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#1b5930]">
              About
            </p>

            <h1 className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${ACCENT}, #7dfc8e)`,
                }}
              >
                {about?.heading || "About Us"}
              </span>
            </h1>

            {about?.description && (
              <p className="mt-4 text-neutral-700 leading-relaxed md:text-[15.5px] max-w-2xl">
                {about.description}
              </p>
            )}

            {/* CTAs if present */}
            {(about?.cta_primary_label || about?.cta_secondary_label) && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {about?.cta_primary_label && about?.cta_primary_href && (
                  <a
                    href={about.cta_primary_href}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-black shadow-sm hover:opacity-90"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {about.cta_primary_label}
                  </a>
                )}
                {about?.cta_secondary_label && about?.cta_secondary_href && (
                  <a
                    href={about.cta_secondary_href}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border hover:bg-gray-50"
                    style={{ borderColor: ACCENT }}
                  >
                    {about.cta_secondary_label}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* hero image */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl shadow ring-1 ring-black/5">
              {heroImg ? (
                <>
                  <img
                    src={heroImg}
                    alt={about?.heading || "About image"}
                    className="h-[280px] w-full object-cover sm:h-[340px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </>
              ) : (
                <div className="h-[280px] sm:h-[340px] w-full bg-gray-100" />
              )}
              <div
                className="absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-black"
                style={{ backgroundColor: ACCENT }}
              >
                Our Story
              </div>
            </div>
          </div>
        </header>

        {/* ========= Stats ========= */}
        {!!stats.length && (
          <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="rounded-2xl border bg-white/70 backdrop-blur px-5 py-6 shadow-sm hover:shadow-md transition"
                style={{ borderColor: ACCENT }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold" style={{ color: BRAND }}>
                    {s.k}
                  </span>
                </div>
                <div className="mt-1 text-sm text-[#334155] font-medium">{s.v}</div>
                <div className="mt-4 h-1 w-10 rounded-full" style={{ backgroundColor: ACCENT }} />
              </div>
            ))}
          </section>
        )}

        {/* ========= Mission / Vision / Values ========= */}
        <section className="mt-14 space-y-10">
          {/* Mission */}
          {(about?.mission_title || about?.mission_description) && (
            <Block
              kicker="Our Mission"
              title={about?.mission_title}
              body={about?.mission_description}
              image={fileUrl(about?.mission_image)}
              accent={ACCENT}
              brand={BRAND}
            />
          )}

          {/* Vision */}
          {(about?.vision_title || about?.vision_description) && (
            <Block
              kicker="Our Vision"
              title={about?.vision_title}
              body={about?.vision_description}
              image={fileUrl(about?.vision_image)}
              // flip layout for variety
              reverse
              accent={ACCENT}
              brand={BRAND}
            />
          )}

          {/* Values */}
          {(about?.values_title || about?.values_description) && (
            <Block
              kicker="Our Values"
              title={about?.values_title}
              body={about?.values_description}
              image={fileUrl(about?.values_image)}
              accent={ACCENT}
              brand={BRAND}
            />
          )}
        </section>
      </div>
    </section>
  );
}

/* ----------------------------- Small Pieces ----------------------------- */

function Block({ kicker, title, body, image, reverse = false, accent, brand }) {
  return (
    <article
      className={`grid items-center gap-8 lg:gap-10 ${reverse ? "lg:grid-cols-[1fr_520px]" : "lg:grid-cols-[520px_1fr]"}`}
    >
      {/* image */}
      <div className={`${reverse ? "order-last lg:order-first" : ""}`}>
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-black/5 shadow">
          {image ? (
            <img src={image} alt={kicker} className="h-[260px] w-full object-cover sm:h-[320px]" />
          ) : (
            <div className="h-[260px] sm:h-[320px] w-full bg-gray-100" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-[4px]" style={{ backgroundColor: accent }} />
        </div>
      </div>

      {/* text */}
      <div className={`${reverse ? "order-first lg:order-last" : ""}`}>
        <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase" style={{ color: brand }}>
          {kicker}
        </p>
        {title && (
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-[#0f172a]">{title}</h3>
        )}
        {body && (
          <p className="mt-3 text-neutral-700 leading-relaxed md:text-[15.5px]">
            {body}
          </p>
        )}
      </div>
    </article>
  );
}
