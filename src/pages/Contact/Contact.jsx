// src/pages/Contact/Contact.jsx
import React from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

// Works with or without .env
const API = import.meta.env?.VITE_API_BASE || "http://127.0.0.1:8000";

// THEME
const LIME = "#C5FB5A";          // accent
const FORM_GREEN = "#74B93D";    // requested form card color

export default function Contact() {
  // ---- contact info (from backend) ----
  const [info, setInfo] = React.useState({
    email: "info@amarjashore.org",
    phone: "+880 1234-567-89",
    address: "Jessore, Bangladesh",
    hours: "Mon–Fri, 9 AM – 5 PM",
  });
  const [loadingInfo, setLoadingInfo] = React.useState(true);

  // ---- form state ----
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState("");

  // Fetch contact info once
  React.useEffect(() => {
    fetch(`${API}/api/contact-info/`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setInfo({
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            hours: data.hours || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingInfo(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSent(false);

    try {
      const res = await fetch(`${API}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to send message");
      }

      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError("Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Build left-side info items
  const infoItems = [
    {
      icon: <Mail className="mt-1 h-5 w-5" style={{ color: "#74b93d" }} />,
      label: "Email",
      content: (
        <a
          href={`mailto:${info.email || "info@amarjashore.org"}`}
          className="font-medium hover:underline text-black"
        >
          {loadingInfo ? "…" : info.email || "info@amarjashore.org"}
        </a>
      ),
    },
    {
      icon: <Phone className="mt-1 h-5 w-5" style={{ color: "#74b93d" }}/>,
      label: "Phone",
      content: (
        <a
          href={`tel:${info.phone || "+880123456789"}`}
          className="font-medium hover:underline text-black"
        >
          {loadingInfo ? "…" : info.phone || "+880 1234-567-89"}
        </a>
      ),
    },
    {
      icon: <MapPin className="mt-1 h-5 w-5" style={{ color: "#74b93d" }} />,
      label: "Address",
      content: (
        <p className="font-medium text-black">
          {loadingInfo ? "…" : info.address || "Jessore, Bangladesh"}
        </p>
      ),
    },
    {
      icon: <Clock className="mt-1 h-5 w-5" style={{ color: "#74b93d" }} />,
      label: "Hours",
      content: (
        <p className="font-medium text-black">
          {loadingInfo ? "…" : info.hours || "Mon–Fri, 9 AM – 5 PM"}
        </p>
      ),
    },
  ];

  return (
    <section
      id="contact"
      className="scroll-mt-[72px] relative overflow-hidden py-12 bg-white text-gray-900"
    >
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
            style={{ borderColor: "#e6e6e6", backgroundColor: "white", color: "black" }}
          >
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-2 text-black">
            Contact <span className="text-black/70">Amar Jashore</span>
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-black/80">
            Questions, ideas, or want to volunteer? We’d love to hear from you.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Left Column */}
          <aside className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.12)]">
              <h2 className="text-xl font-bold text-black">Contact Information</h2>
              <p className="mt-1 text-black/70">
                Reach us via email, phone, or visit our office.
              </p>

              <ul className="mt-6 space-y-4">
                {infoItems.map((it, idx) => (
                  <li key={idx} className="flex gap-3">
                    {it.icon}
                    <div>
                      <p className="text-sm text-black/60">{it.label}</p>
                      {it.content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.12)]">
              <iframe
                title="Amar Jashore Map"
                className="h-56 w-full"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  info.address || "Jessore,Bangladesh"
                )}&z=12&output=embed`}
              />
            </div>
          </aside>

          {/* Right Column (FORM CARD IN GREEN) */}
          <div className="md:col-span-3">
            <form onSubmit={submit} className="contact-form-card p-6">
              <h2 className="text-xl font-bold text-white">Send us a message</h2>
              <p className="mt-1 text-white/90">We usually reply within 1–2 business days.</p>

              {/* Alerts */}
              {sent && (
                <div className="mt-3 rounded-md bg-white/20 border border-white/50 px-3 py-2 text-white text-sm">
                  ✅ Message sent successfully!
                </div>
              )}
              {error && (
                <div className="mt-3 rounded-md bg-white/20 border border-white/50 px-3 py-2 text-white text-sm">
                  {error}
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-white">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-white/40 bg-white px-3 py-2.5 text-black outline-none focus:ring-2 focus:ring-white/60 transition-shadow"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-white/40 bg-white px-3 py-2.5 text-black outline-none focus:ring-2 focus:ring-white/60 transition-shadow"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm font-medium text-white">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-white/40 bg-white px-3 py-2.5 text-black outline-none focus:ring-2 focus:ring-white/60 transition-shadow"
                    placeholder="+880…"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-white">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-white/40 bg-white px-3 py-2.5 text-black outline-none focus:ring-2 focus:ring-white/60 transition-shadow"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="message" className="text-sm font-medium text-white">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-white/40 bg-white px-3 py-2.5 text-black outline-none focus:ring-2 focus:ring-white/60 transition-shadow"
                    placeholder="Write your message here…"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition shadow-[0_6px_16px_rgba(0,0,0,0.18)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 disabled:opacity-70"
                  style={{
                    backgroundColor: submitting ? "#d1d5db" : LIME,
                    color: submitting ? "#111827" : "black",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.backgroundColor = "black";
                      e.currentTarget.style.color = LIME;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.backgroundColor = LIME;
                      e.currentTarget.style.color = "black";
                    }
                  }}
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Sending…" : "Send Message"}
                </button>
                <span className="text-sm text-white/90">
                  We’ll never share your contact details.
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Styles for the green form card */}
      <style>{`
        .contact-form-card{
          background-color: ${FORM_GREEN};
          border: 2px solid ${LIME};
          border-radius: 0.75rem;
          box-shadow:
            0 12px 28px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
      `}</style>
    </section>
  );
}
