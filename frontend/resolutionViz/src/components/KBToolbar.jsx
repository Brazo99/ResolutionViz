import { Download, Upload, Plus, ChevronDown, List, Trash2 } from "lucide-react";

export default function KBToolbar({ 
  onImport, 
  onExport, 
  hasContent = false,
  currentKBName,
  savedKBs = [],
  onCreateNewKB,
  onLoadKB,
  onDeleteKB,
  onRenameKB,
  onSaveKBName
}) {

  const handleImport = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt,.kb';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const lines = content.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
          if (onImport) onImport(lines);
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };

  const handleExport = () => {
    if (!hasContent) {
      alert('Knowledge base is empty. Nothing to export.');
      return;
    }
    if (onExport) onExport();
  };

  const handleLoadKB = (kb) => {
    if (onLoadKB) onLoadKB(kb);
    document.activeElement.blur();
  };

  const handleDeleteKB = (e, kb) => {
    e.stopPropagation();
    if (onDeleteKB) onDeleteKB(kb);
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 flex-wrap">

      <div className="dropdown dropdown-start">
        {/* Editable Button Label */}
        <div
          tabIndex={0}
          role="button"
          className="btn btn-sm border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 max-w-[200px] p-0"
        >
          <Plus size={16} className="ml-2 shrink-0" />
          
          {/* Editable Input Field */}
          <input
            type="text"
            value={currentKBName}
            onChange={(e) => onRenameKB(e.target.value)}
            onKeyDown={handleRenameKeyDown}               
            onBlur={onSaveKBName}                          
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            className="bg-transparent border-none outline-none text-slate-200 w-full min-w-[80px] truncate focus:outline-none"
          />
          
          <ChevronDown className="mr-2 shrink-0" />
        </div>

        {/* Dropdown Menu */}
        <ul
          tabIndex={0}
          className="dropdown-content menu z-[1] w-64 p-2 shadow border border-slate-700 bg-slate-800 text-slate-200"
        >
          {/* New KB */}
          <li>
              <button onClick={onCreateNewKB}>
                <Plus size={16} />
                <span>New KB</span>
              </button>
          </li>

          {/* Saved KBs */}
          <li className="block p-0">
          <div className="my-1 max-h-[4.5rem] overflow-y-auto">
            {savedKBs.length === 0 ? (
              <div className="w-full">
                <button
                  className="w-full text-left text-slate-500"
                  disabled
                >
                  No saved KBs
                </button>
              </div>
            ) : (
              <div className="flex flex-col w-full">
                {savedKBs.map((kb) => (
                  <div
                    key={kb.id}
                    className="flex w-full flex-row items-center"
                  >
                    {/* KB name */}
                    <button
                      onClick={() => handleLoadKB(kb)}
                      className="flex min-w-0 flex-1 flex-row items-center gap-2 text-left"
                    >
                      <List size={16} className="shrink-0" />

                      <span className="min-w-0 truncate">
                        {kb.name}
                      </span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => handleDeleteKB(e, kb)}
                      className="btn btn-ghost btn-xs shrink-0 !flex !w-7 !min-h-7 !p-0 text-slate-400 hover:bg-transparent hover:text-red-400"
                      title="Delete KB"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          </li>
        </ul>

      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleImport}
          className="btn btn-sm border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
        >
          <Upload size={16} />
          Import KB
        </button>

        <button
          onClick={handleExport}
          className="btn btn-sm border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
        >
          <Download size={16} />
          Export KB
        </button>
      </div>
    </div>
  );
}