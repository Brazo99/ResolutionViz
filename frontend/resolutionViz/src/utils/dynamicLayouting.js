import dagre from '@dagrejs/dagre';

// 1. Define your uniform dimensions
const NODE_WIDTH = 150;
const NODE_HEIGHT = 40;

// 2. The Auto-Layout Layout Function
export function getLayoutedElements(nodes, edges){
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // 'TB' defines Top-to-Bottom. (Use 'LR' if you ever want Left-to-Right)
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 80 });

  // Feed nodes into the dagre graph using uniform dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Feed connections into the dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Execute layout calculations
  dagre.layout(dagreGraph);

  // Map calculated coordinates back to React Flow nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      // Adjusting coordinates so the node centers on the calculated point
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
