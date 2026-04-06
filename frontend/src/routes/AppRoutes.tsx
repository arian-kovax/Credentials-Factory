import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ForgotPasswordRequest from "../pages/auth/ForgotPasswordRequest";
import ForgotPasswordVerify from "../pages/auth/ForgotPasswordVerify";
import ResetPassword from "../pages/auth/ResetPassword";
import SignUp1 from "../pages/auth/SignUp1";
import SignUp2 from "../pages/auth/SignUp2";
import SignUp3 from "../pages/auth/SignUp3";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordRequest />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password/verify"
        element={
          <PublicRoute>
            <ForgotPasswordVerify />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password/reset"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Signup flow */}
      <Route path="/signup">
        <Route index element={<Navigate to="step-1" replace />} />
        <Route
          path="step-1"
          element={
            <PublicRoute>
              <SignUp1 />
            </PublicRoute>
          }
        />
        <Route
          path="step-2"
          element={
            <PublicRoute>
              <SignUp2 />
            </PublicRoute>
          }
        />
        <Route
          path="step-3"
          element={
            <PublicRoute>
              <SignUp3 />
            </PublicRoute>
          }
        />
      </Route>

      {/* App */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
