import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../api/hooks";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    end
    className={({isActive}) =>
      `block rounded px-3 py-2 text-sm hover:bg-gray-50 ${isActive ? "bg-gray-100 font-semibold" : ""}`
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const doLogout = () => { logout(); nav("/login"); };

  return (
    <aside className="border-r bg-white p-4 w-[240px]">
      <h2 className="mb-4 text-xl font-bold text-pactPurple">Admin</h2>
      <nav className="space-y-1">
        <Item to="/admin">Overview</Item>
        <Item to="/admin/banners">Banners</Item>
        <Item to="/admin/news">News</Item>
        <Item to="/admin/programs">Programs</Item>
        <Item to="/admin/stories">Stories</Item>
        <Item to="/admin/about">About</Item>
        <Item to="/admin/impacts">Impacts</Item>
        <Item to="/admin/projects">Projects</Item>
        <Item to="/admin/contact-info">Contact Info</Item>
        <Item to="/admin/contacts">Contact Messages</Item>
      </nav>
      <button
        onClick={doLogout}
        className="mt-6 w-full rounded bg-red-600 py-2 text-white"
      >
        Logout
      </button>
    </aside>
  );
}
