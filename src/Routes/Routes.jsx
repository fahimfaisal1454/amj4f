// src/Routes/Routes.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Main from "../Layout/Main.jsx";
import ErrorPage from "../Pages/ErrorPage/ErrorPage.jsx";
import NewsSection from "../pages/NewsSection/NewsSection.jsx";
import StoriesStrip from "../pages/StoriesStrip/StoriesStrip.jsx";



// Dashboard pages
import Login from "../Dashboard/Login.jsx";
import AdminHome from "../Dashboard/index.jsx";
import BannersAdmin from "../Dashboard/BannersAdmin.jsx";
import NewsAdmin from "../Dashboard/NewsAdmin.jsx";
import ProgramsAdmin from "../Dashboard/ProgramsAdmin.jsx";
import StoriesAdmin from "../Dashboard/StoriesAdmin.jsx";
import AboutAdmin from "../Dashboard/AboutAdmin.jsx";
import ContactInfoAdmin from "../Dashboard/ContactInfoAdmin.jsx";
import ContactsAdmin from "../Dashboard/ContactsAdmin.jsx";

// Auth guard
import ProtectedRoute from "../Components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },

{ path: "/news/:id", element: <NewsSection /> },
{ path: "/stories/:id", element: <StoriesStrip /> },

  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <AdminHome /> },
      { path: "/dashboard/banners", element: <BannersAdmin /> },
      { path: "/dashboard/news", element: <NewsAdmin /> },
      { path: "/dashboard/programs", element: <ProgramsAdmin /> },
      { path: "/dashboard/stories", element: <StoriesAdmin /> },
      { path: "/dashboard/about", element: <AboutAdmin /> },
      { path: "/dashboard/contact-info", element: <ContactInfoAdmin /> },
      { path: "/dashboard/contacts", element: <ContactsAdmin /> },
    ],
  },
]);

export default router;
