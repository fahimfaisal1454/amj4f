// src/api/endpoints.js

// Choose API base from env + build mode, with safe fallbacks
function pickApiBase() {
  const isProdBuild = !!import.meta.env.PROD;
  const local = import.meta.env.VITE_API_BASE_URL_LOCAL;
  const prod = import.meta.env.VITE_API_BASE_URL_PROD;

  let base = isProdBuild ? prod : local;

  // Final fallback by hostname if envs are missing
  if (!base) {
    const isLocalHost =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";
    base = isLocalHost
      ? "http://127.0.0.1:8000"
      : "https://amarjashore.org.bd";
  }

  return String(base).replace(/\/+$/, ""); // trim trailing slash
}

export const API_BASE = pickApiBase();

// Make any path absolute against API_BASE (keeps absolute URLs as-is)
// Preserves trailing slash behavior (important for DRF)
export const ABS = (p) => {
  if (!p) return "";
  const str = String(p);
  const hasTrailing = /\/$/.test(str);
  const path = str.replace(/\/+$/, "");
  const abs = /^https?:\/\//i.test(path) ? path : `${API_BASE}${path}`;
  return hasTrailing ? `${abs}/` : abs;
};

// Keep these as *paths* (with trailing slashes where DRF expects them)
export const ENDPOINTS = {
  base: API_BASE,

  // Auth
  login: "/api/auth/login/",
  refresh: "/api/auth/refresh/",

  // Public (GET)
  banners: "/api/banners/",
  about: "/api/about/",
  news: "/api/news/",
  programs: "/api/programs/",
  stories: "/api/stories/",
  contactInfo: "/api/contact-info/",
  contact: "/api/contact/",

  // Admin (write) — note trailing slashes
  aboutManage: "/api/about/manage/",
  aboutWhatWeDo: "/api/about/what-we-do/",
  aboutJourney: "/api/about/journey/",
  newsManage: "/api/news/manage/",
  programsManage: "/api/programs/manage/",
  storiesManage: "/api/stories/manage/",
  contactInfoManage: "/api/contact-info/manage/",
};
