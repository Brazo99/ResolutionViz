import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import { useMemo, useEffect, useRef, useState } from "react";
import "@xyflow/react/dist/style.css";

import { convertStepsToGraph } from "../../utils/graph/convertStepsToGraph";

function ResolutionGraphContent({
  clauses = [],
  steps = [],
  currentStep = 0,
}) {
  const { fitView } = useReactFlow();
  const previousStep = useRef(currentStep);

  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";

      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  const { nodes, edges } = useMemo(
    () =>
      convertStepsToGraph(
        clauses,
        steps,
        currentStep,
        isDark
      ),
    [clauses, steps, currentStep, isDark]
  );

  /*
   * Re-fit the graph whenever the visible graph changes.
   *
   * This preserves the animated movement during playback.
   */
  useEffect(() => {
    if (!nodes.length) return;

    const frame = requestAnimationFrame(() => {
      fitView({
        padding: 0.25,
        duration: 600,
        minZoom: 0.25,
        maxZoom: 1.5,
      });
    });

    previousStep.current = currentStep;

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [nodes, edges, currentStep, fitView]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        proOptions={{ hideAttribution: true }}
        colorMode={isDark ? "dark" : "light"}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color={isDark ? "#334155" : "#cbd5e1"}
        />

        <Controls />
      </ReactFlow>
    </div>
  );
}

export default function ResolutionGraph(props) {
  return (
    <ReactFlowProvider>
      <ResolutionGraphContent {...props} />
    </ReactFlowProvider>
  );
}