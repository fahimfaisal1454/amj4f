import React from "react";

// Put your images in /src/assets/hero and update these paths
const SLIDES = [
  {
    image: "/src/assets/hero/slide1.jpg",
    title: "ENDING CHILD LABOR",
    body:
      "With communities, governments, the private sector, and miners, we work to achieve critical mineral supply chains free of child labor.",
    cta: { label: "Learn more", href: "#about" },
  },
  {
    image: "/src/assets/hero/slide2.jpg",
    title: "EDUCATION CHANGES LIVES",
    body:
      "Scholarships, tutoring, and school kits keep children in school and open doors for their future.",
    cta: { label: "Explore programs", href: "#programs" },
  },
  {
    image: "/src/assets/hero/slide3.jpg",
    title: "HEALTH & NUTRITION",
    body:
      "Mobile clinics and nutrition programs ensure families get timely care and support.",
    cta: { label: "See our results", href: "#stories" },
  },
];

export default function Home() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // autoplay every 6s
  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, [paused]);

  const go = (i) => setIndex((i + SLIDES.length) % SLIDES.length);

  const slide = SLIDES[index];

  return (
    <section
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* dark gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/10" />
      </div>

      {/* Content (left) */}
      <div className="relative z-10 mx-auto h-full max-w-container px-4">
        <div className="flex h-full items-center">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              {slide.title}
            </h1>
            <p className="mt-4 text-white/90 text-lg">
              {slide.body}
            </p>

            <div className="mt-6">
              <a
                href={slide.cta.href}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                {slide.cta.label}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Controls (optional) */}
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

      {/* Vertical dots (right) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index
                ? "h-3 w-3 bg-yellow-400 shadow-[0_0_0_3px_rgba(0,0,0,0.25)]"
                : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
