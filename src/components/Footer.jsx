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
import treeBg from "../assets/tree.jpg"; // <-- make sure you place your tree.jpg inside src/assets/

export default function Footer() {
  return (
    <footer
      className="relative text-white"
      style={{
        backgroundColor: "#000", // pure black base
        backgroundImage: `url(${treeBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left bottom",
        backgroundSize: "contain",
      }}
    >
      {/* overlay for dark contrast */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & about */}
        <div>
          <h2
            className="text-2xl font-extrabold mb-3 bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent"
          >
            Amar Jashore
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            A community-driven NGO empowering education, health, and livelihoods
            in Jessore. Together, we make lasting change possible.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3
            className="text-lg font-bold mb-3 bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent"
          >
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm font-bold text-gray-300">
            {[
              ["#home", "Home"],
              ["#about", "About Us"],
              ["#programs", "Programs"],
              ["#stories", "Stories"],
              ["#contact", "Contact"],
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
            className="text-lg font-semibold mb-3 bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent"
          >
            Contact Us
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-lime-400" />
              Jessore, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-lime-400" /> +880 1234-567-89
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-lime-400" /> info@amarjashore.org
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3
            className="text-lg font-semibold mb-3 bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent"
          >
            Follow Us
          </h3>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-full bg-black border border-lime-400/40 text-lime-300 hover:bg-lime-400 hover:text-black transition-colors shadow-lg shadow-lime-400/20"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-lime-400/20 text-sm text-center py-4 text-gray-300 bg-black/70 backdrop-blur-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent">
          Amar Jashore NGO
        </span>
        . All rights reserved.
      </div>
    </footer>
  );
}
