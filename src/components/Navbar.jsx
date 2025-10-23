// src/components/Navbar.jsx
import React, { useEffect, useMemo, useState } from "react";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || "aj_tokens";

function hasToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return false;
    if (raw.startsWith("{")) {
      const obj = JSON.parse(raw);
      return Boolean(obj?.access || obj?.token);
    }
    return Boolean(raw);
  } catch {
    return false;
  }
}

export default function Navbar() {
  // --- auth state
  const [authed, setAuthed] = useState(hasToken());

  useEffect(() => {
    const onStorage = () => setAuthed(hasToken());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    // Clear all possible auth tokens
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setAuthed(false);

    // If user is on /dashboard or another protected route, send them home
    if (location.pathname.startsWith("/dashboard")) {
      window.location.assign("/");
    } else {
      const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: prefersReduce ? "auto" : "smooth" });
    }
  };

  // --- UI
  const [mobileOpen, setMobileOpen] = useState(false);

  // --- links (hashes so they work on the homepage sections)
  const links = useMemo(
    () => [
      { href: "#home", label: "Home" },
      { href: "#about", label: "About Us" },
      { href: "#programs", label: "Projects" },
      { href: "#stories", label: "Stories" },
      { href: "#news", label: "News" },
      { href: "#contact", label: "Contact" },
    ],
    []
  );

  // --- smooth scroll (works with fixed header + respects reduced motion)
  const handleNavClick = (e, href) => {
    if (!href?.startsWith("#")) return; // external link, ignore
    e.preventDefault();

    // If we're not on the homepage layout, just go there with the hash
    if (location.pathname !== "/") {
      window.location.assign("/" + href);
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;

    const header = document.querySelector("header");
    const offset = (header?.offsetHeight || 72) + 8;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: prefersReduce ? "auto" : "smooth" });

    setMobileOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black shadow-lg">
      <nav className="flex items-center justify-between px-6 py-3 lg:px-16" aria-label="Primary">
        {/* Left: Logo */}
        <a
          href="#home"
          className="flex items-center gap-3 group"
          aria-label="Home"
          onClick={(e) => handleNavClick(e, "#home")}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-lime-400/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
            <img
              className="relative h-14 w-14 rounded-full border-2 border-lime-400 transform group-hover:scale-110 transition-transform duration-300"
              src="/src/assets/logo.png"
              alt="Logo"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-500 bg-clip-text text-transparent whitespace-nowrap">
            Amar Jashore
          </span>
        </a>

        {/* Center: Navigation links */}
        <div className="hidden lg:flex flex-1 justify-center gap-x-8">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="relative text-lg font-semibold text-white hover:text-lime-400 transition-all duration-300 group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-lime-400 to-blue-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Right: Auth buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {!authed ? (
            <a
              href="/login"
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-lime-500 px-6 py-2 text-sm font-bold text-white shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 group"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ) : (
            <>
              {/* ✅ Fixed link here */}
              <a
                href="/dashboard"
                className="relative overflow-hidden rounded-full bg-[#43850d] px-6 py-2 text-sm font-bold text-white shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 group"
              >
                <span className="relative z-10">Dashboard</span>
              </a>
              <button
                onClick={handleLogout}
                className="relative overflow-hidden rounded-full bg-gradient-to-r from-gray-700 to-gray-500 px-6 py-2 text-sm font-bold text-white shadow-lg hover:shadow-gray-500/30 transform hover:scale-105 transition-all duration-300 group"
              >
                <span className="relative z-10">Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile: Hamburger */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-3 text-white bg-gradient-to-r from-lime-600 to-blue-600 hover:from-lime-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-300"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute inset-x-0 top-full z-50 bg-black backdrop-blur-lg shadow-2xl border-t border-lime-500/20">
          <div className="p-6 space-y-4">
            {links.map((item, idx) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block text-base font-semibold text-white hover:text-lime-400 transition-all duration-300 transform hover:translate-x-2"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {item.label}
              </a>
            ))}

            {!authed ? (
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center rounded-full bg-gradient-to-r from-blue-600 to-lime-500 px-6 py-3 text-base font-bold text-white shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
              >
                Login
              </a>
            ) : (
              <>
                {/* ✅ Fixed link here */}
                <a
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center rounded-full bg-gradient-to-r from-blue-600 to-lime-500 px-6 py-3 text-base font-bold text-white shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
                >
                  Dashboard
                </a>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center rounded-full bg-gradient-to-r from-gray-700 to-gray-500 px-6 py-3 text-base font-bold text-white shadow-lg hover:shadow-gray-500/30 transform hover:scale-105 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
