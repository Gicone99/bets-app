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
import LiveMatches from "./pages/LiveMatches";
import Sports from "./pages/Sports";

import { BalanceProvider } from "./context/BalanceContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { UserProvider } from "./context/UserContext";
import { SportsProvider } from "./context/SportsContext";

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
        path: "/sports",
        element: <Sports />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/livematches",
        element: <LiveMatches />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BalanceProvider>
        <ProjectsProvider>
          <SportsProvider>
            <RouterProvider router={router} />
          </SportsProvider>
        </ProjectsProvider>
      </BalanceProvider>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
