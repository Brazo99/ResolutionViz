import { MarkerType } from "@xyflow/react";
import { clauseToString } from "./formatting";
import { clauseKey, isEmptyClause } from "./clauseUtils";
import { NODE_STYLES, EDGE_STYLES } from "./styles";
import { getLayoutedElements } from "../layout/dynamicLayouting";

// Convert Resolution Steps Into Graph
export function convertStepsToGraph(clauses = [], steps = [], currentStep = 0) {
    const nodes = [];
    const edges = [];
    const clauseNodes = new Map();
    let clauseCounter = 0;
    let resolutionCounter = 0;

    // Create or Reuse Clause Node
    function getClauseNode(clause, position, kind = "derived") {
        const key = clauseKey(clause);

        // If this clause already exists, reuse the existing node.
        if (clauseNodes.has(key)) {
            return clauseNodes.get(key);
        }
        clauseCounter++;
        const emptyClause = isEmptyClause(clause);
        let nodeStyle;

        if (emptyClause) {
            nodeStyle = NODE_STYLES.contradiction;
        } else if (kind === "kb") {
            nodeStyle = NODE_STYLES.kb;
        } else {
            nodeStyle = NODE_STYLES.derived;
        }

        const node = {
            id: `clause-${clauseCounter}`,
            position,
            type: "default",

            data: {
                label: emptyClause ? "□ (False)" : clauseToString(clause),

                type: emptyClause
                    ? "contradiction"
                    : kind === "kb"
                        ? "kb-clause"
                        : "derived-clause",
                clause,
            },

            style: nodeStyle,
        };

        nodes.push(node);
        clauseNodes.set(key, node);
        return node;
    }

    // Initial Knowledge Base Clauses
    clauses.forEach((clause, index) => {
        getClauseNode(clause,
            {x: index * 220, y: 0,}, "kb");

    });

    // Only Show Steps Up To currentStep
    const visibleSteps = steps.slice(0,currentStep);

    // Create Resolution Steps
    visibleSteps.forEach((step, index) => {
        resolutionCounter++;
        const parentY = (index + 1) * 300;

        // Parent Clause 1
        const clause1Node = getClauseNode(step.clause1, {x: 50, y: parentY,},"derived");

        // Parent Clause 2
        const clause2Node = getClauseNode(step.clause2, {x: 350, y: parentY,},"derived");

        // Resolution Operation Node
        const resolutionNode = {
            id: `resolution-${resolutionCounter}`,
            position: {x: 200, y: parentY + 120,},
            type: "default",
            data: {
                label:`Resolve on ${step.pivot}`,
                type: "resolution",
                pivot:step.pivot,
                step,
            },
            style:NODE_STYLES.resolution,
        };
        nodes.push(resolutionNode);

        // Parent 1 -> Resolution
        edges.push({
            id: `edge-${resolutionCounter}-1`,
            source: clause1Node.id,
            target: resolutionNode.id,
            type: "smoothstep",
            style: EDGE_STYLES.parent,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: EDGE_STYLES.parent.stroke,
            },

        });

        // Parent 2 -> Resolution
        edges.push({
            id: `edge-${resolutionCounter}-2`,
            source: clause2Node.id,
            target: resolutionNode.id,
            type: "smoothstep",
            style: EDGE_STYLES.parent,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: EDGE_STYLES.parent.stroke,
            },

        });

        // Resolved Clause
        const resolventNode = getClauseNode(step.resolvent, {x: 200, y: parentY + 240,},"derived");
        const contradiction = isEmptyClause(step.resolvent);

        // Resolution -> Resolvent
        edges.push({
            id: `edge-${resolutionCounter}-3`,
            source: resolutionNode.id,
            target: resolventNode.id,
            type: "smoothstep",
            style: contradiction ? EDGE_STYLES.contradiction : EDGE_STYLES.derived,
            animated: contradiction,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: contradiction ? EDGE_STYLES.contradiction.stroke : EDGE_STYLES.derived.stroke,
            },

        });

    });

    // Apply Dynamic Layout
    const {nodes: layoutedNodes, edges: layoutedEdges,} = getLayoutedElements(nodes, edges);

    return {nodes: layoutedNodes, edges: layoutedEdges,};
}