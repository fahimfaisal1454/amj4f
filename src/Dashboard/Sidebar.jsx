import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../api/hooks";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `block rounded px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-indigo-700 text-white"
          : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
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

  // Sidebar links matching backend models + Home
  const items = [
    { to: "/", label: "Home" },
    { to: "/admin", label: "Overview" },
    { to: "/admin/banners", label: "Banners" },
    { to: "/admin/news", label: "News" },
    { to: "/admin/programs", label: "Programs" },
    { to: "/admin/stories", label: "Stories" },
    { to: "/admin/about", label: "About" },
    { to: "/admin/contact-info", label: "Contact Info" },
    { to: "/admin/contacts", label: "Contact Messages" },
  ];

  return (
    <aside className="flex flex-col h-screen w-[240px] bg-indigo-900 text-white border-r border-indigo-800">
      <div className="p-4 border-b border-indigo-800">
        <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
      </div>

      <nav className="flex-1 overflow-y-auto mt-4 space-y-1 px-2">
        {items.map((it) => (
          <Item key={it.to} to={it.to}>
            {it.label}
          </Item>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-800">
        <button
          onClick={doLogout}
          className="w-full rounded bg-red-600 py-2 text-white font-medium hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
