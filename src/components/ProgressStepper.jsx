export default function ProgressStepper({ currentStep = 1 }) {
  return (
    <div className="flex items-center justify-center mt-6">

      {/* Step 1 */}
      <Step number={1} active={currentStep >= 1} />

      {/* Line 1 */}
      <Line active={currentStep >= 2} />

      {/* Step 2 */}
      <Step number={2} active={currentStep >= 2} />

      {/* Line 2 */}
      <Line active={currentStep >= 3} />

      {/* Step 3 */}
      <Step number={3} active={currentStep >= 3} />

    </div>
  );
}

/* =========================
   Step Circle Component
   ========================= */
function Step({ number, active }) {
  return (
    <div
      className={`
        w-[22px] h-[22px]
        rounded-full
        flex items-center justify-center
        text-xs font-semibold
        transition-colors duration-200
        ${active ? "bg-stepActive text-white" : "bg-stepInactive text-white"}
      `}
    >
      {number}
    </div>
  );
}

/* =========================
   Connecting Line Component
   ========================= */
function Line({ active }) {
  return (
    <div
      className={`
        w-[120px] h-[3px]
        transition-colors duration-200
        ${active ? "bg-stepActive" : "bg-stepInactive"}
      `}
    />
  );
}
