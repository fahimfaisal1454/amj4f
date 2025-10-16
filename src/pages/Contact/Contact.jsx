import React from "react";

export default function Contact() {
  return (
    <section id="contact" className="container block">
      <h2>Contact</h2>
      <div className="grid" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <form className="card" onSubmit={(e)=>e.preventDefault()}>
          <label>Name<br/><input required placeholder="Your name" className="input" /></label><br/>
          <label>Email<br/><input type="email" required placeholder="you@example.com" className="input" /></label><br/>
          <label>Message<br/><textarea required rows={5} placeholder="How can we help?" className="input" /></label><br/>
          <button className="btn">Send Message</button>
        </form>
        <div className="card">
          <p><strong>Address:</strong> Jashore, Bangladesh</p>
          <p><strong>Email:</strong> hello@amarjashore.org</p>
          <p><strong>Phone:</strong> +880 1XXX-XXXXXX</p>
          <small className="muted">Replace with real info.</small>
        </div>
      </div>
    </section>
  );
}
