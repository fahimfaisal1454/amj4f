// src/pages/Contact/Contact.jsx
import React from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { ABS } from "../../api/endpoints";

// ====== ADJUSTABLE SETTINGS ======
const LIME = "#C5FB5A";
const FORM_GREEN = "#74B93D";
const SETTINGS = {
  cardPadding: "p-4",              // inner padding of boxes
  fontBase: "text-[13.5px]",       // global font size
  heading: "text-xl",              // heading font
  label: "text-[12.5px]",          // form label size
  sectionPadding: "py-8",          // overall top-bottom spacing
  cardRadius: "rounded-lg",        // border radius of cards
  gridGap: "gap-6",                // gap between left & right columns
};

export default function Contact() {
  const [info, setInfo] = React.useState({
    email: "info@amarjashore.org",
    phone: "+880 1234-567-89",
    address: "Jessore, Bangladesh",
    hours: "Mon–Fri, 9 AM – 5 PM",
  });
  const [loadingInfo, setLoadingInfo] = React.useState(true);
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

  React.useEffect(() => {
    fetch(ABS(`/api/contact-info/`))
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
      const res = await fetch(ABS(`/api/contact/`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setError("Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const infoItems = [
    {
      icon: <Mail className="h-4 w-4 mt-0.5" style={{ color: FORM_GREEN }} />,
      label: "Email",
      value: (
        <a href={`mailto:${info.email}`} className="text-black font-medium hover:underline">
          {loadingInfo ? "…" : info.email}
        </a>
      ),
    },
    {
      icon: <Phone className="h-4 w-4 mt-0.5" style={{ color: FORM_GREEN }} />,
      label: "Phone",
      value: (
        <a href={`tel:${info.phone}`} className="text-black font-medium hover:underline">
          {loadingInfo ? "…" : info.phone}
        </a>
      ),
    },
    {
      icon: <MapPin className="h-4 w-4 mt-0.5" style={{ color: FORM_GREEN }} />,
      label: "Address",
      value: <p className="text-black font-medium">{info.address}</p>,
    },
    {
      icon: <Clock className="h-4 w-4 mt-0.5" style={{ color: FORM_GREEN }} />,
      label: "Hours",
      value: <p className="text-black font-medium">{info.hours}</p>,
    },
  ];

  return (
    <section className={`relative bg-white text-gray-900 ${SETTINGS.sectionPadding}`}>
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-black">
            Contact <span className="text-black/70">Amar Jashore</span>
          </h1>
        </div>

        {/* Grid layout */}
        <div className={`grid md:grid-cols-5 ${SETTINGS.gridGap} items-stretch`}>
          {/* LEFT SIDE */}
          <aside className="md:col-span-2 flex flex-col justify-between">
            {/* Contact Info Card */}
            <div className={`${SETTINGS.cardRadius} border border-black/10 bg-white ${SETTINGS.cardPadding} shadow-md flex-1`}>
              <h2 className={`${SETTINGS.heading} font-bold text-black mb-2`}>Contact Information</h2>
              <p className="text-black/70 text-[13px] mb-3">
                Reach us via email, phone, or visit our office.
              </p>
              <ul className="space-y-3">
                {infoItems.map((item, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    {item.icon}
                    <div>
                      <p className="text-[12px] text-black/60">{item.label}</p>
                      {item.value}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map Card */}
            <div className={`${SETTINGS.cardRadius} border border-black/10 bg-white shadow-md mt-4 overflow-hidden`}>
              <iframe
                title="Amar Jashore Map"
                className="w-full h-44"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  info.address || "Jessore,Bangladesh"
                )}&z=12&output=embed`}
              />
            </div>
          </aside>

          {/* RIGHT SIDE FORM */}
          <div className="md:col-span-3 flex flex-col">
            <form
              onSubmit={submit}
              className={`flex flex-col flex-1 justify-between contact-form-card ${SETTINGS.cardPadding}`}
            >
              <div>
                <h2 className={`${SETTINGS.heading} font-bold text-white`}>Send us a message</h2>
                <p className="text-white/90 text-[13px] mb-3">
                  We usually reply within 1–2 business days.
                </p>

                {sent && (
                  <div className="bg-white/20 border border-white/40 text-white text-sm px-3 py-2 rounded mb-3">
                    ✅ Message sent successfully!
                  </div>
                )}
                {error && (
                  <div className="bg-white/20 border border-white/40 text-white text-sm px-3 py-2 rounded mb-3">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="name" className={`${SETTINGS.label} text-white`}>
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-white/40 bg-white text-black text-sm px-3 py-2 focus:ring-2 focus:ring-white/60 outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={`${SETTINGS.label} text-white`}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-white/40 bg-white text-black text-sm px-3 py-2 focus:ring-2 focus:ring-white/60 outline-none"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={`${SETTINGS.label} text-white`}>
                      Phone (optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-white/40 bg-white text-black text-sm px-3 py-2 focus:ring-2 focus:ring-white/60 outline-none"
                      placeholder="+880…"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className={`${SETTINGS.label} text-white`}>
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-white/40 bg-white text-black text-sm px-3 py-2 focus:ring-2 focus:ring-white/60 outline-none"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="message" className={`${SETTINGS.label} text-white`}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={form.message}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-white/40 bg-white text-black text-sm px-3 py-2 focus:ring-2 focus:ring-white/60 outline-none"
                      placeholder="Write your message here..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-70"
                  style={{
                    backgroundColor: submitting ? "#d1d5db" : LIME,
                    color: submitting ? "#111827" : "black",
                  }}
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Sending..." : "Send Message"}
                </button>
                <span className="text-white/90 text-[12.5px]">
                  We’ll never share your contact details.
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* green card style */}
      <style>{`
        .contact-form-card {
          background-color: ${FORM_GREEN};
          border: 2px solid ${LIME};
          border-radius: 0.625rem;
          box-shadow: 0 10px 22px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
      `}</style>
    </section>
  );
}
