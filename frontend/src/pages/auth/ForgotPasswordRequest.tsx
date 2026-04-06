import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import Input from "../../components/Input";
import { requestPasswordReset } from "../../services/auth";

const RESET_FLOW_STORAGE_KEY = "password_reset_flow";

export default function ForgotPasswordRequest() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !email.trim()) {
      setError("Username and email are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
      };
      const response = await requestPasswordReset(payload);
      sessionStorage.setItem(RESET_FLOW_STORAGE_KEY, JSON.stringify(payload));
      setMessage(response.detail);
      navigate("/forgot-password/verify", {
        state: payload,
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while sending your code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-title font-semibold text-textPrimary text-center">
        Forgot Password
      </h1>

      <p className="mt-2 text-sm text-textMuted text-center">
        Enter your username and email to receive a 6-digit reset code.
      </p>

      <form className="mt-8" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {message ? (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        ) : null}

        {error ? (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
          <span
            className="cursor-pointer text-sm font-semibold text-link"
            onClick={() => navigate("/login")}
          >
            Back to login
          </span>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send code"}
          </Button>
        </div>
      </form>

      <Divider />

      <p className="text-xs text-textMuted text-center">
        The code will be printed in the Django console while using the current
        dev email backend.
      </p>
    </AuthLayout>
  );
}
