interface SelectInputProps {
  label: string;
  options: string[];
  placeholder: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export default function SelectInput({
  label,
  options,
  placeholder,
  value = "",
  onChange,
}: SelectInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-textMuted">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="
          w-full
          h-[48px]
          px-4
          rounded-md
          bg-inputBg
          text-sm
          text-textPrimary
          outline-none
          appearance-none
          cursor-pointer
        "
      >
        {/* Placeholder option */}
        <option value="" disabled hidden>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
