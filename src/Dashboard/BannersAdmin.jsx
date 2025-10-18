import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS } from "../api/endpoints";

export default function BannersAdmin() {
  const { data, loading, error } = useApiQuery(ENDPOINTS.banners, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-pactPurple mb-4">Banners</h1>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data || []).map((b) => (
          <div key={b.id} className="rounded border bg-white shadow-sm overflow-hidden">
            <img src={b.image} alt={b.title} className="h-40 w-full object-cover" />
            <div className="p-3">
              <div className="font-semibold">{b.title}</div>
              <div className="text-sm text-gray-500">{b.caption}</div>
              <div className="text-xs mt-1">CTA: {b.cta_label} → {b.cta_href}</div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="/admin/sitecontent/banner/"
        className="mt-4 inline-flex w-fit rounded bg-pactPurple px-4 py-2 font-semibold text-white"
      >
        Manage in Django Admin
      </a>
    </DashboardLayout>
  );
}
