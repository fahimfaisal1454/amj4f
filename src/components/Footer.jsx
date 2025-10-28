// src/components/Footer.jsx
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import treeBg from "../assets/tree.jpg"; // make sure this file exists

// ====== ADJUSTABLE FOOTER SETTINGS ======
const FOOTER_STYLE = {
  sectionPadding: "py-6",   // ↓ reduce to make footer shorter (was py-12)
  gridGap: "gap-5",         // ↓ spacing between columns (was gap-8)
  heading: "text-base",     // ↓ smaller font for headings
  text: "text-[13px]",      // ↓ smaller text
  iconSize: "h-4 w-4",      // ↓ smaller icons
};

export default function Footer() {
  return (
    <footer
      className="relative text-white"
      style={{
        backgroundColor: "#000",
        backgroundImage: `url(${treeBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left bottom",
        backgroundSize: "contain",
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Content */}
      <div
        className={`relative max-w-6xl mx-auto px-6 ${FOOTER_STYLE.sectionPadding} grid grid-cols-1 md:grid-cols-4 ${FOOTER_STYLE.gridGap}`}
      >
        {/* About */}
        <div>
          <h2
            className={`font-extrabold mb-2 bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent ${FOOTER_STYLE.heading}`}
          >
            Amar Jashore
          </h2>
          <p className={`${FOOTER_STYLE.text} text-gray-300 leading-relaxed`}>
            A community-driven NGO empowering education, health, and livelihoods
            in Jessore. Together, we make lasting change possible.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3
            className={`font-bold mb-2 bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent ${FOOTER_STYLE.heading}`}
          >
            Quick Links
          </h3>
          <ul className={`space-y-1 ${FOOTER_STYLE.text} font-semibold text-gray-300`}>
            {[
              ["/#home", "Home"],
              ["/#about", "About Us"],
              ["/#programs", "Programs"],
              ["/#stories", "Stories"],
              ["/#contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="hover:text-lime-300 transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3
            className={`font-semibold mb-2 bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent ${FOOTER_STYLE.heading}`}
          >
            Contact Us
          </h3>
          <ul className={`space-y-1 ${FOOTER_STYLE.text} text-gray-300`}>
            <li className="flex items-center gap-2">
              <MapPin className={`${FOOTER_STYLE.iconSize} text-lime-400`} />
              Jessore, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <Phone className={`${FOOTER_STYLE.iconSize} text-lime-400`} />{" "}
              +880 1715488288
            </li>
            <li className="flex items-center gap-2">
              <Mail className={`${FOOTER_STYLE.iconSize} text-lime-400`} />{" "}
              amarjashore@gmail.com
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3
            className={`font-semibold mb-2 bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent ${FOOTER_STYLE.heading}`}
          >
            Follow Us
          </h3>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social-link"
                className="p-1.5 rounded-full bg-black border border-lime-400/40 text-lime-300 hover:bg-lime-400 hover:text-black transition-colors shadow-md shadow-lime-400/20"
              >
                <Icon className={`${FOOTER_STYLE.iconSize}`} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-lime-400/20 text-[12.5px] text-center py-3 text-gray-300 bg-black/70 backdrop-blur-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent">
          Amar Jashore 
        </span>
        . All rights reserved. Powered by{' '}
        <a
          href="https://utshabtechnology.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-700 hover:text-lime-400"
        >
          Utshab Technology Ltd.
        </a>
      </div>
    </footer>
  );
}
