// src/Pages/NewsSection/NewsSection.jsx
import React from "react";

// 4 news items (adjust as needed)
const items = [
  {
    tag: "PACT IN THE NEWS",
    tagColor: "bg-pactPurple text-white",
    title:
      "Is it really a just transition if we don’t talk about supporting artisanal miners?",
    image: "/src/assets/news/1.jpg",
    body:
      "A just transition must include the millions of artisanal and small-scale miners who depend on mining for their livelihoods. This piece explores policy gaps, local realities, and the role of private sector and governments in making supply chains safer and more equitable.",
  },
  {
    tag: "PACT IN THE NEWS",
    tagColor: "bg-pactPurple text-white",
    title: "Fixing foreign aid requires confronting fundamental tensions",
    image: "/src/assets/news/2.jpg",
    body:
      "Foreign aid often balances urgency with sustainability, scale with local ownership, and quick wins with systemic change. We break down these tensions and share how community-led approaches are improving outcomes in education, health, and livelihoods.",
  },
  {
    tag: "NEWS",
    tagColor: "bg-yellow-400 text-black",
    title:
      "Pact awarded contract to evaluate American Cancer Society’s Global SPARK Initiative",
    image: "/src/assets/news/3.jpg",
    body:
      "Pact’s evaluation team will support the Global SPARK Initiative with evidence, learning, and adaptive insights to strengthen global efforts around cancer prevention and care—particularly in underserved communities.",
  },
  {
    tag: "BLOG",
    tagColor: "bg-green-500 text-white",
    title:
      "As Ukrainians grapple with war, Pact and partners strengthened vital services for health and mental health",
    image: "/src/assets/news/4.jpg",
    body:
      "Amid conflict, Pact worked with local partners to maintain access to health and mental health services. This blog highlights frontline stories, practical innovations, and the resilience of communities and health workers.",
  },
];

export default function NewsSection() {
  // modal state
  const [active, setActive] = React.useState(null); // stores the clicked item

  // close on ESC
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="news"
      className="relative scroll-mt-[72px] min-h-screen flex flex-col justify-start pt-10 pb-16 overflow-hidden"
    >
      {/* 🎨 gradient background with soft blur */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 blur-[2px] brightness-100"
        style={{
          backgroundImage: "url('/src/assets/backgrounds/background3.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative max-w-container mx-auto px-4">
        <h2 className="text-center text-pactPurple font-extrabold uppercase tracking-wide text-3xl sm:text-4xl drop-shadow-sm  mb-10">
          Latest News and Highlights
        </h2>

        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((n, i) => (
            <article
              key={i}
              onClick={() => setActive(n)}
              className="flex cursor-pointer flex-col overflow-hidden rounded-md border border-[#dcd8d3] bg-white shadow-sm hover:shadow-md transition"
            >
              <img src={n.image} alt={n.title} className="h-48 w-full object-cover" />

              <div className="flex-1 bg-[#efeeec] px-5 pt-4 pb-6 border-l-8 border-[#d4d0cb]">
                <span
                  className={`inline-block rounded-md px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${n.tagColor}`}
                >
                  {n.tag}
                </span>

                <h3 className="mt-3 text-[1.05rem] leading-snug font-semibold text-[#2b2b2b]">
                  {n.title}
                </h3>

                {/* Read more */}
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
