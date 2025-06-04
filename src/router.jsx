import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reminders from "./pages/Reminders";
import FDs from "./pages/FDs";
import Analytics from "./pages/Analytics";
import Forgot from "./pages/ForgotPassword";
import Reset from "./pages/ResetPassword";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/transactions", element: <Transactions /> },
  { path: "/reminders", element: <Reminders /> },
  { path: "/fds", element: <FDs /> },
  { path: "/analytics", element: <Analytics /> },
  { path: "/forgot-password", element: <Forgot /> },
  { path: "/reset-password/:token", element: <Reset /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
