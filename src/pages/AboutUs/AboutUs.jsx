import React from "react";

export default function AboutUs() {
  return (
    <section id="about" className="container block">
      {/* Intro */}
      <div className="card" style={{ padding: "2rem" }}>
        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "1.2fr 1fr",
          }}
        >
          <div>
            <h2 style={{ marginTop: 0 }}>About Us</h2>
            <p className="muted" style={{ maxWidth: 720 }}>
              <strong>Amar Jashore</strong> is a community-driven NGO based in
              Jashore, Bangladesh. We partner with local leaders, schools, and
              clinics to expand <em>education</em>, improve <em>health</em>, and
              strengthen <em>livelihoods</em>. Our approach is transparent,
              data-informed, and centered on dignity.
            </p>

            <div
              style={{
                display: "grid",
                gap: ".75rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                marginTop: "1rem",
              }}
            >
              <Stat number="12+" label="Active Unions" />
              <Stat number="4,800+" label="Learners Reached" />
              <Stat number="3,200+" label="Patients Served" />
              <Stat number="750+" label="Families Supported" />
            </div>

            <div style={{ marginTop: "1.25rem", display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
              <a href="#programs" className="btn">Explore Programs</a>
              <a href="#contact" className="btn outline">Partner With Us</a>
            </div>
          </div>

          {/* Optional image — put a file at src/assets/about-hero.jpg */}
          <div
            aria-hidden
            style={{
              borderRadius: "1rem",
              minHeight: 220,
              background:
                "url(/src/assets/about-hero.jpg) center/cover, radial-gradient(120% 120% at 0% 0%, #121935, #0c1330 60%)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          />
        </div>
      </div>

      {/* Mission / Vision / Values */}
      <div className="grid grid-3" style={{ marginTop: "1rem" }}>
        <div className="card">
          <h3>Our Mission</h3>
          <p>
            Empower vulnerable communities in Jashore through access to quality
            education, basic healthcare, and income opportunities.
          </p>
        </div>
        <div className="card">
          <h3>Our Vision</h3>
          <p>
            A resilient and inclusive Jashore where every person can live with
            dignity, health, and hope.
          </p>
        </div>
        <div className="card">
          <h3>Our Values</h3>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.6 }}>
            <li>Integrity &amp; Transparency</li>
            <li>Community Leadership</li>
            <li>Equity &amp; Inclusion</li>
            <li>Evidence &amp; Impact</li>
          </ul>
        </div>
      </div>

      {/* What we do */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>What We Do</h3>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <Bullet
            title="Education Support"
            text="Scholarships, after-school tutoring, and school kits for underserved learners."
          />
          <Bullet
            title="Health & Nutrition"
            text="Free clinics, maternal care, and community nutrition for children."
          />
          <Bullet
            title="Livelihoods"
            text="Skills training, micro-grants, and co-operatives that grow steady income."
          />
          <Bullet
            title="Advocacy"
            text="Campaigns on road safety, sanitation, and girls’ education with local leaders."
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>Our Journey</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
          <li>
            <strong>2019:</strong> Grassroots tutoring initiative starts in Jashore Sadar.
          </li>
          <li>
            <strong>2021:</strong> First free medical camp; 500+ residents served.
          </li>
          <li>
            <strong>2023:</strong> Livelihoods pilot expands to three unions.
          </li>
          <li>
            <strong>2025:</strong> STEM clubs launched for secondary school girls.
          </li>
        </ul>
      </div>

      {/* Governance & Transparency */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>Governance &amp; Transparency</h3>
        <p className="muted">
          Amar Jashore is governed by a volunteer board and publishes annual
          reports and audited financials. We prioritize open data and
          measurable outcomes.
        </p>
        <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
          <a className="btn outline" href="#" onClick={(e)=>e.preventDefault()}>
            Download Annual Report (PDF)
          </a>
          <a className="btn outline" href="#" onClick={(e)=>e.preventDefault()}>
            View Financial Summary
          </a>
        </div>
      </div>
    </section>
  );
}

/* --- Small presentation components --- */

function Stat({ number, label }) {
  return (
    <div
      className="card"
      style={{ padding: "1rem", textAlign: "center" }}
      aria-label={`${label}: ${number}`}
    >
      <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{number}</div>
      <div className="muted" style={{ fontSize: ".95rem" }}>{label}</div>
    </div>
  );
}

function Bullet({ title, text }) {
  return (
    <div className="card">
      <strong>{title}</strong>
      <p style={{ marginTop: ".35rem" }}>{text}</p>
    </div>
  );
}
