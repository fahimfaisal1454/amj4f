// src/Pages/StoriesStrip/StoriesStrip.jsx
import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ABS } from "../../api/endpoints"; // ← use shared absolute-URL helper

const fileUrl = (p) => (!p ? "" : ABS(p));
const FALLBACK = "/src/assets/news/placeholder.jpg";

// THEME close to blog.brac.net look
const TAG_COLOR = "#74B93D";   // magenta-ish for categories
const DIVIDER   = "#74B93D";   // thin orange line below image

/* ========================== Helpers ========================== */
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
const excerpt = (html, len = 140) => {
  const t = stripHtml(html);
  return t.length <= len ? t : t.slice(0, len).replace(/\s+\S*$/, "") + "…";
};

/* =============================================================
   Detail view (same component, routed to /stories/:id)
   ============================================================= */
export default function StoriesStrip() {
  const { id } = useParams();
  const location = useLocation();
  const passed = location.state?.story;

  if (id) {
    const [story, setStory] = React.useState(
      passed
        ? {
            ...passed,
            image: fileUrl(passed.image),
          }
        : null
    );
    const [loading, setLoading] = React.useState(!passed);

    React.useEffect(() => {
      if (passed) return;
      let cancel = false;
      (async () => {
        try {
          const res = await fetch(ABS(`/api/stories/${encodeURIComponent(id)}/`));
          const s = await res.json();
          if (cancel) return;
          setStory({
            id: s.id ?? id,
            title: s.title || "Untitled",
            body: s.body || s.desc || "",
            desc: s.desc || "",
            image: fileUrl(s.image),
            tags: Array.isArray(s.tags)
              ? s.tags
              : (s.tag || "").split(",").map((x) => x.trim()).filter(Boolean),
            date: s.date || s.published_at || s.created_at || "",
          });
        } catch (e) {
          console.error(e);
        } finally {
          if (!cancel) setLoading(false);
        }
      })();
      return () => (cancel = true);
    }, [id, passed]);

    if (loading || !story) {
      return <section className="py-14 text-center text-sm text-gray-600">Loading…</section>;
    }

    return (
      <section className="relative py-10">
        <div className="absolute inset-0 bg-white/40 -z-10" />
        <div className="absolute inset-0 opacity-10 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)] [background-size:18px_18px]" />

        <div className="relative max-w-4xl mx-auto px-4">
          {/* hero image */}
          {story.image && (
            <div className="relative mb-5 overflow-hidden rounded">
              <img
                src={story.image}
                alt={story.title}
                className="w-full max-h-[420px] object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK)}
              />
            </div>
          )}

          {/* meta row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-wrap gap-2">
              {(story.tags || []).map((t, i) => (
                <span key={i} className="font-bold" style={{ color: TAG_COLOR }}>
                  {t}
                  {i < (story.tags?.length || 0) - 1 ? "," : ""}
                </span>
              ))}
            </div>
            <span className="text-gray-500">{formatDate(story.date)}</span>
          </div>

          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#111] leading-tight">
            {story.title}
          </h1>

          <article className="mt-5 prose max-w-none leading-7 text-justify prose-p:my-4 prose-a:underline">
            <div dangerouslySetInnerHTML={{ __html: story.body || story.desc }} />
          </article>

          <div className="mt-8">
            <Link
              to="/"
              className="text-sm font-semibold hover:underline"
              style={{ color: TAG_COLOR }}
            >
              ← Back to Stories
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* =============================================================
     Grid list view (blog.brac.net style)
     ============================================================= */
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    fetch(ABS(`/api/stories/`))
      .then((r) => r.json())
      .then((rows) => {
        const mapped = (rows || [])
          .filter((x) => x.is_active !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((s) => {
            const tags =
              Array.isArray(s.tags)
                ? s.tags
                : (s.tag || "").split(",").map((x) => x.trim()).filter(Boolean);

            return {
              id: s.id ?? s.slug ?? `${s.title}-${s.order ?? ""}`,
              title: s.title || "",
              body: s.body || "",
              desc: s.desc || "",
              image: fileUrl(s.image),
              date: s.date || s.published_at || s.created_at || "",
              tags,
            };
          });
        setItems(mapped);
      })
      .catch(() => setItems([]));
  }, []);

  return (
    <section
      id="stories"
      className="relative scroll-mt-[72px] py-2 overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/40" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)] [background-size:18px_18px]" />

      <div className="relative max-w-6xl mx-auto px-4">
        <h2 className="text-left text-black font-extrabold tracking-tight text-3xl sm:text-4xl">
          Impact Stories
        </h2>

        {/* 3-up grid like BRAC blog */}
        <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <article key={s.id} className="bg-white rounded shadow-sm hover:shadow-md transition">
              {/* image */}
              <Link to={`/stories/${encodeURIComponent(s.id)}`} state={{ story: s }}>
                <div className="relative overflow-hidden">
                  <img
                    src={s.image || FALLBACK}
                    alt={s.title}
                    className="block h-[190px] w-full object-cover"
                    onError={(e) => (e.currentTarget.src = FALLBACK)}
                  />
                  {/* thin divider below image */}
                  <div className="h-[4px] w-full" style={{ backgroundColor: DIVIDER }} />
                </div>
              </Link>

              {/* meta */}
              <div className="px-1 pt-2 flex items-center justify-between">
                <div className="text-[13px] font-bold" style={{ color: TAG_COLOR }}>
                  {(s.tags && s.tags.length > 0 ? s.tags : ["story"]).join(", ")}
                </div>
                <div className="text-[12px] text-gray-500">{formatDate(s.date)}</div>
              </div>

              {/* title + excerpt */}
              <div className="px-1 pb-4">
                <Link
                  to={`/stories/${encodeURIComponent(s.id)}`}
                  state={{ story: s }}
                  className="mt-1 block text-[1.35rem] leading-snug font-semibold text-[#1b1b1b]"
                >
                  {s.title}
                </Link>
                <p className="mt-1 text-[1rem] text-[#333]">
                  {excerpt(s.body || s.desc, 160)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
