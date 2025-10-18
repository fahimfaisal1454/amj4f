// src/components/Navbar.jsx
import React from "react";

export default function Navbar() {
  const links = [
    { href: "/#home", label: "Home" },
    { href: "/#about", label: "ABOUT US" },
    { href: "/#programs", label: "Projects" },
    { href: "/#stories", label: "Stories" },
    { href: "/#news", label: "News" },
    { href: "/#contact", label: "Contacts" },
  ];

  const [solid, setSolid] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 h-16 transition-colors border-b",
        solid
          ? "bg-gradient-to-r from-lime-300 to-black border-lime-200"
          : "bg-gradient-to-r from-lime-200/60 to-black/60 backdrop-blur-md border-lime-100/40",
      ].join(" ")}
    >
      <div className="max-w-container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" aria-label="Home" className="flex items-center gap-2">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="h-9 w-auto hidden sm:block"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="text-black font-extrabold text-xl leading-none">
            Amar Jashore
          </span>
        </a>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* ONE slim pill behind all links, using your Dashboard color */}
          <nav className="flex items-center gap-5 rounded-full bg-[#C5FB5A] px-5 py-1 shadow">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-black font-extrabold uppercase tracking-wide text-[0.95rem] px-2 py-1 rounded-full hover:bg-black hover:text-[#C5FB5A] transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Buttons (tight pills) */}
          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="inline-flex items-center rounded-full bg-[#C5FB5A] px-3 py-1 text-xs font-bold text-black hover:bg-black hover:text-[#C5FB5A] transition-colors shadow"
              aria-label="Dashboard"
            >
              Dashboard
            </a>
            <a
              href="/login"
              className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-bold text-[#C5FB5A] hover:bg-[#C5FB5A] hover:text-black transition-colors"
              aria-label="Login"
            >
              Login
            </a>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="/login"
            className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-bold text-[#C5FB5A]"
            aria-label="Login"
          >
            Login
          </a>
          <a
            href="/admin"
            className="inline-flex items-center rounded-full bg-[#C5FB5A] px-3 py-1 text-xs font-bold text-black"
            aria-label="Dashboard"
          >
            Dashboard
          </a>
        </div>
      </div>
    </header>
  );
}
