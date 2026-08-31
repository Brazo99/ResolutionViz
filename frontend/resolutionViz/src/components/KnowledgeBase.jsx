import TextEditor from "./TextEditor";

export default function KnowledgeBase({ value, onChange }) {
  const formulaCount = value ? value.split('\n').filter(line => line.trim() !== '').length : 0;

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-slate-200">
          Knowledgebase (Facts)
        </h2>
        <span className="text-xs text-slate-400">{formulaCount} formula(s)</span>
      </div>

      {/* Editor */}
      <TextEditor
        value={value}
        onChange={onChange}
        placeholder="Enter knowledgebase formulas..."
      />
    </section>
  );
}