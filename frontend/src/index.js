// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Menu from "./components/Menu";
import Register from "./pages/Register";
import Calendar from "./components/Calendar";
import Login from "./pages/Login";
import Data from "./pages/Data";
import Logout from "./pages/Logout";
import History from "./pages/History";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import { BalanceProvider } from "./context/BalanceContext"; // Importă BalanceProvider
import { ProjectsProvider } from "./context/ProjectsContext"; // Importă ProjectsProvider

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />,
    children: [
      {
        path: "/",
        element: <Calendar />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/data",
        element: <Data />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BalanceProvider>
      {" "}
      {/* Învelește aplicația în BalanceProvider */}
      <ProjectsProvider>
        {" "}
        {/* Învelește aplicația în ProjectsProvider */}
        <RouterProvider router={router} />
      </ProjectsProvider>
    </BalanceProvider>
  </React.StrictMode>
);

reportWebVitals();
