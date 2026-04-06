import { useState } from "react";

interface PasswordInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  autoComplete?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function PasswordInput({
  label,
  placeholder,
  value,
  autoComplete,
  onChange,
}: PasswordInputProps) {
  const [show, setShow] = useState<boolean>(false);

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
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
          className="
            w-full h-[44px]
            rounded-md
            bg-inputBg
            px-4 pr-10
            text-sm
            outline-none
          "
        />

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted"
        >
          <span className="text-xs">
            {show ? "hide" : "show"}
          </span>
        </button>
      </div>
    </div>
  );
}
