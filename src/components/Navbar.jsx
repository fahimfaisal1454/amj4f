export default function Navbar() {
  const links = [
    { href: "#about", label: "ABOUT US" },
    { href: "#programs", label: "Projects" },
    { href: "#stories", label: "Stories" },
    { href: "#news", label: "News" },
    { href: "#contact", label: "Contacts" },
    
  ];

  return (
    <header className="fixed top-0 inset-x-0 h-nav z-50 bg-pactBg border-y border-[#e1dfdc]">
      <div className="max-w-container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo: image (optional) + text fallback */}
        <a href="#home" aria-label="Home" className="flex items-center gap-2">
          <img
            src="/src/assets/logo.png"
            alt=""
            className="h-11 w-auto hidden sm:block"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <span className="text-pactPurple font-extrabold text-2xl leading-none">pact</span>
        </a>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-9">
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

        {/* Small screens: wrap links (no hamburger requested) */}
        <nav className="md:hidden flex flex-wrap justify-end gap-3 max-w-[70%]">
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
      </div>
    </header>
  );
}
