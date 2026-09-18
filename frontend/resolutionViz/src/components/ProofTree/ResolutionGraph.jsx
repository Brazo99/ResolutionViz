import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import {useMemo, useEffect, useRef} from "react";
import "@xyflow/react/dist/style.css";
import { convertStepsToGraph } from "../../utils/graph/convertStepsToGraph";

function ResolutionGraphContent({clauses = [], steps = [],currentStep = 0}) {
  const { fitView } = useReactFlow();
  const previousStep = useRef(currentStep);
  const { nodes, edges } = useMemo(
    () => convertStepsToGraph(clauses, steps, currentStep),
    [clauses, steps, currentStep]
  );

   /*
   * Keep the viewport following the proof.
   * fitView recalculates the visible graph and smoothly
   * moves the viewport to keep the proof visible.
   */
  useEffect(() => {
    if (!nodes.length) return;

    const frame = requestAnimationFrame(() => {
      fitView({
        padding: 0.25,
        duration: 600, //This is makes the viewport movement smooth.
        minZoom: 0.25,
        maxZoom: 1.5
      });
    });

    previousStep.current = currentStep;

    return () => {cancelAnimationFrame(frame);};
  }, [nodes, edges, currentStep, fitView]);


  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        proOptions={{ hideAttribution: true }}
        colorMode="system"
      >
        <Background
          variant={BackgroundVariant.Dots}
          bgColor="#020617"
          color="#020617"
          gap={20}
          size={1.5}
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