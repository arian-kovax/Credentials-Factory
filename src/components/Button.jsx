export default function Button({ children }) {
  return (
    <button
      className="
        w-40
        py-2.5
        rounded-field
        bg-panel
        text-white
        text-sm
        font-medium
        hover:opacity-90
        transition
      "
    >
      {children}
    </button>
  );
}
