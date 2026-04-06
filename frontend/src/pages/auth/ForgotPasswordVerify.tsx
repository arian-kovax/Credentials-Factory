import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import Input from "../../components/Input";
import {
  requestPasswordReset,
  verifyPasswordResetCode,
} from "../../services/auth";

const RESET_FLOW_STORAGE_KEY = "password_reset_flow";

type ResetFlowState = {
  username: string;
  email: string;
};

function getStoredResetFlow() {
  const stored = sessionStorage.getItem(RESET_FLOW_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as ResetFlowState;
  } catch {
    return null;
  }
}

export default function ForgotPasswordVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const resetFlow = useMemo<ResetFlowState | null>(() => {
    const state = location.state as ResetFlowState | null;
    return state ?? getStoredResetFlow();
  }, [location.state]);

  useEffect(() => {
    if (!resetFlow?.username || !resetFlow?.email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate, resetFlow]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code.trim()) {
      setError("Enter the 6-digit code.");
      return;
    }

    if (!resetFlow) {
      navigate("/forgot-password", { replace: true });
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...resetFlow,
        code: code.trim(),
      };
      await verifyPasswordResetCode(payload);
      sessionStorage.setItem(
        RESET_FLOW_STORAGE_KEY,
        JSON.stringify({ ...resetFlow, code: code.trim() }),
      );
      navigate("/forgot-password/reset", {
        state: { ...resetFlow, code: code.trim() },
      });
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Something went wrong while verifying your code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!resetFlow) {
      return;
    }

    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const response = await requestPasswordReset(resetFlow);
      setMessage(response.detail);
    } catch (resendError) {
      setError(
        resendError instanceof Error
          ? resendError.message
          : "Unable to resend the code right now.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-title font-semibold text-textPrimary text-center">
        Verify Code
      </h1>

      <p className="mt-2 text-sm text-textMuted text-center">
        Enter the 6-digit code sent to {resetFlow?.email ?? "your email"}.
      </p>

      <form className="mt-8" onSubmit={handleSubmit}>
        <Input
          label="6-digit code"
          placeholder="Enter your code"
          value={code}
          autoComplete="one-time-code"
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />

        {message ? (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        ) : null}

        {error ? (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
          <span
            className="cursor-pointer text-sm font-semibold text-link"
            onClick={() => navigate("/forgot-password")}
          >
            Start again
          </span>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </form>

      <Divider />

      <p
        className="cursor-pointer text-center text-sm text-link"
        onClick={() => {
          if (!isResending) {
            void handleResend();
          }
        }}
      >
        {isResending ? "Sending a new code..." : "Resend code"}
      </p>
    </AuthLayout>
  );
}
