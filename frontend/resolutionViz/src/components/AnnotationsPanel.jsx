import TextEditor from "./TextEditor";
import { ClipboardPaste, ChevronDown, List } from "lucide-react";
import { useRef } from "react";

export default function AnnotationsPanel({
  value,
  onChange,
  savedKBs = [],
  onUseKB,
  disabled = false,
}) {
  const dropdownRef = useRef(null);
  const handleUseKB = (kb) => {
    onUseKB?.(kb);
    if (document.activeElement?.blur) document.activeElement.blur();
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-base-content">
            Annotations
          </h2>

          {/* Single dropdown button */}
          <div className="dropdown dropdown-end" ref={dropdownRef}>
            <div
              tabIndex={disabled || savedKBs.length === 0 ? -1 : 0}
              role="button"
              aria-haspopup="listbox"
              aria-label="Use content from a saved KB"
              className={`btn btn-ghost btn-xs text-base-content/60 ${
                disabled || savedKBs.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-base-content"
              }`}
              title="Paste content from existing KB"
            >
              <ClipboardPaste size={16} />
              <ChevronDown size={12} />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu z-[1] max-h-40 w-56 overflow-y-auto border border-base-300 bg-base-100 p-2 text-base-content shadow"
            >
              {savedKBs.length === 0 ? (
                <li>
                  <button
                    className="text-base-content/50 pointer-events-none"
                    disabled
                  >
                    No saved KBs
                  </button>
                </li>
              ) : (
                savedKBs.map((kb) => (
                  <li key={kb.id}>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleUseKB(kb)}
                      disabled={disabled}
                      title={kb.name}
                    >
                      <List size={14} className="shrink-0" />
                      <span className="min-w-0 truncate">{kb.name}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Editor */}
      <TextEditor
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="Enter annotations..."
      />
    </section>
  );
}