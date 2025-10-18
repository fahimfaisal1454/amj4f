import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS } from "../api/endpoints";

export default function ContactInfoAdmin() {
  const { data, loading, error } = useApiQuery(ENDPOINTS.contactInfo, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-pactPurple mb-4">Contact Info</h1>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {data && (
        <div className="grid gap-4">
          <Row label="Email" value={data.email} />
          <Row label="Phone" value={data.phone} />
          <Row label="Address" value={data.address} />
          <Row label="Hours" value={data.hours} />
        </div>
      )}

      <a
        href="/admin/sitecontent/contactinfo/"
        className="mt-4 inline-flex w-fit rounded bg-pactPurple px-4 py-2 font-semibold text-white"
      >
        Manage in Django Admin
      </a>
    </DashboardLayout>
  );
}

function Row({ label, value }) {
  return (
    <div className="rounded border bg-white p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold">{value || "—"}</div>
    </div>
  );
}
