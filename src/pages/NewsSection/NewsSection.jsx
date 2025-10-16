import React from "react";

export default function NewsSection() {
  return (
    <section id="news" className="container block">
      <h2>News & Updates</h2>
      <div className="grid grid-3">
        <div className="card"><strong>Clinic camp held in Ward 3</strong><p>Served 180+ patients.</p></div>
        <div className="card"><strong>STEM Club launched</strong><p>40 girls joined first cohort.</p></div>
        <div className="card"><strong>Tube wells installed</strong><p>Safe water access for 120 households.</p></div>
      </div>
    </section>
  );
}
