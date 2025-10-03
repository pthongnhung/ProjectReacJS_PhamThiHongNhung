import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
