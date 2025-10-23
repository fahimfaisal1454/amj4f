// src/pages/Home.jsx
import React from "react";
import { ABS } from "../../api/endpoints"; // ← use shared absolute-URL helper

const FALLBACK = [
  { image: "/src/assets/hero/slide1.jpg", title: "Blood Donation Saves Lives", body: "…", cta:{label:"Learn more", href:"#about"} },
  { image: "/src/assets/hero/slide2.jpg", title: "EDUCATION CHANGES LIVES", body: "…", cta:{label:"Explore programs", href:"#programs"} },
  { image: "/src/assets/hero/slide3.jpg", title: "HEALTH & NUTRITION", body: "…", cta:{label:"See our results", href:"#stories"} },
];

export default function Home() {
  const [slides, setSlides] = React.useState(FALLBACK);
  const [index, setIndex] = React.useState(0);

  // fetch banners (optional)
  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch(ABS(`/api/banners/`));
        if (!r.ok) return;
        const json = await r.json();
        const rows = Array.isArray(json) ? json : (json?.results || []);
        if (!rows.length) return;

        const mapped = rows.map((b) => ({
          image: ABS(b.image_url || b.image),
          mobile: ABS(b.mobile_image_url || b.mobile_image),
          title: b.title,
          body: b.caption,
          cta: { label: b.cta_label, href: b.cta_href || "#" },
        }));

        setSlides(mapped);
        setIndex(0);
      } catch {
        // ignore -> fallback stays
      }
    })();
  }, []);

  // autoplay every 2s (pause when tab hidden)
  React.useEffect(() => {
    if (!slides.length) return;
    let active = true;

    const tick = () => {
      if (!document.hidden && active) {
        setIndex((i) => (i + 1) % slides.length);
      }
    };

    const id = setInterval(tick, 2000);
    const onVis = () => {}; // we just read document.hidden in tick
    document.addEventListener("visibilitychange", onVis);

    return () => {
      active = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [slides.length]);

  const go = (i) => slides.length && setIndex((i + slides.length) % slides.length);
  const slide = slides[index] || {};

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto h-full max-w-container px-4">
        <div className="flex h-full items-center">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">{slide.title}</h1>
            <p className="mt-4 text-white/90 text-lg">{slide.body}</p>
            {slide?.cta?.label && (
              <div className="mt-6">
                <a
                  href={slide.cta.href || "#"}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
                >
                  {slide.cta.label}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/50"
      >
        ‹
      </button>
      <button
        aria-label="Next slide"
        onClick={() => go(index + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/50"
      >
        ›
      </button>
    </section>
  );
}
