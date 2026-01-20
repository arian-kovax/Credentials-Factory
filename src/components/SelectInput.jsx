export default function SelectInput({ label, options, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      
      {/* Label */}
      <label className="text-sm font-medium text-textMuted">
        {label}
      </label>

      {/* Select box */}
      <select
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
        defaultValue=""
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}
