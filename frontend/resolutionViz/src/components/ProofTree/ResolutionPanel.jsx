import ResolutionGraph from "./ResolutionGraph";
import PlaybackControls from "./PlaybackControls"
import { useState,useEffect } from "react";

export default function ResolutionPanel({ result, isLoading = false }) {
  const clauses = result?.clauses ?? [];
  const steps = result?.steps ?? [];

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalSteps = steps.length;

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [result]);

  const handleBack = () => {
    setIsPlaying(false);

    setCurrentStep((previous) =>
      Math.max(previous - 1, 0)
    );
  };

  const handleForward = () => {
    setIsPlaying(false);

    setCurrentStep((previous) =>
      Math.min(previous + 1, totalSteps)
    );
  };

  const handlePlay = () => {
    if (currentStep >= totalSteps) {
      setCurrentStep(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((previous) => !previous);
  };


  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (currentStep >= totalSteps) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((previous) => previous + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps]);

  const currentStepLabel =
    currentStep === 0
      ? "Initial clauses"
      : currentStep >= totalSteps
        ? "Proof complete"
        : `Proof step ${steps[currentStep - 1]?.step ?? currentStep}`;

  return (
    <section className="flex flex-col h-full rounded-2xl border border-base-300 bg-base-100 bg-slate-900 p-5 gap-2">
      <h2 className="mb-3 text-base font-semibold flex-shrink-0">
        Resolution Visualization
      </h2>

      <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-base-300 bg-base-200">
        <ResolutionGraph 
          clauses={clauses}
          steps={steps}
          currentStep={currentStep}
        />
      </div>

       {/* Playback information + controls */}
      <div className="flex flex-col items-center gap-2 pt-2">

        <p className="text-xs text-slate-400">
          {currentStepLabel}
        </p>

        <PlaybackControls 
          onBack={handleBack}
          onPlay={handlePlay}
          onForward={handleForward}
          isPlaying={isPlaying}
          canGoBack={currentStep > 0}
          canGoForward={currentStep < totalSteps}
          disabled={isLoading}
        />
      </div>
    </section>
  );
}