import React from "react";

export default function ErrorPage() {
  return (
    <div className="container" style={{ padding: "5rem 0" }}>
      <h2>Something went wrong</h2>
      <p className="muted">Please go back <a href="/">home</a>.</p>
    </div>
  );
}
