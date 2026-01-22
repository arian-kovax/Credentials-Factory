import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import ProgressStepper from "../../components/ProgressStepper";
import PasswordInput from "../../components/PasswordInput";

export default function SignUp3() {
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleCreateAccount = () => {
    // later: validation + API call
    // e.g. if (password !== confirmPassword) return;
    navigate("/login");
  };

  return (
    <AuthLayout>
      {/* Progress */}
      <ProgressStepper currentStep={3} />

      {/* Title */}
      <h1 className="text-title font-semibold text-textPrimary text-center mt-6">
        Create Account
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-sm text-textMuted text-center">
        Already have an account?{" "}
        <span
          className="text-link cursor-pointer font-semibold"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>

      {/* Password inputs */}
      <div className="mt-10 space-y-8">
        <PasswordInput
          label="Create password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          label="Repeat password"
          placeholder="Enter your password again"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="mt-12 flex items-center justify-between">
        <span
          className="flex items-center gap-2 text-link font-semibold cursor-pointer"
          onClick={() => navigate("/signup/step-2")}
        >
          ← Back
        </span>

        <Button onClick={handleCreateAccount}>
          Create
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
