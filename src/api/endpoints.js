// src/api/endpoints.js
const API = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export const ENDPOINTS = {
  base: API,

  // auth
  login: "/api/auth/login/",
  refresh: "/api/auth/refresh/",

  // read-only you already use
  banners: "/api/banners/",
  about: "/api/about/",
  news: "/api/news/",
  programs: "/api/programs/",
  stories: "/api/stories/",
  contactInfo: "/api/contact-info/",
  contact: "/api/contact/", // POST

  // later: add admin write endpoints if you expose them
};
