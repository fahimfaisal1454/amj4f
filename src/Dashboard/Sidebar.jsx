// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../api/hooks";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `block rounded-lg px-4 py-3 text-sm font-bold tracking-wide transition-all duration-300 ${
        isActive
          ? "bg-[#111111] text-[#C5FB5A] shadow-inner shadow-lime-400/40"
          : "text-[#C5FB5A] hover:bg-[#1a1a1a] hover:text-white"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  const { logout } = useAuth();
  const nav = useNavigate();

  const doLogout = () => {
    logout();
    nav("/login");
  };

  const items = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Overview" },
    { to: "/dashboard/about", label: "About" },
    { to: "/dashboard/banners", label: "Banners" },
    { to: "/dashboard/news", label: "News" },
    { to: "/dashboard/programs", label: "Programs" },
    { to: "/dashboard/stories", label: "Stories" },
    { to: "/dashboard/contact-info", label: "Contact Info" },
    { to: "/dashboard/contacts", label: "Contact Messages" },
  ];

  return (
    <aside
      className="
        sticky top-0 left-0
        flex flex-col flex-none
        w-[250px] h-[100dvh]  /* fills viewport height on all devices */
        bg-black text-[#C5FB5A]
        border-r border-[#222] shadow-lg
        z-40
      "
    >
      {/* Header */}
      <div className="p-5 border-b border-[#222] text-center">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>

      {/* Nav Links (own scroll) */}
      <nav className="flex-1 overflow-y-auto mt-6 space-y-1 px-3">
        {items.map((it) => (
          <Item key={it.to} to={it.to}>
            {it.label}
          </Item>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#222]">
        <button
          onClick={doLogout}
          className="w-full rounded-lg bg-gradient-to-r from-red-700 to-red-600 py-3 text-white font-bold uppercase tracking-wide shadow-md hover:from-red-600 hover:to-red-500 hover:scale-105 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
