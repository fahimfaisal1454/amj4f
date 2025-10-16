import React from "react";

const items = [
  { title: "Education Support", text: "Scholarships, tutoring, school kits." },
  { title: "Health & Nutrition", text: "Medical camps, maternal & child nutrition." },
  { title: "Livelihoods", text: "Skills training, micro-grants, co-ops." },
];

export default function ProgramsGrid() {
  return (
    <section id="programs" className="container block">
      <h2>Programs</h2>
      <div className="grid grid-3">
        {items.map(i => (
          <div key={i.title} className="card">
            <h3>{i.title}</h3>
            <p>{i.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
