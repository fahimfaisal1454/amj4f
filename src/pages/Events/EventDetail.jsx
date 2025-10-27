// src/pages/Events/EventDetail.jsx
import React from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { ENDPOINTS, ABS } from "../../api/endpoints";

const FALLBACK_IMG = new URL("../../assets/news/placeholder.jpg", import.meta.url).href;
const RETURN_KEY = "events:returnTo";

export default function EventDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  // Fetch event
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

  // Derive photos early so hooks below can depend on them
  const photos = React.useMemo(
    () => (Array.isArray(data?.photos) ? data.photos : []),
    [data]
  );

  // Lightbox helpers
  const openAt = (i) => {
    if (!photos.length) return;
    setLightboxIndex(((i % photos.length) + photos.length) % photos.length);
    setIsLightboxOpen(true);
  };
  const close = () => setIsLightboxOpen(false);
  const next = () => setLightboxIndex((i) => (i + 1) % photos.length);
  const prev = () => setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);

  // Keyboard controls — MUST be before any early returns
  React.useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isLightboxOpen, photos.length]);

  const handleBack = () => {
    const s = location.state;
    const stateTarget = s?.returnTo;
    let storedTarget;
    try {
      storedTarget = sessionStorage.getItem(RETURN_KEY) || "";
    } catch {}
    const target = stateTarget || storedTarget;

    if (target) {
      navigate(target, { replace: true });
      try {
        sessionStorage.removeItem(RETURN_KEY);
      } catch {}
      return;
    }

    if (s?.fromList) {
      navigate(-1);
    } else {
      navigate("/events");
    }
  };

  // Early returns happen AFTER all hooks are declared
  if (loading) return <section className="max-w-container mx-auto px-4 py-10">Loading…</section>;
  if (error)
    return (
      <section className="max-w-container mx-auto px-4 py-10 text-red-600">
        {error}
      </section>
    );
  if (!data) return null;

  const cover = photos?.[0]?.image || "";

  return (
    <section className="max-w-container mx-auto px-4 py-10">
      {/* <button onClick={handleBack} className="mb-4 underline">← Back to Events</button> */}

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

      <h1 className="text-3xl font-bold mb-4">
        {data.title} {data.year || ""}
      </h1>

      {/* Cover image opens lightbox at index 0 */}
      {cover && (
        <button
          type="button"
          aria-label="Open photo"
          onClick={() => openAt(0)}
          className="block w-full text-left"
        >
          <img
            src={cover || FALLBACK_IMG}
            alt={data.title}
            className="w-full max-h-[480px] object-cover rounded border mb-8 cursor-zoom-in"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
            decoding="async"
          />
        </button>
      )}

      {data.description && (
        <p className="text-black mb-10 text-justify">{data.description}</p>
      )}

      <h2 className="text-xl font-semibold mb-3">Photos</h2>
      {!photos.length ? (
        <div className="text-gray-600">No photos yet.</div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((p, i) => (
            <button
              key={p.id ?? i}
              type="button"
              onClick={() => openAt(i)}
              className="block group text-left"
              aria-label={`Open photo ${i + 1}`}
            >
              <img
                src={p.image || FALLBACK_IMG}
                alt={p.caption || ""}
                className="h-44 w-full object-cover rounded border group-hover:opacity-90 cursor-zoom-in"
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                loading="lazy"
                decoding="async"
              />
              {p.caption && (
                <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {p.caption}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          {/* Stop propagation so clicks on the image/controls don't close */}
          <div className="relative max-w-[95vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightboxIndex]?.image || FALLBACK_IMG}
              alt={photos[lightboxIndex]?.caption || ""}
              className="max-w-[95vw] max-h-[80vh] object-contain rounded shadow-lg"
              onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
              decoding="async"
            />

            {/* Caption */}
            {photos[lightboxIndex]?.caption && (
              <div className="mt-3 text-center text-white/90 text-sm">
                {photos[lightboxIndex].caption}
              </div>
            )}

            {/* Close */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Close"
              className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-black/70 text-white text-xl leading-none"
              title="Esc"
            >
              ×
            </button>
          </div>

          {/* Prev / Next (fixed at overlay edges, vertically centered) */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="fixed left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/60 text-white text-2xl flex items-center justify-center hover:bg-black/75 z-[60]"
                title="←"
              >
                ‹
              </button>

              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="fixed right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/60 text-white text-2xl flex items-center justify-center hover:bg-black/75 z-[60]"
                title="→"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
