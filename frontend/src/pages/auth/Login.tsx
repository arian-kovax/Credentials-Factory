import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const successMessage =
    typeof location.state?.message === "string" ? location.state.message : "";

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const tokens = await loginUser({
        username: username.trim(),
        password,
      });

      await login(tokens);
      navigate("/dashboard");
    } catch (loginError) {
      const message =
        loginError instanceof Error
          ? loginError.message
          : "Something went wrong while logging in.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-title font-semibold text-textPrimary text-center">
        Login
      </h1>

      <p className="mt-2 text-sm text-textMuted text-center">
        Don&apos;t have account?{" "}
        <span
          className="text-link cursor-pointer"
          onClick={() => navigate("/signup/step-1")}
        >
          Create
        </span>
      </p>

      <form className="mt-8" onSubmit={handleLogin}>
        <div className="space-y-6">
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {successMessage ? (
          <p className="mt-4 text-center text-sm text-green-600">
            {successMessage}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        ) : null}

        <p
          className="mt-4 cursor-pointer text-sm text-link"
          onClick={() => navigate("/forgot-password")}
        >
          Lost password?
        </p>

        <div className="mt-8 flex justify-center">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>

      <Divider />

      <p className="text-xs text-textMuted text-center">
        Have some problems? Please{" "}
        <span className="text-link cursor-pointer">contact support</span>.
      </p>
    </AuthLayout>
  );
}
