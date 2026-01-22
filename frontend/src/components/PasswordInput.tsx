import { useState } from "react";

export default function PasswordInput({ label, placeholder }) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="text-sm font-medium text-textMuted">
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="
            w-full h-[44px]
            rounded-md
            bg-inputBg
            px-4 pr-10
            text-sm
            outline-none
          "
        />

        {/* Toggle icon */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted"
        >
          <span>show</span>
        </button>
      </div>
    </div>
  );
}
