import ResolutionGraph from "./ResolutionGraph";
import PlaybackControls from "./PlaybackControls";
import VerificationResult from "./VerificationResult";
import { useState, useEffect } from "react";

export default function ResolutionPanel({ result, isLoading = false }) {
  const clauses = result?.clauses ?? [];
  const steps = result?.steps ?? [];
  const totalSteps = steps.length;

  const raw = result?.result;
  const isSatisfiable =
    typeof raw === "boolean"
      ? raw
      : raw === "true"
        ? true
        : raw === "false"
          ? false
          : raw === 1
            ? true
            : raw === 0
              ? false
              : null;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);

    // If there are no resolution steps but a result is available,
    // the proof/result is already complete.
    setHasCompleted(totalSteps === 0 && isSatisfiable !== null);
  }, [result, totalSteps, isSatisfiable]);

  const handleBack = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleForward = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePlay = () => {
    if (totalSteps === 0) return;

    if (currentStep >= totalSteps) {
      setCurrentStep(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((prev) => !prev);
  };

  // Auto-advance playback.
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= totalSteps) {
      setIsPlaying(false);
      setHasCompleted(true);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps]);

  const currentStepLabel =
    currentStep === 0
      ? "Initial clauses"
      : currentStep >= totalSteps
        ? "Proof complete"
        : `Proof step ${steps[currentStep - 1]?.step ?? currentStep}`;

  const atEnd = totalSteps === 0 || currentStep >= totalSteps;

  // Once the user reaches the end, keep the result visible.
  useEffect(() => {
    if (atEnd && isSatisfiable !== null) {
      setHasCompleted(true);
    }
  }, [atEnd, isSatisfiable]);

  const showResult = hasCompleted && isSatisfiable !== null;

  return (
    <section className="flex h-full flex-col gap-2 rounded-2xl border border-base-300 bg-base-100 p-5">
      <h2 className="mb-3 flex-shrink-0 text-base font-semibold">
        Resolution Visualization
      </h2>

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-base-300 bg-base-200">
        <ResolutionGraph
          clauses={clauses}
          steps={steps}
          currentStep={currentStep}
        />
      </div>

      <div className="flex flex-col items-center gap-2 pt-2">
        <p className="text-xs text-base-content/60">
          {currentStepLabel}
        </p>

        <PlaybackControls
          onBack={handleBack}
          onPlay={handlePlay}
          onForward={handleForward}
          isPlaying={isPlaying}
          canGoBack={currentStep > 0}
          canGoForward={currentStep < totalSteps}
          isComplete={atEnd}
          disabled={isLoading}
        />
      </div>

      {showResult && (
        <div className="pt-2">
          <VerificationResult isSatisfiable={isSatisfiable} />
        </div>
      )}
    </section>
  );
}