import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import ProgressStepper from "../../components/ProgressStepper";

export default function SignUp() {
  return (
    <AuthLayout>

      {/* Progress bar */}
      <ProgressStepper currentStep={1} />

      {/* Title */}
      <h1 className="text-title font-semibold text-textPrimary text-center mt-6">
        Create Account
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-sm text-textMuted text-center">
        Already have an account?{" "}
        <span className="text-link cursor-pointer font-semibold">
          Login
        </span>
      </p>

      {/* Inputs */}
      <div className="mt-8 space-y-6">
        <Input
          label="Username"
          placeholder="Enter your username"
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        <Input
          label="Mobile phone"
          placeholder="Enter your mobile phone"
        />
      </div>

      {/* Actions */}
      <div className="mt-10 flex items-center justify-between">
        <span className="text-link font-semibold cursor-pointer">
          Cancel
        </span>

        <Button>Next</Button>
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
