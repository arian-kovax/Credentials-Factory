import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Divider from "../../components/Divider";

export default function Login() {
  const navigate = useNavigate();

  return (
    <AuthLayout>

      {/* Title */}
      <h1 className="text-title font-semibold text-textPrimary text-center">
        Login
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-sm text-textMuted text-center">
        Don’t have account?{" "}
        <span
          className="text-link cursor-pointer"
          onClick={() => navigate("/signup/step-1")}
        >
          Create
        </span>
      </p>

      {/* Inputs */}
      <div className="mt-8 space-y-6">
        <Input
          label="Username"
          placeholder="Enter your username"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      {/* Lost password */}
      <p className="mt-4 text-sm text-link cursor-pointer">
        Lost password?
      </p>

      {/* Button */}
      <div className="mt-8 flex justify-center">
        <Button onClick={() => navigate("/dashboard")}>
          Login
        </Button>
      </div>

      {/* Divider */}
      <Divider />

      {/* Footer */}
      <p className="text-xs text-textMuted text-center">
        Have some problems? Please{" "}
        <span className="text-link cursor-pointer">
          contact support
        </span>.
      </p>

    </AuthLayout>
  );
}
