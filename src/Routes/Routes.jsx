import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main.jsx";
import ErrorPage from "../Pages/ErrorPage/ErrorPage.jsx";

// Single route: "/" renders the entire one-page site.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />
  },
]);

export default router;
