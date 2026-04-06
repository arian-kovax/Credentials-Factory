import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import ProgressStepper from "../../components/ProgressStepper";
import { useSignup } from "../../context/SignupContext";
import { validateSignupIdentity } from "../../services/auth";

export default function SignUp1() {
  const navigate = useNavigate();
  const { signupData, updateSignupData, clearSignupData } = useSignup();

  const [username, setUsername] = useState<string>(signupData.username);
  const [email, setEmail] = useState<string>(signupData.email);
  const [phone, setPhone] = useState<string>(signupData.phone);
  const [error, setError] = useState<string>("");
  const [isCheckingIdentity, setIsCheckingIdentity] = useState<boolean>(false);

  const handleNext = async () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedPhone) {
      setError("Username, email, and phone are required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setIsCheckingIdentity(true);

    try {
      await validateSignupIdentity({
        username: trimmedUsername,
        email: trimmedEmail,
      });
      updateSignupData({
        username: trimmedUsername,
        email: trimmedEmail,
        phone: trimmedPhone,
      });
      navigate("/signup/step-2");
    } catch (validationError) {
      setError(
        validationError instanceof Error
          ? validationError.message
          : "Unable to verify those signup details right now.",
      );
    } finally {
      setIsCheckingIdentity(false);
    }
  };

  return (
    <AuthLayout>
      <ProgressStepper currentStep={1} />

      <h1 className="text-title font-semibold text-textPrimary text-center mt-20">
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

      <div className="mt-8 space-y-6">
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

        <Input
          label="Mobile phone"
          placeholder="Enter your mobile phone"
          value={phone}
          autoComplete="tel"
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {error ? (
        <p className="mt-4 text-center text-sm text-red-500">{error}</p>
      ) : null}

      <div className="mt-10 flex items-center justify-between">
        <span
          className="text-link font-semibold cursor-pointer"
          onClick={() => {
            clearSignupData();
            navigate("/login");
          }}
        >
          Cancel
        </span>

        <Button onClick={handleNext} disabled={isCheckingIdentity}>
          {isCheckingIdentity ? "Checking..." : "Next"}
        </Button>
      </div>

      <Divider />

      <p className="text-xs text-textMuted text-center">
        Have some problems? Please{" "}
        <span className="text-link cursor-pointer">
          contact support
        </span>.
      </p>
    </AuthLayout>
  );
}
