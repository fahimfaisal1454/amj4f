// src/pages/AboutUs/AboutUs.jsx
import React from "react";
import heroImg from "/src/assets/about-hero.jpg"; // swap to your image

export default function AboutUs() {
  const stats = [
    { k: "12+", v: "Active Unions" },
    { k: "4,800+", v: "Learners Reached" },
    { k: "3,200+", v: "Patients Served" },
    { k: "750+", v: "Families Supported" },
  ];

  const bullets = [
    {
      title: "Education Support",
      text:
        "Scholarships, after-school tutoring, and school kits so learners can stay and succeed in school.",
    },
    {
      title: "Health & Nutrition",
      text:
        "Mobile clinics, maternal care, and community nutrition drives for families in need.",
    },
    {
      title: "Livelihoods",
      text:
        "Skills training, micro-grants, and co-ops that help households grow reliable income.",
    },
    {
      title: "Advocacy",
      text:
        "Road safety, WASH, and girls’ education campaigns with local leaders and institutions.",
    },
  ];

  // 🔹 Details for Mission / Vision / Values modal
  const mvv = [
    {
      key: "Mission",
      tagColor: "bg-pactPurple text-white",
      image: "/src/assets/mission.jpg",
      title:
        "Empowering communities through education, health and livelihoods",
      body:
        "We exist to improve well-being and opportunity for vulnerable families in Jashore. Our mission focuses on equitable access to quality education, essential health services, and resilient livelihoods. We co-create solutions with communities, track what works, and scale efforts that deliver measurable, dignified impact.",
    },
    {
      key: "Vision",
      tagColor: "bg-yellow-400 text-black",
      image: "/src/assets/vision.jpg",
      title:
        "A resilient, inclusive Jashore where everyone can live with dignity and hope",
      body:
        "We envision neighborhoods where children complete school, caregivers can access reliable health care, and households thrive with sustainable income. Systems are responsive, communities are prepared for shocks, and every person has the chance to achieve their potential.",
    },
    {
      key: "Values",
      tagColor: "bg-green-500 text-white",
      image: "/src/assets/values.jpg",
      title: "Integrity, transparency, inclusion and measurable impact",
      body:
        "We partner with communities as equals, steward resources responsibly, and publish learnings openly. We center inclusion across gender, disability, and income. We use data to guide decisions and hold ourselves accountable for outcomes, not just activities.",
    },
  ];

  // 🔹 Modal state for MVV
  const [active, setActive] = React.useState(null);
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="about" className="scroll-mt-[72px] bg-white py-5">
      <div className="max-w-container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-pactPurple">
            About Us
          </h2>
          <p className="mt-3 max-w-3xl text-neutral-700">
            <strong>Amar Jashore</strong> is a community-driven NGO based in
            Jashore, Bangladesh. We partner with local leaders, schools, and
            clinics to expand <em>education</em>, improve <em>health</em>, and
            strengthen <em>livelihoods</em>. Our approach is transparent,
            data-informed, and centered on dignity and hope.
          </p>
        </div>

        {/* Intro: image + stats */}
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src={heroImg}
              alt="Community program in Jashore"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.v}
                className="rounded-xl bg-pactBg p-6 text-center shadow"
              >
                <div className="text-3xl font-extrabold text-pactPurple">
                  {s.k}
                </div>
                <div className="mt-1 text-neutral-700 font-medium">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission / Vision / Values — consistent grey panels */}
        <div className="mt-5">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 – Mission */}
            <article
              className="overflow-hidden rounded-md border border-[#dcd8d3] bg-white cursor-pointer"
              onClick={() => setActive(mvv[0])}
            >
              <img
                src="/src/assets/mission.jpg"
                alt="Mission"
                className="h-56 w-full object-cover"
              />
              <div className="bg-[#efeeec] p-5 border-l-8 border-[#d4d0cb]">
                <span className="inline-block rounded-md bg-pactPurple px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                  Mission
                </span>
                <h4 className="mt-3 text-[1.15rem] leading-snug font-semibold text-[#2b2b2b]">
                  Empowering communities through education, health and
                  livelihoods
                </h4>
                <div className="mt-3">
                  <span className="inline-flex items-center text-sm font-semibold text-pactPurple/90 hover:text-pactPurple">
                    Read more →
                  </span>
                </div>
              </div>
            </article>

            {/* Card 2 – Vision */}
            <article
              className="overflow-hidden rounded-md border border-[#dcd8d3] bg-white cursor-pointer"
              onClick={() => setActive(mvv[1])}
            >
              <img
                src="/src/assets/vision.jpg"
                alt="Vision"
                className="h-56 w-full object-cover"
              />
              <div className="bg-[#efeeec] p-5 border-l-8 border-[#d4d0cb]">
                <span className="inline-block rounded-md bg-yellow-400 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-black">
                  Vision
                </span>
                <h4 className="mt-3 text-[1.15rem] leading-snug font-semibold text-[#2b2b2b]">
                  A resilient, inclusive Jashore where everyone can live with
                  dignity and hope
                </h4>
                <div className="mt-3">
                  <span className="inline-flex items-center text-sm font-semibold text-pactPurple/90 hover:text-pactPurple">
                    Read more →
                  </span>
                </div>
              </div>
            </article>

            {/* Card 3 – Values */}
            <article
              className="overflow-hidden rounded-md border border-[#dcd8d3] bg-white cursor-pointer"
              onClick={() => setActive(mvv[2])}
            >
              <img
                src="/src/assets/values.jpg"
                alt="Values"
                className="h-56 w-full object-cover"
              />
              <div className="bg-[#efeeec] p-5 border-l-8 border-[#d4d0cb]">
                <span className="inline-block rounded-md bg-green-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                  Values
                </span>
                <h4 className="mt-3 text-[1.15rem] leading-snug font-semibold text-[#2b2b2b]">
                  Integrity, transparency, inclusion and measurable impact
                </h4>
                <div className="mt-3">
                  <span className="inline-flex items-center text-sm font-semibold text-pactPurple/90 hover:text-pactPurple">
                    Read more →
                  </span>
                </div>
              </div>
            </article>
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
            <li>
              <span className="font-semibold">2019:</span> Grassroots tutoring
              initiative starts in Jashore Sadar.
            </li>
            <li>
              <span className="font-semibold">2021:</span> First free medical
              camp; 500+ residents served.
            </li>
            <li>
              <span className="font-semibold">2023:</span> Livelihoods pilot
              expands to three unions.
            </li>
            <li>
              <span className="font-semibold">2025:</span> STEM clubs launched
              for secondary school girls.
            </li>
          </ol>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#programs"
              className="inline-flex items-center rounded-lg bg-pactPurple px-4 py-2 font-bold text-white hover:opacity-90"
            >
              Explore Programs
            </a>
            <a
              href="#contact"
              className="inline-flex items-center rounded-lg border-2 border-pactPurple px-4 py-2 font-bold text-pactPurple hover:bg-pactPurple/5"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </div>

      {/* 🔹 MVV Modal */}
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
                alt={active.key}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <span
                  className={`inline-block rounded-md px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${active.tagColor}`}
                >
                  {active.key}
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
                {active.body}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-[#777]">
                  Press <kbd className="rounded bg-[#eee] px-1 py-[2px]">Esc</kbd> to
                  close
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
