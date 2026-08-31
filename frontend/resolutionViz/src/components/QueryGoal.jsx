export default function QueryGoal({ value, onChange }) {
  const charCount = value ? value.length : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-300">Query Goal</label>
        <span className="text-xs text-slate-500">{charCount} chars</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter query goal (e.g., Q)"
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}