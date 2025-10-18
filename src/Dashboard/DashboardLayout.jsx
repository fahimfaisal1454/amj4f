import React from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-[240px,1fr] bg-[#faf9f8]">
      <Sidebar />
      <main className="p-6">{children}</main>
    </div>
  );
}
