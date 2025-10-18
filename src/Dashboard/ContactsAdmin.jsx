// src/Dashboard/ContactsAdmin.jsx
import React, { useMemo } from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS } from "../api/endpoints";

export default function ContactsAdmin() {
  // Calls GET /api/contact/
  const { data, loading, error } = useApiQuery(ENDPOINTS.contact, []);

  // Handle both array and paginated { results: [] } responses
  const items = useMemo(
    () => (Array.isArray(data) ? data : data?.results ?? []),
    [data]
  );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-pactPurple mb-4">
        Contact Messages
      </h1>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{String(error)}</div>}

      {!loading && !error && (
        items.length === 0 ? (
          <div className="rounded border bg-white p-6 text-gray-600">
            No messages yet.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((m) => (
              <MessageCard key={m.id ?? `${m.email}-${m.created_at ?? ""}`} msg={m} />
            ))}
          </div>
        )
      )}
    </DashboardLayout>
  );
}

function MessageCard({ msg }) {
  const created =
    msg.created_at ? new Date(msg.created_at).toLocaleString() : "";

  return (
    <div className="rounded border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{msg.name || "Anonymous"}</div>
        <div className="text-xs text-gray-500">{created}</div>
      </div>

      <div className="mt-1 text-sm text-gray-700 space-x-3">
        {msg.email && <span>{msg.email}</span>}
        {msg.phone && <span>{msg.phone}</span>}
      </div>

      <p className="mt-3 whitespace-pre-wrap">
        {msg.message || msg.body || ""}
      </p>
    </div>
  );
}
