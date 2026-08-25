import {
  SkipBack,
  Play,
  SkipForward,
} from "lucide-react";

export default function PlaybackControls() {
  return (
    <section className="flex items-center justify-center rounded-2xl border border-base-300 bg-base-100 p-10">

      <div className="flex items-center gap-2">

        <button className="btn btn-square btn-neutral">
          <SkipBack size={18} />
        </button>

        <button className="btn btn-square btn-primary btn-lg">
          <Play size={22} />
        </button>

        <button className="btn btn-square btn-neutral">
          <SkipForward size={18} />
        </button>

      </div>

    </section>
  );
}