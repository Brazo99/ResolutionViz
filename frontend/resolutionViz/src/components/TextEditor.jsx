export default function TextEditor({
  value,
  onChange,
  placeholder,
}) {
  const lines = value.split("\n");

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-slate-950">

      {/* Line numbers */}
      <div
        className="
          shrink-0
          select-none
          overflow-hidden
          px-3
          py-4
          text-right
          font-mono
          text-sm
          leading-6
          text-slate-600
        "
      >
        {lines.map((_, index) => (
          <div key={index}>
            {index + 1}
          </div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="
          min-h-0
          min-w-0
          flex-1
          resize-none
          overflow-y-auto
          border-0
          bg-transparent
          px-3
          py-4
          font-mono
          text-sm
          leading-6
          text-slate-400
          outline-none
          placeholder:text-slate-700
        "
      />

    </div>
  );
}