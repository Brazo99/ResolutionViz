import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
