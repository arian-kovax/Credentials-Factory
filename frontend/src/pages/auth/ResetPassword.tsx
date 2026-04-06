import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import PasswordInput from "../../components/PasswordInput";
import { confirmPasswordReset } from "../../services/auth";

const RESET_FLOW_STORAGE_KEY = "password_reset_flow";

type ResetPasswordState = {
  username: string;
  email: string;
  code: string;
};

function getStoredResetFlow() {
  const stored = sessionStorage.getItem(RESET_FLOW_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as ResetPasswordState;
  } catch {
    return null;
  }
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFlow = useMemo<ResetPasswordState | null>(() => {
    const state = location.state as ResetPasswordState | null;
    return state ?? getStoredResetFlow();
  }, [location.state]);

  useEffect(() => {
    if (!resetFlow?.username || !resetFlow?.email || !resetFlow?.code) {
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate, resetFlow]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!resetFlow) {
      navigate("/forgot-password", { replace: true });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await confirmPasswordReset({
        ...resetFlow,
        newPassword,
        confirmPassword,
      });
      sessionStorage.removeItem(RESET_FLOW_STORAGE_KEY);
      navigate("/login", {
        replace: true,
        state: {
          message: "Password updated successfully. Please log in.",
        },
      });
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Something went wrong while updating your password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-title font-semibold text-textPrimary text-center">
        Change Password
      </h1>

      <p className="mt-2 text-sm text-textMuted text-center">
        Create your new password and confirm it to finish resetting your
        account.
      </p>

      <form className="mt-8" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <PasswordInput
            label="Enter new password"
            placeholder="Enter your new password"
            value={newPassword}
            autoComplete="new-password"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <PasswordInput
            label="Confirm new password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
          <span
            className="cursor-pointer text-sm font-semibold text-link"
            onClick={() => navigate("/forgot-password/verify")}
          >
            Back
          </span>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>

      <Divider />

      <p className="text-xs text-textMuted text-center">
        Once submitted, you&apos;ll be redirected to the login page.
      </p>
    </AuthLayout>
  );
}
