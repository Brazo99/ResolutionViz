export default function QueryGoal({
  value,
  onChange,
  onProve,
  disabled = false,
}) {
  return (
    <section className="shrink-0">

      <h2 className="mb-2 text-sm font-semibold text-slate-200">
        Query Goal
      </h2>

      <div className="flex overflow-hidden rounded-xl border border-slate-800 bg-slate-950">

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
            text-slate-300
            outline-none
            placeholder:text-slate-700
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />

      </div>

    </section>
  );
}