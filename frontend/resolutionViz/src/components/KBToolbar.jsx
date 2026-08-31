import { Download, Upload } from "lucide-react";

export default function KBToolbar({ onImport, onExport, hasContent = false }) {
  // Handle Import button click
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

  // Handle Export button click
  const handleExport = () => {
    if (!hasContent) {
      alert('Knowledge base is empty. Nothing to export.');
      return;
    }
    if (onExport) onExport();
  };

  return (
    <div className="flex shrink-0 gap-2">
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
  );
}