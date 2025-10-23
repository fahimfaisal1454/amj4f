// src/pages/NewsSection/NewsSection.jsx
import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ABS } from "../../api/endpoints"; // ← use shared absolute-URL helper

const fileUrl = (p) => (!p ? "" : ABS(p));

const TAG_COLOR = "#74B93D";   // magenta (tags)
const DIVIDER   = "#74B93D";   // thin orange line under image

/* --------------------------- helpers --------------------------- */
const toTS = (n) => {
  const d = n?.date || n?.published_at || n?.created_at || n?.updated_at || "";
  const t = Date.parse(d);
  return Number.isNaN(t) ? -Infinity : t;
};
const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
const stripHtml = (html) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
};

/* ===============================================================
   Component: list + detail (same file, routed by /news and /news/:id)
   =============================================================== */
export default function NewsSection() {
  const { id } = useParams();
  const location = useLocation();

  /* ---------------------- DETAIL VIEW ---------------------- */
  if (id) {
    const passedNews = location.state?.news;
    const [news, setNews] = React.useState(
      passedNews
        ? {
            ...passedNews,
            image: fileUrl(passedNews.image),
            file: fileUrl(passedNews.file),
          }
        : null
    );
    const [loading, setLoading] = React.useState(!passedNews);

    React.useEffect(() => {
      if (passedNews) return;
      let cancel = false;
      (async () => {
        try {
          const res = await fetch(ABS(`/api/news/${encodeURIComponent(id)}/`));
          const n = await res.json();
          if (cancel) return;
          const galleryRaw = n.images || n.gallery || n.photos || [];
          const gallery = Array.isArray(galleryRaw)
            ? galleryRaw.map(fileUrl).filter(Boolean)
            : [];
          setNews({
            id: n.id ?? id,
            title: n.title || "Untitled",
            bodyHtml: n.body || "",
            date: n.date || n.published_at || n.created_at || "",
            tags: Array.isArray(n.tags)
              ? n.tags
              : (n.tag || "").split(",").map((x) => x.trim()).filter(Boolean),
            image: fileUrl(n.image),
            gallery,
            file: fileUrl(n.file),
          });
        } catch (e) {
          console.error("Failed to fetch news:", e);
        } finally {
          if (!cancel) setLoading(false);
        }
      })();
      return () => (cancel = true);
    }, [id, passedNews]);

    if (loading || !news) {
      return <section className="py-14 text-center text-sm text-gray-600">Loading…</section>;
    }

    return (
      <section className="relative py-10">
        <div className="absolute inset-0 bg-white/40 -z-10" />
        <div className="absolute inset-0 opacity-10 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)] [background-size:18px_18px]" />

        <div className="relative max-w-4xl mx-auto px-4">
          {/* meta row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-wrap gap-2">
              {(news.tags || []).map((t, i) => (
                <span key={i} className="font-bold" style={{ color: TAG_COLOR }}>
                  {t}
                  {i < (news.tags?.length || 0) - 1 ? "," : ""}
                </span>
              ))}
            </div>
            <span className="text-gray-500">{formatDate(news.date)}</span>
          </div>

          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#111] leading-tight">
            {news.title}
          </h1>

          {/* hero image */}
          {(news.image || (news.gallery && news.gallery.length > 0)) && (
            <div className="relative mt-4 overflow-hidden rounded">
              <img
                src={(news.gallery && news.gallery[0]) || news.image}
                alt={news.title}
                className="w-full max-h-[420px] object-cover"
                onError={(e) => (e.currentTarget.src = "/src/assets/news/placeholder.jpg")}
              />
              <div className="h-[4px] w-full" style={{ backgroundColor: DIVIDER }} />
            </div>
          )}

          {/* body */}
          <article className="mt-5 prose max-w-none leading-7 text-justify prose-p:my-4 prose-a:underline">
            <div dangerouslySetInnerHTML={{ __html: news.bodyHtml }} />
          </article>

          <div className="mt-8">
            <Link
              to="/"
              className="text-sm font-semibold hover:underline"
              style={{ color: TAG_COLOR }}
            >
              ← Back to News
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------------- LIST VIEW ---------------------- */
  const [items, setItems] = React.useState([]);
  const [visible, setVisible] = React.useState(9);

  React.useEffect(() => {
    fetch(ABS(`/api/news/`))
      .then((r) => r.json())
      .then((rows) => {
        const mapped = (rows || [])
          .filter((n) => n?.is_active !== false)
          .map((n) => {
            const tags = Array.isArray(n.tags)
              ? n.tags
              : (n.tag || "").split(",").map((t) => t.trim()).filter(Boolean);
            const galleryRaw = n.images || n.gallery || n.photos || [];
            const gallery = Array.isArray(galleryRaw)
              ? galleryRaw.map(fileUrl).filter(Boolean)
              : [];
            return {
              id: n.id ?? n.slug ?? `${n.title}-${n.order ?? ""}`,
              title: n.title || "শিরোনাম নেই",
              date: n.date || n.published_at || n.created_at || "",
              image: fileUrl(n.image),
              gallery,
              tags,
              bodyHtml: n.body || "",
              _ts: toTS(n),
              _order: n.order ?? 0,
            };
          })
          // newest first; tie-breakers
          .sort((a, b) => {
            if (b._ts !== a._ts) return b._ts - a._ts;
            if (b._order !== a._order) return (b._order ?? 0) - (a._order ?? 0);
            return String(b.id).localeCompare(String(a.id));
          });

        setItems(mapped);
      })
      .catch((e) => console.error("Failed to fetch news:", e));
  }, []);

  return (
    <section className="relative py-10">
      <div className="absolute inset-0 bg-white/40 -z-10" />
      <div className="absolute inset-0 opacity-10 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)] [background-size:18px_18px]" />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* header like example */}
        <div className="flex items-center gap-4">
          <div className="h-[3px] w-16 rounded" style={{ backgroundColor: DIVIDER }} />
          <h2 className="text-center text-black tracking-wide text-xl sm:text-2xl font-extrabold">
            LATEST
          </h2>
          <div className="h-[3px] flex-1 rounded" style={{ backgroundColor: DIVIDER }} />
        </div>

        {/* grid 1→2→3 cols */}
        {items.length === 0 ? (
          <p className="mt-10 text-center text-black/70">No news available.</p>
        ) : (
          <>
            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, visible).map((n) => {
                const cover = n.image || n.gallery[0] || "/src/assets/news/placeholder.jpg";
                return (
                  <article
                    key={n.id}
                    className="rounded border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                  >
                    {/* Image + divider */}
                    <Link
                      to={`/news/${encodeURIComponent(n.id)}`}
                      state={{ news: n }}
                      className="block relative overflow-hidden"
                    >
                      <img
                        src={cover}
                        alt={n.title}
                        className="block h-[180px] w-full object-cover"
                        onError={(e) => (e.currentTarget.src = "/src/assets/news/placeholder.jpg")}
                      />
                      <div className="h-[4px] w-full" style={{ backgroundColor: DIVIDER }} />
                    </Link>

                    {/* Meta row */}
                    <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                      <div className="text-[13px] font-bold" style={{ color: TAG_COLOR }}>
                        {(n.tags && n.tags.length > 0 ? n.tags : ["news"]).join(", ")}
                      </div>
                      <div className="text-[12px] text-gray-500">{formatDate(n.date)}</div>
                    </div>

                    {/* Title */}
                    <div className="px-3 pb-4">
                      <Link
                        to={`/news/${encodeURIComponent(n.id)}`}
                        state={{ news: n }}
                        className="mt-1 block text-[1.15rem] leading-snug font-semibold text-[#1b1b1b] hover:underline"
                      >
                        {n.title}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load more */}
            {visible < items.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisible((v) => v + 9)}
                  className="rounded px-4 py-1.5 text-sm font-semibold text-white"
                  style={{ backgroundColor: TAG_COLOR }}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
