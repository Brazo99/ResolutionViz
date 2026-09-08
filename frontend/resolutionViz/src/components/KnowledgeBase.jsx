import TextEditor from "./TextEditor";

export default function KnowledgeBase({ value, onChange,}) {
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
        <h2 className="text-sm font-semibold text-slate-200">
          Knowledgebase (Facts)
        </h2>
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