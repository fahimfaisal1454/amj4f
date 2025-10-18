// src/components/Navbar.jsx
import React from "react";

export default function Navbar() {
  const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "ABOUT US" },
    { href: "#programs", label: "Projects" },
    { href: "#stories", label: "Stories" },
    { href: "#news", label: "News" },
    { href: "#contact", label: "Contacts" },
  ];

  // Solid background after scrolling a bit (e.g. 40px)
  const [solid, setSolid] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      // fixed over hero, translucent; becomes more solid after scroll
      className={[
        "fixed top-0 inset-x-0 z-50 h-nav transition-colors",
        "border-b",
        solid
          ? "bg-white/85 backdrop-blur-md border-white/60"
          : "bg-white/25 backdrop-blur-md border-white/30",
      ].join(" ")}
    >
      <div className="max-w-container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <a href="#home" aria-label="Home" className="flex items-center gap-2">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="h-11 w-auto hidden sm:block"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="text-pactPurple font-extrabold text-2xl leading-none">
            Amar Jashore
          </span>
        </a>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-9">
          <nav className="flex items-center gap-9">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-pactPurple font-extrabold uppercase tracking-wide text-[1.05rem] border-b-2 border-transparent hover:text-pactPurpleHover hover:border-pactPurpleHover transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Login + Dashboard */}
          <div className="flex items-center gap-3 ml-4">
            <a
              href="/admin"
              className="inline-flex items-center rounded-full bg-pactPurpleHover px-4 py-2 text-sm font-bold text-white hover:opacity-90"
              aria-label="Dashboard"
            >
              Dashboard
            </a>
            <a
              href="/login"
              className="inline-flex items-center rounded-full bg-pactPurple px-4 py-2 text-sm font-bold text-white hover:opacity-90"
              aria-label="Login"
            >
              Login
            </a>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3 max-w-[70%] justify-end flex-wrap">
          <nav className="flex flex-wrap justify-end gap-3">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-pactPurple text-sm font-extrabold uppercase tracking-wide"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex gap-2 mt-2">
            <a
              href="/admin"
              className="inline-flex items-center rounded-full bg-pactPurpleHover px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
              aria-label="Dashboard"
            >
              Dashboard
            </a>
            <a
              href="/login"
              className="inline-flex items-center rounded-full bg-pactPurple px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
              aria-label="Login"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
