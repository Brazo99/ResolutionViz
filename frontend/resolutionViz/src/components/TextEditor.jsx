import { useRef, useEffect } from "react";

export default function TextEditor({value, onChange, placeholder, errorLine = null, onErrorPositionChange=null, disabled = false,}) {
  const lines = value.split("\n");
  const textareaRef = useRef(null);
  const editorRef = useRef(null);
  const lineRefs = useRef({});

  // Auto-grow textarea to match the content height
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;

    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [value]);

  // Calculate the position of the error line
  const updateErrorPosition = () => {
    if (
      !errorLine ||
      !editorRef.current ||
      !lineRefs.current[errorLine]
    ) {
      onErrorPositionChange?.(null);
      return;
    }

    const editor = editorRef.current;
    const line = lineRefs.current[errorLine];

    const editorRect = editor.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();

    const lineTop = lineRect.top - editorRect.top;

    onErrorPositionChange?.({
      top: lineTop,
      lineHeight: lineRect.height,
      editorHeight: editor.clientHeight,
    });
  };

  // Update when error line or content changes
  useEffect(() => {
    updateErrorPosition();
  }, [errorLine, value]);

  // Update while editor scrolls
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleScroll = () => {
      updateErrorPosition();
    };

    editor.addEventListener("scroll", handleScroll);

    return () => {
      editor.removeEventListener("scroll", handleScroll);
    };
  }, [errorLine]);

  return (
    <div
      ref={editorRef}
      className="h-full min-h-0 flex-1 overflow-y-auto bg-base-300"
    >
      <div className="flex min-h-full">

        {/* Line numbers */}
        <div
          className="
            shrink-0
            select-none
            px-3
            py-4
            text-right
            font-mono
            text-sm
            leading-6
            text-base-content/40
          "
        >
          {lines.map((_, index) => {
            const lineNumber = index + 1;
            const isError = errorLine === lineNumber;

            return (
              <div
                key={index}
                ref={(element) => {
                  if (element) {
                    lineRefs.current[lineNumber] = element;
                  }
                }}
                className={
                  isError
                    ? "font-bold text-error"
                    : "text-base-content/40"
                }
              >
                {lineNumber}
              </div>
            );
          })}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          rows={1}
          className={`
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
            outline-none
            placeholder:text-base-content/30
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${errorLine ? "text-error" : "text-base-content/70"}
          `}
        />
      </div>
    </div>
  );
}