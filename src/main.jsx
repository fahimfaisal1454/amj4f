import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Routes/Routes.jsx";
import "./index.css";

// ✨ add these two lines
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({ duration: 600, easing: "ease-out", once: true, offset: 80 });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
