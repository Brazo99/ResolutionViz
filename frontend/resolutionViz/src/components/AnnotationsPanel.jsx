import TextEditor from "./TextEditor";
import { ClipboardPaste, ChevronDown, List } from "lucide-react";

export default function AnnotationsPanel({
  value, 
  onChange,
  savedKBs = [],
  onUseKB,
  disabled = false,
}) {
  return (
    <section
      className="
        flex
        h-full
        min-h-0
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-slate-800
        bg-slate-950
      "
    >
      {/* Header */}
      <div
        className="
          shrink-0
          border-b
          border-slate-800
          px-4
          py-3
        "
      >
        {/* Flex to push dropdown to the right */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">
            Annotations
          </h2>

          {/* Single dropdown button */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={disabled ? -1 : 0}
              role="button"
              className={`btn btn-ghost btn-xs text-slate-400 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:text-slate-200"}`}
              title="Paste content from existing KB"
            >
              <ClipboardPaste size={16} />
              <ChevronDown size={12} />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu z-[1] w-56 p-2 shadow border border-slate-700 bg-slate-800 text-slate-200 max-h-40 overflow-y-auto"
            >
              {savedKBs.length === 0 ? (
                <li>
                  <button className="text-slate-500 pointer-events-none" disabled>
                    No saved KBs
                  </button>
                </li>
              ) : (
                savedKBs.map((kb) => (
                  <li key={kb.id}>
                    <button onClick={() => onUseKB(kb)} disabled={disabled}>
                      <List size={14} />
                      {kb.name}
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