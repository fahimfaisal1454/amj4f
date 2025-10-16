import React from "react";

export default function StoriesStrip() {
  return (
    <section id="stories" className="container block">
      <h2>Impact Stories</h2>
      <div className="grid grid-3">
        <div className="card"><strong>Rupa’s Scholarship</strong><p>From dropout risk to class topper.</p></div>
        <div className="card"><strong>Saiful’s Enterprise</strong><p>Tailoring skills to stable income.</p></div>
        <div className="card"><strong>Safe Roads</strong><p>Fewer accidents after workshops.</p></div>
      </div>
    </section>
  );
}
