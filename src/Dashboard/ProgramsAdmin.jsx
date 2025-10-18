import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS } from "../api/endpoints";

export default function ProgramsAdmin() {
  const { data, loading, error } = useApiQuery(ENDPOINTS.programs, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-pactPurple mb-4">Programs</h1>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data || []).map((p) => (
          <div key={p.id} className="rounded border bg-white shadow-sm overflow-hidden">
            <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />
            <div className="p-3">
              <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200">{p.tag}</span>
              <div className="font-semibold mt-1">{p.title}</div>
              <div className="text-sm text-gray-600 mt-1">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="/admin/sitecontent/program/"
        className="mt-4 inline-flex w-fit rounded bg-pactPurple px-4 py-2 font-semibold text-white"
      >
        Manage in Django Admin
      </a>
    </DashboardLayout>
  );
}
