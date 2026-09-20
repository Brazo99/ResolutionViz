import {AlertCircle} from "lucide-react";

export default function QueryGoal({
  value,
  onChange,
  disabled = false,
}) {
  const trimmedValue = value.trim();
  const hasTooManyCharacters = trimmedValue.length > 1;
  return (
    <section className="shrink-0">

      <h2 className="mb-2 text-sm font-semibold text-base-content">
        Query Goal
      </h2>

      <div
        className={`flex overflow-hidden rounded-xl border bg-base-100 ${
          hasTooManyCharacters
            ? "border-error"
            : "border-base-300"
        }`}
      >
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter Goal e,g A"
          aria-invalid={hasTooManyCharacters}
          aria-describedby={
            hasTooManyCharacters ? "query-goal-error" : undefined
          }
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
            border
            border-base-300
            bg-base-100
            placeholder:text-base-content/40
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />

      </div>
      {hasTooManyCharacters && (
        <p
          id="query-goal-error"
          className="mt-2 flex items-center gap-1 text-sm text-error"
          role="alert"
        >
          <AlertCircle size={16} />
          The query goal must contain exactly one character.
        </p>
      )}

    </section>
  );
}