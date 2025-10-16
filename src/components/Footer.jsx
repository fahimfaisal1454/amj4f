import React from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#f8f6f9] to-[#e6dbe8] text-[#333] border-t border-[#d5c9d8]">
      {/* Top section */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & about */}
        <div>
          <h2 className="text-2xl font-extrabold text-pactPurple mb-2">
            Amar Jashore
          </h2>
          <p className="text-sm text-[#555] leading-relaxed">
            A community-driven NGO empowering education, health, and livelihoods
            in Jessore. Together, we make lasting change possible.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-lg font-semibold text-pactPurple mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#home" className="hover:text-pactPurple">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-pactPurple">
                About Us
              </a>
            </li>
            <li>
              <a href="#programs" className="hover:text-pactPurple">
                Programs
              </a>
            </li>
            <li>
              <a href="#stories" className="hover:text-pactPurple">
                Stories
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-pactPurple">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-pactPurple mb-3">
            Contact Us
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-pactPurple" />
              Jessore, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-pactPurple" /> +880 1234-567-89
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-pactPurple" /> info@amarjashore.org
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold text-pactPurple mb-3">
            Follow Us
          </h3>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="p-2 rounded-full bg-white border border-[#dcd8d3] text-pactPurple hover:bg-pactPurple hover:text-white transition"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="p-2 rounded-full bg-white border border-[#dcd8d3] text-pactPurple hover:bg-pactPurple hover:text-white transition"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="p-2 rounded-full bg-white border border-[#dcd8d3] text-pactPurple hover:bg-pactPurple hover:text-white transition"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#d6cdd7] bg-white/60 backdrop-blur-sm text-sm text-center py-4 text-[#555]">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-pactPurple">Amar Jashore NGO</span>. All rights reserved.
        <br />
    
      </div>
    </footer>
  );
}
