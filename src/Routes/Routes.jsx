// src/Routes/Routes.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Main from "../Layout/Main.jsx";
import ErrorPage from "../Pages/ErrorPage/ErrorPage.jsx";

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
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/admin", element: <AdminHome /> },
      { path: "/admin/banners", element: <BannersAdmin /> },
      { path: "/admin/news", element: <NewsAdmin /> },
      { path: "/admin/programs", element: <ProgramsAdmin /> },
      { path: "/admin/stories", element: <StoriesAdmin /> },
      { path: "/admin/about", element: <AboutAdmin /> },
      { path: "/admin/contact-info", element: <ContactInfoAdmin /> },
      { path: "/admin/contacts", element: <ContactsAdmin /> },
    ],
  },
]);

export default router;
