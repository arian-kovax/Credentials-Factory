import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import ProgressStepper from "../../components/ProgressStepper";
import SelectInput from "../../components/SelectInput";
import { useSignup } from "../../context/SignupContext";
import { departments } from "../../data/departments";

export default function SignUp2() {
  const navigate = useNavigate();
  const { signupData, updateSignupData, clearSignupData } = useSignup();

  const [department, setDepartment] = useState<string>(signupData.department);
  const [accessLevel, setAccessLevel] = useState<string>(signupData.accessLevel);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!signupData.username || !signupData.email || !signupData.phone) {
      navigate("/signup/step-1", { replace: true });
    }
  }, [navigate, signupData.email, signupData.phone, signupData.username]);

  const handleNext = () => {
    if (!department || !accessLevel) {
      setError("Department and access level are required.");
      return;
    }

    updateSignupData({ department, accessLevel });
    setError("");
    navigate("/signup/step-3");
  };

  return (
    <AuthLayout>
      <ProgressStepper currentStep={2} />

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

      <div className="mt-10 space-y-8">
        <SelectInput
          label="Department"
          placeholder="Select your department"
          options={departments}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <SelectInput
          label="Access level requested"
          placeholder="Select your access level requested"
          options={["Student", "Faculty", "Admin"]}
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value)}
        />
      </div>

      {error ? (
        <p className="mt-4 text-center text-sm text-red-500">{error}</p>
      ) : null}

      <div className="mt-12 flex items-center justify-between">
        <span
          className="flex items-center gap-2 text-link font-semibold cursor-pointer"
          onClick={() => navigate("/signup/step-1")}
        >
          Back
        </span>

        <Button onClick={handleNext}>Next</Button>
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
