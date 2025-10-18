import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS } from "../api/endpoints";

export default function AboutAdmin() {
  const { data, loading, error } = useApiQuery(ENDPOINTS.about, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-pactPurple mb-4">About Section</h1>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {data && (
        <div className="grid gap-4">
          <div className="rounded border bg-white p-4">
            <div className="text-sm text-gray-500">Heading</div>
            <div className="font-semibold">{data.heading}</div>
          </div>
          <div className="rounded border bg-white p-4">
            <div className="text-sm text-gray-500">Description</div>
            <p className="whitespace-pre-wrap">{data.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded border bg-white p-4">
                <div className="text-sm text-gray-500">Stat {i}</div>
                <div className="text-xl font-bold">{data[`stat${i}_number`]}</div>
                <div>{data[`stat${i}_label`]}</div>
              </div>
            ))}
          </div>

          <div className="rounded border bg-white p-4">
            <div className="text-sm text-gray-500">MVV</div>
            <ul className="list-disc ml-6">
              <li><strong>Mission:</strong> {data.mission_title}</li>
              <li><strong>Vision:</strong> {data.vision_title}</li>
              <li><strong>Values:</strong> {data.values_title}</li>
            </ul>
          </div>

          <a
            href="/admin/sitecontent/aboutsection/" // Django admin list
            className="inline-flex w-fit rounded bg-pactPurple px-4 py-2 font-semibold text-white"
          >
            Edit in Django Admin
          </a>
        </div>
      )}
    </DashboardLayout>
  );
}
