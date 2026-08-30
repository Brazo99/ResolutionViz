import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import { useMemo } from "react";
import '@xyflow/react/dist/style.css';
import { convertStepsToGraph } from "../../utils/resolutionGraph";

export default function ResolutionGraph({ steps = [] }) {
  const { nodes, edges } = useMemo( () => convertStepsToGraph(steps), [steps] )

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
