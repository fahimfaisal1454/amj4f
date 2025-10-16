// src/Pages/ProgramsGrid/ProgramsGrid.jsx
import React from "react";

const programs = [
  {
    tag: "EDUCATION",
    tagColor: "bg-pactPurple text-white",
    title: "Education for All",
    desc:
      "We provide scholarships, after-school programs, and digital literacy sessions to help students thrive in rural Jashore.",
    image: "/src/assets/programs/education.jpg",
    body:
      "Our education portfolio supports learners from primary to secondary levels. We provide scholarships for vulnerable students, after-school tutoring led by trained facilitators, and digital literacy sessions with tablets and offline content. Parents’ groups engage on attendance, child safety, and inclusive education. We partner with schools to improve reading outcomes and STEM exposure for girls.",
  },
  {
    tag: "HEALTH",
    tagColor: "bg-green-500 text-white",
    title: "Community Health",
    desc:
      "Through mobile clinics, maternal health care, and nutrition workshops, we improve health outcomes for families.",
    image: "/src/assets/programs/health.jpg",
    body:
      "Our health work strengthens primary care access with mobile clinics, community health workers, and referral pathways. We support maternal and newborn care, immunization catch-ups, and community nutrition. Behavior change sessions address WASH, anemia, and child feeding. We collect anonymized data for continuous quality improvement with local providers.",
  },
  {
    tag: "LIVELIHOODS",
    tagColor: "bg-yellow-400 text-black",
    title: "Livelihoods & Skills",
    desc:
      "Our training and micro-grants programs empower families to build small businesses and steady incomes.",
    image: "/src/assets/programs/livelihood.jpg",
    body:
      "We train youth and caregivers in market-relevant skills (tailoring, repair, agri-value chains), provide start-up kits or micro-grants, and mentor enterprise groups. Village savings and loan groups help households build resilience. Partnerships with local businesses link graduates to buyers and apprenticeships, prioritizing women and persons with disabilities.",
  },
  {
    tag: "ADVOCACY",
    tagColor: "bg-blue-600 text-white",
    title: "Advocacy & Awareness",
    desc:
      "We partner with local leaders on campaigns for girls’ education, road safety, and environmental protection.",
    image: "/src/assets/programs/advocacy.jpg",
    body:
      "Youth and community leaders co-design campaigns on girls’ education, road safety, anti-child labor, and environmental protection. We support citizen feedback forums and constructive engagement with local institutions. Toolkits, radio spots, and school clubs help messages stick, while simple metrics track reach and policy changes.",
  },
];

export default function ProgramsGrid() {
  // Modal state
  const [active, setActive] = React.useState(null);

  // Close on Esc
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="programs"
      className="relative scroll-mt-[72px] min-h-screen flex flex-col justify-start pt-10 pb-16 overflow-hidden"
    >
      {/* 🌊 Background with blur */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 blur-[3px] brightness-95"
        style={{
          backgroundImage: "url('/src/assets/backgrounds/background2.jpg')",
        }}
      ></div>

      {/* White overlay for readability */}
      <div className="absolute inset-0 bg-white/40"></div>

      {/* Content */}
      <div className="relative max-w-container mx-auto px-4">
        <h2 className="text-center text-pactPurple font-extrabold uppercase tracking-wide text-3xl sm:text-4xl drop-shadow-sm">
          Our Programs
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => (
            <article
              key={i}
              onClick={() => setActive(p)}
              className="flex cursor-pointer flex-col overflow-hidden rounded-md border border-[#dcd8d3] bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-48 w-full object-cover"
              />
              <div className="flex-1 bg-[#efeeec] px-5 pt-4 pb-6 border-l-8 border-[#d4d0cb]">
                <span
                  className={`inline-block rounded-md px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${p.tagColor}`}
                >
                  {p.tag}
                </span>
                <h3 className="mt-3 text-[1.1rem] leading-snug font-semibold text-[#2b2b2b]">
                  {p.title}
                </h3>
                <p className="mt-2 text-[0.95rem] text-[#444] leading-relaxed">
                  {p.desc}
                </p>
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
            {/* Header image */}
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

            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-[0.95rem] leading-relaxed text-[#363636]">
                {active.body || active.desc}
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
