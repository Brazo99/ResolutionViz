import dagre from '@dagrejs/dagre';

// Define your uniform dimensions
const NODE_WIDTH = 150;
const NODE_HEIGHT = 40;

const INITIAL_GAP = 20;
const INITIAL_START_X = 20;
const INITIAL_START_Y = -100;

// Calculate the final resolution-proof layout.
export function getLayoutedElements(nodes, edges) {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 80 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT});
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge( edge.source, edge.target );
    });

    // Calculate Dagre layout.
    dagre.layout(dagreGraph);

    // Apply Dagre positions.
    const layoutedNodes = nodes.map((node) => {
        const position = dagreGraph.node(node.id);

        return {
            ...node,
            position: {
                x: position.x - NODE_WIDTH / 2,
                y: position.y - NODE_HEIGHT / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges};
}

// Initial horizontal KB layout.
export function getInitialClauseLayout(nodes) {
    const kbNodes = nodes.filter( (node) => node.data?.role === "kb");
    return nodes.map((node) => {
        const index = kbNodes.findIndex( (kbNode) => kbNode.id === node.id);

        // Only KB nodes have initial horizontal positions.
        if (index === -1) return node;

        return {
            ...node,
            position: {
                x: INITIAL_START_X + index * (NODE_WIDTH + INITIAL_GAP),
                y: INITIAL_START_Y,
            },
        };
    });
}