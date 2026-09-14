import {ReactFlow, ReactFlowProvider, Controls, MiniMap, Background,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import { useMemo, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { convertStepsToGraph } from "../../utils/graph/convertStepsToGraph";


function ResolutionGraphContent({clauses = [], steps = [],currentStep = 0,}) {
  const { fitView } = useReactFlow();
  const { nodes, edges } = useMemo(
    () => convertStepsToGraph(clauses, steps, currentStep),
    [clauses, steps, currentStep]
  );

  useEffect(() => {
    if (!nodes.length) return;

    fitView({
      padding: 0.2,
      duration: 300,
    });
  }, [nodes, fitView]);

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

        <MiniMap />
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