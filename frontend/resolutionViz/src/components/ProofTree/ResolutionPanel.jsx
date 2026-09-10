import ResolutionGraph from "./ResolutionGraph";
import PlaybackControls from "./PlaybackControls"

export default function ResolutionPanel({ result }) {
  return (
    <section className="flex flex-col h-full rounded-2xl border border-base-300 bg-base-100 bg-slate-900 p-5 gap-2">
      <h2 className="mb-3 text-base font-semibold flex-shrink-0">
        Resolution Visualization
      </h2>

      <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-base-300 bg-base-200">
        <ResolutionGraph 
          clauses={result?.clauses ?? []}
          steps={result?.steps ?? []}
        />
      </div>

      <PlaybackControls />
    </section>
  );
}