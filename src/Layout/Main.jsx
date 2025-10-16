import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Pages
import Home from "../pages/Home/Home.jsx";
import AboutUs from "../pages/AboutUs/AboutUs.jsx";
import NewsSection from "../pages/NewsSection/NewsSection.jsx";
import ProgramsGrid from "../pages/ProgramsGrid/ProgramsGrid.jsx";
import StoriesStrip from "../pages/StoriesStrip/StoriesStrip.jsx";
import Contact from "../pages/Contact/Contact.jsx";

export default function Main() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div id="home" className="scroll-mt-[72px]"><Home /></div>
        <div id="about" className="scroll-mt-[72px]"><AboutUs /></div>
        <div id="news" className="scroll-mt-[72px]"><NewsSection /></div>
        <div id="programs" className="scroll-mt-[72px]"><ProgramsGrid /></div>
        <div id="stories" className="scroll-mt-[72px]"><StoriesStrip /></div>
        <div id="contact" className="scroll-mt-[72px]"><Contact /></div>
      </main>
      <Footer />
    </>
  );
}
