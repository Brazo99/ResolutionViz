import {
  Play,
  StepBack,
  StepForward 
} from "lucide-react";

export default function PlaybackControls() {
  return (

      <div className="flex items-center justify-center gap-2"> 

        <button className="btn btn-circle btn-neutral">
          <StepBack size={18} />
        </button>

        <button className="btn btn-circle btn-primary btn-lg">
          <Play size={22} />
        </button>

        <button className="btn btn-circle btn-neutral">
          <StepForward size={18} />
        </button>

      </div>

  );
}