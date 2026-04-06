import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import PasswordInput from "../../components/PasswordInput";
import ProgressStepper from "../../components/ProgressStepper";
import { useAuth } from "../../context/AuthContext";
import { useSignup } from "../../context/SignupContext";
import { signupUser } from "../../services/auth";

export default function SignUp3() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { signupData, updateSignupData, clearSignupData } = useSignup();

  const [password, setPassword] = useState<string>(signupData.password);
  const [confirmPassword, setConfirmPassword] = useState<string>(
    signupData.confirmPassword,
  );
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!signupData.department || !signupData.accessLevel) {
      navigate("/signup/step-2", { replace: true });
    }
  }, [navigate, signupData.accessLevel, signupData.department]);

  const handleCreateAccount = async () => {
    if (!password || !confirmPassword) {
      setError("Password and confirmation are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    updateSignupData({ password, confirmPassword });

    try {
      const response = await signupUser({
        ...signupData,
        password,
        confirmPassword,
      });

      clearSignupData();
      await login(
        {
          access: response.access,
          refresh: response.refresh,
        },
        response.user,
      );
      navigate("/dashboard", { replace: true });
    } catch (signupError) {
      setError(
        signupError instanceof Error
          ? signupError.message
          : "Something went wrong while creating your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <ProgressStepper currentStep={3} />

      <h1 className="text-title font-semibold text-textPrimary text-center mt-6">
        Create Account
      </h1>

      <p className="mt-2 text-sm text-textMuted text-center">
        Already have an account?{" "}
        <span
          className="text-link cursor-pointer font-semibold"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>

      <div className="mt-10 space-y-8">
        <PasswordInput
          label="Create password"
          placeholder="Enter your password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          label="Repeat password"
          placeholder="Enter your password again"
          value={confirmPassword}
          autoComplete="new-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error ? (
        <p className="mt-4 text-center text-sm text-red-500">{error}</p>
      ) : null}

      <div className="mt-12 flex items-center justify-between">
        <span
          className="flex items-center gap-2 text-link font-semibold cursor-pointer"
          onClick={() => navigate("/signup/step-2")}
        >
          Back
        </span>

        <Button onClick={handleCreateAccount} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>

      <Divider />

      <p className="text-xs text-textMuted text-center">
        Have some problems? Please{" "}
        <span className="text-link cursor-pointer">contact support</span>.
      </p>

      <p
        className="mt-4 text-center text-xs text-link cursor-pointer"
        onClick={() => {
          clearSignupData();
          navigate("/login");
        }}
      >
        Cancel signup
      </p>
    </AuthLayout>
  );
}
