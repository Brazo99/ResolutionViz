import {
  ReactFlow,
  Background,
  Controls,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

export default function ProofTree() {
  return (
    <ReactFlow>
        <Background />
        <Controls />
      </ReactFlow>
  );
}