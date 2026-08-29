import { Download, Upload } from "lucide-react";

export default function KBToolbar() {
  return (
    <div className="flex shrink-0 gap-2">

      <button className="btn btn-sm border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
        <Upload size={16} />
        Import KB
      </button>

      <button className="btn btn-sm border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
        <Download size={16} />
        Export KB
      </button>

    </div>
  );
}