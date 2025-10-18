import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";

// If you later expose GET /api/contact/ for admins,
// replace URL below with that endpoint.
const MESSAGES_URL = "/api/contact/"; // placeholder

export default function ContactsAdmin() {
  // You can switch to useApiQuery(MESSAGES_URL) once backend allows listing (IsAdminUser).
  const { data, loading, error } = { data: null, loading: false, error: "" };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-pactPurple mb-4">Contact Messages</h1>
      {!data && (
        <div className="rounded border bg-yellow-50 p-4 text-yellow-800">
          To list messages here, expose a read endpoint for admins (e.g. GET /api/contact/ with IsAdminUser).
        </div>
      )}
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
    </DashboardLayout>
  );
}
