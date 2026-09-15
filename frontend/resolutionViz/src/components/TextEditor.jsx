import { useRef, useEffect } from "react";

export default function TextEditor({
  value,
  onChange,
  placeholder,
}) {
  const lines = value.split("\n");
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [value]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-slate-950">
      <div className="flex min-h-full">

        {/* Line numbers */}
        <div className="
          shrink-0
          select-none
          px-3
          py-4
          text-right
          font-mono
          text-sm
          leading-6
          text-slate-600
        ">
          {lines.map((_, index) => (
            <div key={index}>
              {index + 1}
            </div>
          ))}
        </div>

        {/* Textarea: auto-growing*/}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          rows={1}
          className="
            min-w-0
            flex-1
            resize-none
            overflow-hidden
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
    </div>
  );
}