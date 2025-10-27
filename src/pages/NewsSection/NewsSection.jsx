// src/pages/NewsSection/NewsSection.jsx
import React from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ABS } from "../../api/endpoints"; // ← use shared absolute-URL helper

const FALLBACK_IMG = new URL("../../assets/news/placeholder.jpg", import.meta.url).href;

const fileUrl = (p) => (!p ? "" : ABS(p));

const TAG_COLOR = "#74B93D";   // tag & button color (green)
const DIVIDER   = "#74B93D";   // thin line under image
const BANNER    = "#74B93D";   // light green header

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

/* ---------- scroll/visibility state keys for list restoration ---------- */
const NEWS_SCROLL_KEY = "news:list:scrollY";
const NEWS_VISIBLE_KEY = "news:list:visible";

function saveNewsScroll() {
  try {
    sessionStorage.setItem(NEWS_SCROLL_KEY, String(window.scrollY || 0));
  } catch {}
}
function saveNewsVisible(v) {
  try {
    sessionStorage.setItem(NEWS_VISIBLE_KEY, String(v));
  } catch {}
}
// ✅ Restore EXACT saved scrollY (no header offset subtraction). Wait for images.
async function restoreNewsScrollAfterImages() {
  try {
    const raw = sessionStorage.getItem(NEWS_SCROLL_KEY);
    if (!raw) return;

    const imgs = Array.from(document.querySelectorAll("#news-list img"));
    await Promise.all(
      imgs.map((img) =>
        "decode" in img ? img.decode().catch(() => {}) : Promise.resolve()
      )
    );

    sessionStorage.removeItem(NEWS_SCROLL_KEY);
    const y = parseInt(raw, 10) || 0;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: prefersReduce ? "auto" : "smooth",
    });
  } catch {}
}

/* ===============================================================
   Component: list + detail (same file, routed by /news and /news/:id)
   =============================================================== */
export default function NewsSection() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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

    const handleBack = () => {
      // Prefer history back if we arrived from the list; otherwise go to /news
      if (location.state?.news || location.state?.fromList) {
        navigate(-1);
      } else {
        navigate("/news");
      }
    };

    if (loading || !news) {
      return <section className="py-14 text-center text-sm text-gray-600">Loading…</section>;
    }

    return (
      <section className="relative py-10">
        <div className="absolute inset-0 bg-white/40 -z-10" />
        <div className="absolute inset-0 opacity-10 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)] [background-size:18px_18px]" />

        <div className="relative max-w-4xl mx-auto px-4">
          {/* Back control */}
          <button onClick={handleBack} className="text-sm font-semibold hover:underline mb-4" style={{ color: TAG_COLOR }}>
            ← Back to News
          </button>

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
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                decoding="async"
              />
              <div className="h-[4px] w-full" style={{ backgroundColor: DIVIDER }} />
            </div>
          )}

          {/* body */}
          <article className="mt-5 prose max-w-none leading-7 text-justify prose-p:my-4 prose-a:underline">
            <div dangerouslySetInnerHTML={{ __html: news.bodyHtml }} />
          </article>
        </div>
      </section>
    );
  }

  /* ---------------------- LIST VIEW ---------------------- */
  const [items, setItems] = React.useState([]);
  const [visible, setVisible] = React.useState(9);

  // Restore "visible" count first (so the same number of cards are shown after Back)
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(NEWS_VISIBLE_KEY);
      if (raw) {
        const v = parseInt(raw, 10);
        if (!Number.isNaN(v) && v > 0) setVisible(v);
      }
    } catch {}
  }, []);

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
          .sort((a, b) => {
            if (b._ts !== a._ts) return b._ts - a._ts;
            if (b._order !== a._order) return (b._order ?? 0) - (a._order ?? 0);
            return String(b.id).localeCompare(String(a.id));
          });

        setItems(mapped);
      })
      .catch((e) => console.error("Failed to fetch news:", e));
  }, []);

  // After items render, restore EXACT scroll (no header offset) after images decode
  React.useEffect(() => {
    if (items.length === 0) return;
    restoreNewsScrollAfterImages();
  }, [items.length]);

  // Save list state (scroll + visible) before navigating to a detail page
  const saveListState = React.useCallback(() => {
    saveNewsScroll();
    saveNewsVisible(visible);
  }, [visible]);

  return (
    <section className="relative pb-10">
      {/* === GREEN BANNER WITH NOTCH (like your screenshot) === */}
      <div className="relative">
        <div
          className="text-white text-2xl sm:text-3xl font-extrabold tracking-wide py-6 text-center"
          style={{ background: BANNER }}
        >
          LATEST
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rotate-45"
          style={{ background: BANNER, bottom: -16 }}
        />
      </div>

      {/* dotted background area under banner */}
      <div className="absolute inset-0 top-[56px] opacity-10 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)] [background-size:18px_18px]" />

      <div id="news-list" className="relative max-w-6xl mx-auto px-4 pt-8">
        {/* grid 1→2→3 cols */}
        {items.length === 0 ? (
          <p className="mt-10 text-center text-black/70">No news available.</p>
        ) : (
          <>
            <div className="mt-2 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, visible).map((n) => {
                const cover = n.image || n.gallery[0] || FALLBACK_IMG;
                const to = `/news/${encodeURIComponent(n.id)}`;
                const linkState = { news: n, fromList: true };
                return (
                  <article
                    key={n.id}
                    className="rounded border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                  >
                    {/* Image + divider */}
                    <Link
                      to={to}
                      state={linkState}
                      onClick={saveListState}
                      className="block relative overflow-hidden"
                    >
                      <img
                        src={cover}
                        alt={n.title}
                        className="block h-[180px] w-full object-cover"
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                        loading="lazy"
                        decoding="async"
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
                        to={to}
                        state={linkState}
                        onClick={saveListState}
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
