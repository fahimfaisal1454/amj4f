import React from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  const infoItems = [
    {
      icon: <Mail className="mt-1 h-5 w-5 text-pactPurple" />,
      label: "Email",
      content: (
        <a
          href="mailto:info@amarjashore.org"
          className="font-medium text-pactPurple hover:opacity-80"
        >
          info@amarjashore.org
        </a>
      ),
    },
    {
      icon: <Phone className="mt-1 h-5 w-5 text-pactPurple" />,
      label: "Phone",
      content: (
        <a
          href="tel:+880123456789"
          className="font-medium text-pactPurple hover:opacity-80"
        >
          +880 1234-567-89
        </a>
      ),
    },
    {
      icon: <MapPin className="mt-1 h-5 w-5 text-pactPurple" />,
      label: "Address",
      content: <p className="font-medium">Jessore, Bangladesh</p>,
    },
    {
      icon: <Clock className="mt-1 h-5 w-5 text-pactPurple" />,
      label: "Hours",
      content: <p className="font-medium">Mon–Fri, 9 AM – 5 PM</p>,
    },
  ];

  return (
    <section
      id="contact"
      className="scroll-mt-[72px] relative overflow-hidden py-5 text-gray-900"
    >
      {/* Background matching site theme */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 filter blur-[2px] brightness-100"
        style={{
          backgroundImage:
            "url('/src/assets/backgrounds/blue-abstract-gradient-2.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-white/45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_10%_-10%,rgba(122,15,95,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_90%_110%,rgba(122,15,95,0.16),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e7dbe3] bg-white px-3 py-1 text-xs font-semibold text-pactPurple">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-1 text-pactPurple">
            Contact <span className="text-[#2b2b2b]">Amar Jashore</span>
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-[#444]">
            Questions, ideas, or want to volunteer? We’d love to hear from you.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Left Column */}
          <aside className="md:col-span-2 space-y-6">
            <div className="rounded-md border border-[#dcd8d3] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-pactPurple">
                Contact Information
              </h2>
              <p className="mt-1 text-[#555]">
                Reach us via email, phone, or visit our office.
              </p>

              <ul className="mt-6 space-y-4">
                {infoItems.map((it, idx) => (
                  <li key={idx} className="flex gap-3">
                    {it.icon}
                    <div>
                      <p className="text-sm text-gray-500">{it.label}</p>
                      {it.content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-md border border-[#dcd8d3] bg-white shadow-sm">
              <iframe
                title="Amar Jashore Map"
                className="h-56 w-full"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Jessore,Bangladesh&z=12&output=embed"
              />
            </div>
          </aside>

          {/* Right Column */}
          <div className="md:col-span-3">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="rounded-md border border-[#dcd8d3] bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-bold text-pactPurple">
                Send us a message
              </h2>
              <p className="mt-1 text-[#555]">
                We usually reply within 1–2 business days.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-pactPurple/40 transition-shadow"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-pactPurple/40 transition-shadow"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-pactPurple/40 transition-shadow"
                    placeholder="+880…"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-pactPurple/40 transition-shadow"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-pactPurple/40 transition-shadow"
                    placeholder="Write your message here…"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-pactPurple px-5 py-2.5 font-semibold text-white shadow hover:opacity-95 hover:scale-105 transition-transform"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
                <span className="text-sm text-gray-500">
                  (This is a demo form)
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
