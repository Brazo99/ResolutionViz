import { Play, Pause, StepBack, StepForward } from "lucide-react";

export default function PlaybackControls({
  onBack,
  onPlay,
  onForward,
  isPlaying = false,
  canGoBack = true,
  canGoForward = true,
  disabled = false,
}) {
  return (

      <div className="flex items-center justify-center gap-2"> 

        <button 
          className="btn btn-circle btn-neutral"
          onClick={onBack}
          disabled={disabled || !canGoBack}
          title="Previous step"
        >
          <StepBack size={18} />
        </button>

        <button 
          className="btn btn-circle btn-primary btn-lg"
          onClick={onPlay}
          disabled={disabled}
          title={isPlaying ? "Pause proof" : "Play proof"}
          >
          {isPlaying ? (
            <Pause size={22} />
          ) : (
            <Play size={22} />
          )}
        </button>

        <button 
          className="btn btn-circle btn-neutral"
          onClick={onForward}
          disabled={disabled || !canGoForward}
          title="Next step"
        >
          <StepForward size={18} />
        </button>

      </div>

  );
}