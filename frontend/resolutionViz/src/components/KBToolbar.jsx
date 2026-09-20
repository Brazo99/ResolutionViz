import { Download, Upload, Plus, ChevronDown, List, Trash2, Eraser, Save } from "lucide-react";
import { useRef } from "react";

export default function KBToolbar({
  onImport,
  onExport,
  onClear,
  onSave,
  isDirty = false,
  hasContent = false,
  disabled = false,
  currentKBName = "New KB",
  savedKBs = [],
  currentKBID = null,
  onCreateNewKB,
  onLoadKB,
  onDeleteKB,
  onRenameKB,
  onSaveKBName,
}) {
  const dropdownRef = useRef(null);

  const closeDropdown = () => {
    if (document.activeElement?.blur) document.activeElement.blur();
  };

  const handleImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt,.kb";
    fileInput.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const lines = content
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        onImport?.(lines);
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  const handleLoadKB = (kb) => {
    onLoadKB?.(kb);
    closeDropdown();
  };

  const handleCreateNew = () => {
    onCreateNewKB?.();
    closeDropdown();
  };

  const handleDeleteKB = (e, kb) => {
    e.stopPropagation();
    e.preventDefault();
    onDeleteKB?.(kb);
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 flex-wrap">
      <div className="dropdown dropdown-start" ref={dropdownRef}>
        {/* Editable Button Label */}
        <div
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-haspopup="listbox"
          aria-label="Knowledge base selector"
          className={`btn btn-sm border-base-300 bg-base-100 text-base-content max-w-[240px] p-0 ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-base-200"
          }`}
        >
          <Plus size={16} className="ml-2 shrink-0" />

          <input
            type="text"
            value={currentKBName}
            disabled={disabled}
            onChange={(e) => onRenameKB?.(e.target.value)}
            onKeyDown={handleRenameKeyDown}
            onBlur={() => onSaveKBName?.()}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            className="bg-transparent border-none outline-none text-base-content w-full min-w-[80px] truncate focus:outline-none"
            placeholder="New KB"
          />

          {/* Unsaved-changes dot */}
          {isDirty && (
            <span
              className="mr-1 h-2 w-2 shrink-0 rounded-full bg-amber-400 animate-pulse"
              title="Unsaved changes"
              aria-label="Unsaved changes"
            />
          )}

          <ChevronDown className="mr-2 shrink-0" />
        </div>

        {/* Dropdown Menu */}
        <ul
          tabIndex={0}
          className="dropdown-content menu z-[1] w-64 border border-base-300 bg-base-100 p-2 text-base-content shadow"
        >
          <li>
            <button onClick={handleCreateNew} disabled={disabled}>
              <Plus size={16} />
              <span>New KB</span>
            </button>
          </li>

          <li className="my-1 h-px bg-base-200" aria-hidden="true" />

          <li className="block p-0">
            <div className="max-h-[9rem] overflow-y-auto">
              {savedKBs.length === 0 ? (
                <div className="px-2 py-1 text-sm text-base-content/50">
                  No saved KBs
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  {savedKBs.map((kb) => {
                    const isCurrent = kb.id === currentKBID;
                    return (
                      <div
                        key={kb.id}
                        className={`flex w-full flex-row items-center rounded ${
                          isCurrent ? "bg-base-200" : ""
                        }`}
                      >
                        <button
                          onClick={() => handleLoadKB(kb)}
                          disabled={disabled}
                          className="flex min-w-0 flex-1 flex-row items-center gap-2 text-left"
                          title={kb.name}
                        >
                          <List size={16} className="shrink-0" />
                          <span className="min-w-0 truncate">{kb.name}</span>
                        </button>

                        <button
                          onClick={(e) => handleDeleteKB(e, kb)}
                          disabled={disabled}
                          className="btn btn-ghost btn-xs shrink-0 !flex !w-7 !min-h-7 !p-0 text-base-content/60 hover:bg-transparent hover:text-red-400"
                          title="Delete KB"
                          aria-label={`Delete ${kb.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleImport}
          disabled={disabled}
          className="btn btn-sm border-base-300 bg-base-100 text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Import KB from file"
        >
          <Upload size={16} />
          Import
        </button>

        <button
          onClick={onExport}
          disabled={disabled || !hasContent}
          className="btn btn-sm border-base-300 bg-base-100 text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Export KB to file"
        >
          <Download size={16} />
          Export
        </button>

      </div>
    </div>
  );
}