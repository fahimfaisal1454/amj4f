// src/Pages/StoriesStrip/StoriesStrip.jsx
import React from "react";

const STORIES = [
  {
    tag: "STORY",
    tagColor: "bg-pactPurple text-white",
    title: "Rupa’s Scholarship Opened the Door to STEM",
    desc:
      "From almost dropping out to leading her school’s science fair team—Rupa’s path changed with tutoring and a small grant.",
    body:
      "Rupa was close to leaving school to support her family. With after-school tutoring, a small scholarship, and a STEM club mentor, she not only stayed in school but went on to lead her science fair team. Her story is a reminder that modest support—delivered at the right time—can unlock potential for learners in rural communities.",
    image: "/src/assets/stories/1.jpg",
    href: "#contact",
  },
  {
    tag: "STORY",
    tagColor: "bg-green-500 text-white",
    title: "Saiful’s Tailoring Shop Creates Stable Income",
    desc:
      "After a 6-week training and a starter kit, Saiful now employs two apprentices and supports his family reliably.",
    body:
      "Saiful joined our six-week tailoring training and received a starter kit funded by community savings. Today, he runs a small shop near the market, employs two apprentices, and has regular contracts with local schools. The steady income means his children are back in school and his family is saving for the future.",
    image: "/src/assets/stories/2.jpg",
    href: "#contact",
  },
  {
    tag: "STORY",
    tagColor: "bg-yellow-400 text-black",
    title: "Safe Roads Campaign Reduced Local Accidents",
    desc:
      "With youth volunteers and traffic signage, accident reports dropped markedly across two intersections.",
    body:
      "Youth volunteers mapped risk areas, installed low-cost signage, and worked with transport leaders to introduce safe speed pledges. Within three months, reported incidents at two intersections fell sharply. The effort shows how data from communities can drive quick, low-cost improvements in public safety.",
    image: "/src/assets/stories/3.jpg",
    href: "#contact",
  },
  {
    tag: "STORY",
    tagColor: "bg-blue-600 text-white",
    title: "Clinic-on-Wheels Reached Remote Villages",
    desc:
      "Over 900 patient visits in the first quarter—maternal checkups and vaccinations where access was hardest.",
    body:
      "The clinic-on-wheels operates on a rotating schedule, bringing maternal health checkups, vaccinations, and essential medicines to remote villages. Over the first quarter, providers recorded 900+ patient visits, with particular gains in immunization coverage and antenatal care attendance.",
    image: "/src/assets/stories/4.jpg",
    href: "#contact",
  },
];

export default function StoriesStrip() {
  // modal state
  const [active, setActive] = React.useState(null);

  // close on ESC
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
          {STORIES.map((s, i) => (
            <article
              key={i}
              onClick={() => setActive(s)}
              className="flex cursor-pointer flex-col overflow-hidden rounded-md border border-[#dcd8d3] bg-white shadow-sm hover:shadow-md transition"
            >
              <img src={s.image} alt={s.title} className="h-48 w-full object-cover" />
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
