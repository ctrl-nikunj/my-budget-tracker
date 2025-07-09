import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Forgot from "./pages/ForgotPassword";
import Reset from "./pages/ResetPassword";
import { LoaderIcon } from "lucide-react";

// Lazy imports for dashboard features
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Reminders = lazy(() => import("./pages/Reminders"));
const FDs = lazy(() => import("./pages/FDs"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Profile = lazy(() => import("./pages/Profile"));

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <Forgot /> },
  { path: "/reset-password/:token", element: <Reset /> },
  {
    path: "/dashboard",
    element: (
      <Suspense
        fallback={
          <div className="grid h-screen place-items-center ">
            <LoaderIcon className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "/transactions",
    element: (
      <Suspense
        fallback={
          <div className="grid h-screen place-items-center ">
            <LoaderIcon className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <Transactions />
      </Suspense>
    ),
  },
  {
    path: "/reminders",
    element: (
      <Suspense fallback={<div className="p-4">Loading Reminders...</div>}>
        <Reminders />
      </Suspense>
    ),
  },
  {
    path: "/fds",
    element: (
      <Suspense fallback={<div className="p-4">Loading FDs...</div>}>
        <FDs />
      </Suspense>
    ),
  },
  {
    path: "/analytics",
    element: (
      <Suspense fallback={<div className="p-4">Loading Analytics...</div>}>
        <Analytics />
      </Suspense>
    ),
  },
  {
    path: "/profile",
    element: (
      <Suspense fallback={<div className="p-4">Loading Profile...</div>}>
        <Profile />
      </Suspense>
    ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
