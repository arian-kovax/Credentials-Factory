import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import ProgressStepper from "../../components/ProgressStepper";
import SelectInput from "../../components/SelectInput";
import { departments } from "../../data/departments";

export default function SignUp2() {
  const navigate = useNavigate();

  // IMPORTANT: must start as empty string
  const [department, setDepartment] = useState<string>("");
  const [accessLevel, setAccessLevel] = useState<string>("");

  const handleNext = () => {
    // basic guard (optional but recommended)
    if (!department || !accessLevel) return;

    navigate("/signup/step-3");
  };

  return (
    <AuthLayout>
      {/* Progress */}
      <ProgressStepper currentStep={2} />

      {/* Title */}
      <h1 className="text-title font-semibold text-textPrimary text-center mt-20">
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

      {/* Dropdown inputs */}
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
          options={[
            "Student",
            "Faculty",
            "Admin",
          ]}
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="mt-12 flex items-center justify-between">
        <span
          className="flex items-center gap-2 text-link font-semibold cursor-pointer"
          onClick={() => navigate("/signup/step-1")}
        >
          ← Back
        </span>

        <Button onClick={handleNext}>
          Next
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
