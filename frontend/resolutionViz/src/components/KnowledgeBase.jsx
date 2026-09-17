import { useEffect, useRef, useState } from "react";
import TextEditor from "./TextEditor";
import { validateFormula } from "../api/resolution";
import { SquareX } from "lucide-react";

export default function KnowledgeBase({ value, onChange, disabled = false }) {
  const [error, setError] = useState(null);
  const [errorLine, setErrorLine] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorPosition, setErrorPosition] = useState(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Clear errors if editor is empty
    if (!value || !value.trim()) {
      setError(null);
      setErrorLine(null);
      setErrorPosition(null);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);

      try {
        const lines = value.split("\n");
        let firstError = null;

        // Validate each line individually
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // Ignore empty lines
          if (!line) {
            continue;
          }

          try {
            const response = await validateFormula(line);
            const hasError = response?.valid === false;

            console.log(response)
            if (hasError) {
              firstError = {
                lineNumber: i + 1,
                message: response?.error || "Invalid formula",
              };

              break;
            }
          } catch (apiErr) {
            const errorMessage =
              apiErr?.response?.data?.message ||
              apiErr?.response?.data?.error ||
              apiErr?.message ||
              "Invalid formula";

            firstError = {
              lineNumber: i + 1,
              message: errorMessage,
            };

            break;
          }
        }

        // Display first validation error
        if (firstError) {
          setError(firstError.message);
          setErrorLine(firstError.lineNumber);
        } else {
          setError(null);
          setErrorLine(null);
          setErrorPosition(null);
        }
      } catch (err) {
        setError("Network error: Could not validate formulas.");
        setErrorLine(null);
        setErrorPosition(null);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimerRef.current);
    };
  }, [value]);

  // Determine whether alert should appear above/below
  const getAlertPosition = () => {
    if (!errorPosition) {
      return {top: 16,};
    }

    const {
      top: lineTop,
      lineHeight,
      editorHeight,
    } = errorPosition;

    const ALERT_HEIGHT = 100;
    const GAP = 8;
    const PADDING = 16;

    const lineBottom = lineTop + lineHeight;

    // Enough space below the error line
    const spaceBelow = editorHeight - lineBottom - PADDING;

    if (spaceBelow >= ALERT_HEIGHT + GAP) {
      return {
        top: lineBottom + GAP,
      };
    }

    // Otherwise place the alert above the line
    const top = lineTop - ALERT_HEIGHT - GAP;

    return {
      top: Math.max(PADDING, top),
    };
  };

  const alertPosition = getAlertPosition();

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
          flex
          shrink-0
          items-center
          justify-between
          border-b
          border-slate-800
          px-4
          py-3
        "
      >
        <h2 className="text-sm font-semibold text-slate-200">
          Knowledgebase (Facts)
        </h2>

        {isLoading && (
          <span className="loading loading-spinner loading-xs text-slate-500" />
        )}
      </div>

      {/* Editor area */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Text editor */}
        <TextEditor
          value={value}
          onChange={onChange}
          disabled={disabled}
          errorLine={errorLine}
          onErrorPositionChange={setErrorPosition}
          placeholder="Enter knowledgebase formulas..."
        />

        {/* Error alert */}
        {error && errorPosition && (
          <div
            className="
              pointer-events-none
              absolute
              left-4
              right-4
              z-20
              transition-[top]
              duration-150
              ease-out
            "
            style={{
              top: `${alertPosition.top}px`,
            }}
          >
            <div
              className="
                pointer-events-auto
                flex
                items-start
                gap-3
                rounded-md
                border
                border-red-500/30
                border-l-4
                border-l-red-500
                bg-red-950/60
                p-3
                font-mono
                text-xs
                text-red-300
                shadow-lg
                backdrop-blur-sm
              "
            >
              {/* Error icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="
                  mt-0.5
                  h-4
                  w-4
                  shrink-0
                  stroke-current
                  text-red-500
                "
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="
                    M10 14l2-2m0 0l2-2
                    m-2 2l-2-2m2 2l2 2
                    m7-2a9 9 0 11-18 0
                    9 9 0 0118 0z
                  "
                />
              </svg>

              {/* Error message */}
              <div className="min-w-0 flex-1">
                <span className="mb-0.5 block font-bold text-red-400">
                  Invalid formula
                  {errorLine ? ` (Line ${errorLine})` : ""}
                </span>

                <div className="break-words text-red-300">
                  {error}
                </div>
              </div>

              {/* Dismiss */}
              <button
                onClick={() => {
                  setError(null);
                  setErrorLine(null);
                  setErrorPosition(null);
                }}
                className="
                  shrink-0
                  text-red-400/70
                  transition-colors
                  hover:text-red-300
                "
                type="button"
                aria-label="Dismiss error"
              >
                <SquareX size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}