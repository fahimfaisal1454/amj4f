// src/pages/Events/EventDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ENDPOINTS, ABS } from "../../api/endpoints";

export default function EventDetail() {
  const { id } = useParams();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(ABS(`${ENDPOINTS.events}${id}/`));
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const j = await res.json();
        if (alive) setData(j);
      } catch (e) {
        if (alive) setError(e.message || "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading)
    return (
      <section className="max-w-container mx-auto px-4 py-10">
        Loading…
      </section>
    );
  if (error)
    return (
      <section className="max-w-container mx-auto px-4 py-10 text-red-600">
        {error}
      </section>
    );
  if (!data) return null;

  const cover = data.photos?.[0]?.image || "";

  return (
    <section className="max-w-container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-3 text-sm">
        <Link to="/events" className="underline">
          Events
        </Link>
        <span>›</span>
        <span className="text-gray-500">
          {data.title} {data.year || ""}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">
        {data.title} {data.year || ""}
      </h1>

      {/* Cover Image */}
      {cover && (
        <a href={cover} target="_blank" rel="noreferrer">
          <img
            src={cover}
            alt={data.title}
            className="w-full max-h-[480px] object-cover rounded border mb-8"
          />
        </a>
      )}

      {/* Description below image - bold, full width, black */}
      {data.description && (
        <p className="text-black  mb-10 text-justify">
          {data.description}
        </p>
      )}

      {/* Photos Grid */}
      <h2 className="text-xl font-semibold mb-3">Photos</h2>
      {!data.photos || data.photos.length === 0 ? (
        <div className="text-gray-600">No photos yet.</div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {data.photos.map((p) => (
            <a
              key={p.id}
              href={p.image}
              target="_blank"
              rel="noreferrer"
              className="block group"
            >
              <img
                src={p.image}
                alt={p.caption || ""}
                className="h-44 w-full object-cover rounded border group-hover:opacity-90"
              />
              {p.caption && (
                <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {p.caption}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
