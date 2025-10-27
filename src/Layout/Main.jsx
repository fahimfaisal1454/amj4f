// src/Layout/Main.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Pages
import Home from "../pages/Home/Home.jsx";
import AboutUs from "../pages/AboutUs/AboutUs.jsx";
import NewsSection from "../pages/NewsSection/NewsSection.jsx";
import ProgramsGrid from "../pages/ProgramsGrid/ProgramsGrid.jsx";
import StoriesStrip from "../pages/StoriesStrip/StoriesStrip.jsx";
import Contact from "../pages/Contact/Contact.jsx";
import Events from "../pages/Events/Events.jsx";

export default function Main() {
  const location = useLocation();

  const scrollToHash = (hash) => {
    // If no hash, ensure we go to very top for "home"
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const el = document.querySelector(hash);
    if (!el) return;

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Defer one frame so layout/paint are stable, then rely on CSS scroll-margin
    requestAnimationFrame(() => {
      el.scrollIntoView({
        block: "start",
        behavior: prefersReduce ? "auto" : "smooth",
      });
    });
  };

  // Scroll when hash changes (including back/forward)
  useEffect(() => {
    scrollToHash(location.hash);
  }, [location.hash]);

  // Safety net for manual popstate changes
  useEffect(() => {
    const onPop = () => scrollToHash(window.location.hash);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div id="home" className="scroll-mt-[72px]"><Home /></div>
        <div id="about" className="scroll-mt-[72px]"><AboutUs /></div>
        <div id="news" className="scroll-mt-[72px]"><NewsSection /></div>
        <div id="programs" className="scroll-mt-[72px]"><ProgramsGrid /></div>
        <div id="stories" className="scroll-mt-[72px]"><StoriesStrip /></div>
        <div id="events" className="scroll-mt-[72px]"><Events /></div>
        <div id="contact" className="scroll-mt-[72px]"><Contact /></div>
      </main>
      <Footer />
    </>
  );
}
