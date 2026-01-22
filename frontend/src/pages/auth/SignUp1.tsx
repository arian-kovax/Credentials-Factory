import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import ProgressStepper from "../../components/ProgressStepper";

export default function SignUp1() {
  const navigate = useNavigate();

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
        <Input label="Username" placeholder="Enter your username" />
        <Input label="Email" type="email" placeholder="Enter your email" />
        <Input label="Mobile phone" placeholder="Enter your mobile phone" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <span
          className="text-link font-semibold cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Cancel
        </span>

        <Button onClick={() => navigate("/signup/step-2")}>
          Next
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
