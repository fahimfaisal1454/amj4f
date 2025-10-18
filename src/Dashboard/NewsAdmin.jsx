import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS } from "../api/endpoints";

export default function NewsAdmin() {
  const { data, loading, error } = useApiQuery(ENDPOINTS.news, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-pactPurple mb-4">News</h1>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data || []).map((n) => (
          <div key={n.id} className="rounded border bg-white shadow-sm overflow-hidden">
            <img src={n.image} alt={n.title} className="h-40 w-full object-cover" />
            <div className="p-3">
              <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200">{n.tag}</span>
              <div className="font-semibold mt-1">{n.title}</div>
              <div className="text-xs text-gray-500 mt-1">Published: {n.published_at || "—"}</div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="/admin/sitecontent/newsitem/"
        className="mt-4 inline-flex w-fit rounded bg-pactPurple px-4 py-2 font-semibold text-white"
      >
        Manage in Django Admin
      </a>
    </DashboardLayout>
  );
}
