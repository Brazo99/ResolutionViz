import {
  ReactFlow,
  Controls,
  MiniMap,
  Background, 
  BackgroundVariant,
} from "@xyflow/react";
import { useMemo } from "react";
import '@xyflow/react/dist/style.css';
import { convertStepsToGraph } from "../../utils/resolutionGraph";

export default function ResolutionGraph({ clauses = [], steps = [] }) {
  const { nodes, edges } = useMemo(
    () => convertStepsToGraph(clauses, steps),
    [clauses, steps]
);


  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        proOptions={{ hideAttribution: true }}
      >

        <Background 
          variant={BackgroundVariant.Dots} 
          bgColor="#020617" 
          color="#020617"
          gap={20} 
          size={1.5} 
        />
      </ReactFlow>
    </div>
  );
}
