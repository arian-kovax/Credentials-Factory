interface InputProps {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  autoComplete?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  autoComplete,
  onChange,
}: InputProps) {
  return (
    <div>
      <label className="block text-xs text-textMuted mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        className="
          w-full
          h-12
          px-4
          rounded-field
          bg-inputBg
          text-sm
          text-textPrimary
          placeholder-textMuted
          focus:outline-none
          focus:ring-2
          focus:ring-panel
        "
      />
    </div>
  );
}
