import {ReactFlow, Controls, MiniMap, Background, BackgroundVariant,} from "@xyflow/react";
import { useMemo } from "react";
import '@xyflow/react/dist/style.css';
import { convertStepsToGraph } from "../../utils/resolutionGraph";

export default function ResolutionGraph({ clauses = [], steps = [], currentStep = 0, }) {
  const { nodes, edges } = useMemo(
    () => convertStepsToGraph(clauses, steps, currentStep),
    [clauses, steps, currentStep]
  );


  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
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
