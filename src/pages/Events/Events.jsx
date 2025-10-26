// src/pages/Events/Events.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ENDPOINTS } from "../../api/endpoints";
import { useApiQuery } from "../../api/hooks";

const GREEN = "#74B93D"; // your color

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

  const catList = React.useMemo(
    () => (cats.data || []).map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
    [cats.data]
  );

  return (
    <section className="relative pb-10">
      {/* Header banner */}
      <div className="relative">
        <div
          className="text-white text-2xl sm:text-3xl font-extrabold tracking-wide py-6 text-center"
          style={{ background: GREEN }}
        >
          EVENTS
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rotate-45"
          style={{ background: GREEN, bottom: -16 }}
        />
      </div>

      <div className="relative max-w-container mx-auto px-4 pt-8">
        {/* Category buttons + Year filter */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Category buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* All */}
            <button
              onClick={() => setFilters((f) => ({ ...f, cat: "" }))}
              className={`whitespace-nowrap rounded-md border px-3 py-1 text-xs sm:text-sm font-extrabold tracking-wide uppercase ${
                !filters.cat ? "ring-2 ring-offset-1" : ""
              }`}
              style={{
                borderColor: GREEN,
                color: !filters.cat ? "white" : GREEN,
                background: !filters.cat ? GREEN : "transparent",
              }}
            >
              All Events
            </button>

            {catList.map((c) => {
              const active = filters.cat === c.slug;
              return (
                <button
                  key={c.id}
                  onClick={() =>
                    setFilters((f) => ({ ...f, cat: active ? "" : c.slug }))
                  }
                  className="whitespace-nowrap rounded-md px-3 py-1 text-xs sm:text-sm font-extrabold tracking-wide uppercase transition"
                  style={{
                    background: active ? GREEN : "transparent",
                    color: active ? "white" : GREEN,
                    border: `1.5px solid ${GREEN}`,
                  }}
                  title={c.name}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Year dropdown
          <select
            value={filters.year}
            onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
            className="rounded border px-3 py-2 ml-auto"
          >
            <option value="">All Years</option>
            {allYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select> */}
        </div>

        {/* Event grid */}
        {events.loading && <div>Loading…</div>}
        {events.error && <div className="text-red-600">{String(events.error)}</div>}

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
      </div>
    </section>
  );
}

function EventCard({ ev }) {
  const cover = ev.photos?.[0]?.image ? ev.photos[0].image : "";

  return (
    <div className="rounded border-4 border-lime-500 bg-white overflow-hidden">
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
        <div className="font-semibold">
          <Link to={`/events/${ev.id}`} className="hover:underline">
            {ev.title} {ev.year || ""}
          </Link>
        </div>
        {ev.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ev.description}</p>
        )}

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
