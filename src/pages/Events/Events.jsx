// src/pages/Events/Events.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ENDPOINTS } from "../../api/endpoints";
import { useApiQuery } from "../../api/hooks";

export default function Events() {
  const cats = useApiQuery(ENDPOINTS.eventCategoriesPublic, []);
  const [filters, setFilters] = React.useState({ cat: "", year: "" });

  const events = useApiQuery(
    `${ENDPOINTS.events}?${new URLSearchParams({
      category: filters.cat || "",
      year: filters.year || "",
    })}`,
    [filters.cat, filters.year]
  );

  const allYears = React.useMemo(() => {
    const list = (events.data || []).map((e) => e.year).filter(Boolean);
    return Array.from(new Set(list)).sort().reverse();
  }, [events.data]);

  return (
    <section className="max-w-container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filters.cat}
          onChange={(e) => setFilters((f) => ({ ...f, cat: e.target.value }))}
          className="rounded border px-3 py-2"
        >
          <option value="">All Categories</option>
          {(cats.data || []).map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filters.year}
          onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
          className="rounded border px-3 py-2"
        >
          <option value="">All Years</option>
          {allYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of events */}
      {events.loading && <div>Loading…</div>}
      {events.error && (
        <div className="text-red-600">{String(events.error)}</div>
      )}

      {!events.loading && !events.error && (
        (events.data || []).length === 0 ? (
          <div className="text-gray-600">No events found.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(events.data || []).map((ev) => (
              <EventCard key={ev.id} ev={ev} />
            ))}
          </div>
        )
      )}
    </section>
  );
}

function EventCard({ ev }) {
  const cover = ev.photos?.[0]?.image ? ev.photos[0].image : "";

  return (
    <div className="rounded border bg-white overflow-hidden">
      {/* Clickable cover → detail page */}
      <Link to={`/events/${ev.id}`}>
        {cover ? (
          <img src={cover} alt={ev.title} className="h-48 w-full object-cover" />
        ) : (
          <div className="h-48 w-full bg-gray-100 grid place-items-center text-gray-400">
            No image
          </div>
        )}
      </Link>

      <div className="p-4">
        {/* Clickable title → detail page */}
        <div className="font-semibold">
          <Link to={`/events/${ev.id}`} className="hover:underline">
            {ev.title} {ev.year ? `(${ev.year})` : ""}
          </Link>
        </div>
        {ev.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {ev.description}
          </p>
        )}

        {/* Thumbnails → detail page */}
        {ev.photos?.length > 0 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {ev.photos.slice(0, 10).map((p) => (
              <Link key={p.id} to={`/events/${ev.id}`}>
                <img
                  src={p.image}
                  alt={p.caption || ""}
                  className="h-16 w-full object-cover rounded"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
