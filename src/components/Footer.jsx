import React from "react";

export default function Footer() {
  return (
    <footer style={{ padding: "2.5rem 0", borderTop: "1px solid rgba(255,255,255,.08)" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <small className="muted">© {new Date().getFullYear()} Amar Jashore NGO</small>
        <small className="muted">Built with React + Vite</small>
      </div>
    </footer>
  );
}
