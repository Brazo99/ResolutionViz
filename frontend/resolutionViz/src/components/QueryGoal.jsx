export default function QueryGoal({
  value,
  onChange,
  onProve,
  disabled = false,
}) {
  return (
    <section className="shrink-0">

      <h2 className="mb-2 text-sm font-semibold text-base-content">
        Query Goal
      </h2>

      <div className="flex overflow-hidden rounded-xl border border-base-300 bg-base-100">

        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter Goal e,g A"
          className={`
            min-w-0
            flex-1
            bg-transparent
            px-4
            py-3
            font-mono
            text-sm
            text-base-content
            outline-none
            placeholder:text-base-content/30
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />

      </div>

    </section>
  );
}