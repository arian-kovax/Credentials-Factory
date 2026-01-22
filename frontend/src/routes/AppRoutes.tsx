import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import SignUp1 from "../pages/auth/SignUp1";
import SignUp2 from "../pages/auth/SignUp2";
import SignUp3 from "../pages/auth/SignUp3";
import Dashboard from "../pages/Dashboard/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Signup flow */}
      <Route path="/signup">
        <Route index element={<Navigate to="step-1" replace />} />
        <Route path="step-1" element={<SignUp1 />} />
        <Route path="step-2" element={<SignUp2 />} />
        <Route path="step-3" element={<SignUp3 />} />
      </Route>

      {/* App */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}
