// src/api/endpoints.js
const API = (import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000").replace(/\/+$/, "");

export const ENDPOINTS = {
  base: API,

  // auth
  login: "/api/auth/login/",
  refresh: "/api/auth/refresh/",

  // read-only
  banners: "/api/banners/",
  about: "/api/about/",
  news: "/api/news/",
  programs: "/api/programs/",
  stories: "/api/stories/",
  contactInfo: "/api/contact-info/",
  contact: "/api/contact/",

  // ✅ writable admin route for news
  aboutManage: "/api/about/manage/",
  aboutWhatWeDo: "/api/about/what-we-do/",
  aboutJourney: "/api/about/journey/",
  newsManage: "/api/news/manage/",
  programsManage: "/api/programs/manage/",
  storiesManage: "/api/stories/manage/",
  contactInfoManage: "/api/contact-info/manage/",
};
