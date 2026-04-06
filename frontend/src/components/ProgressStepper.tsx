interface ProgressStepperProps {
  currentStep?: number;
}

export default function ProgressStepper({
  currentStep = 1,
}: ProgressStepperProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Step number={1} active={currentStep >= 1} />
      <Line active={currentStep >= 2} />
      <Step number={2} active={currentStep >= 2} />
      <Line active={currentStep >= 3} />
      <Step number={3} active={currentStep >= 3} />
    </div>
  );
}

/* ---------- Step ---------- */

interface StepProps {
  number: number;
  active: boolean;
}

function Step({ number, active }: StepProps) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        backgroundColor: active ? "#544fb3" : "#CBD5E1",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {number}
    </div>
  );
}

/* ---------- Line ---------- */

interface LineProps {
  active: boolean;
}

function Line({ active }: LineProps) {
  return (
    <div
      style={{
        width: 120,
        height: 3,
        backgroundColor: active ? "#4F46E5" : "#CBD5E1",
      }}
    />
  );
}
