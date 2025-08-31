import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import Dashboard from "../Layout/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import About from "../Pages/About";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },

      {
        path: "/about",
        element: <About></About>,
      },

 


    ],
  },
  {
    path: "/dashboard",

    element: (
      <ProtectedRoute>
        <Dashboard></Dashboard>
      </ProtectedRoute>
    ),
    children: [
     

    ],
  },
]);
