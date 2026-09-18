import { MarkerType } from "@xyflow/react";
import { clauseToString } from "./formatting";
import { clauseKey, isEmptyClause } from "./clauseUtils";
import { NODE_STYLES, EDGE_STYLES } from "./styles";
import { getLayoutedElements, getInitialClauseLayout } from "../layout/dynamicLayouting";

export function convertStepsToGraph(clauses = [], steps = [], currentStep = 0) {
    const nodes = [];
    const edges = [];
    const clauseNodes = new Map();
    let clauseCounter = 0;
    let resolutionCounter = 0;

    /*
     * Track when each clause is:
     *
     * 1. introduced as a resolvent
     * 2. first used as a parent
     *
     * This lets us decide when a KB clause should leave the initial horizontal row.
     */
    const introducedAt = new Map();
    const firstUsedAt = new Map();

    steps.forEach((step) => {
        const stepNumber = step.step;
        introducedAt.set( clauseKey(step.resolvent), stepNumber);
        const clause1Key = clauseKey(step.clause1);

        if (!firstUsedAt.has(clause1Key)) {
            firstUsedAt.set( clause1Key, stepNumber );
        }

        const clause2Key = clauseKey(step.clause2);
        if (!firstUsedAt.has(clause2Key)) {
            firstUsedAt.set(clause2Key,stepNumber);
        }
    });

    // Create / reuse clause node
    function getClauseNode(clause, kind = "derived") {
        const key = clauseKey(clause);

        // Reuse existing node.
        if (clauseNodes.has(key)) return clauseNodes.get(key);
        clauseCounter++;
        const emptyClause = isEmptyClause(clause);
        let nodeStyle;

        if (emptyClause) {
            nodeStyle = NODE_STYLES.contradiction;
        }
        else if (kind === "kb") {
            nodeStyle = NODE_STYLES.kb;
        }
        else {
            nodeStyle = NODE_STYLES.derived;
        }

        const node = {
            id: `clause-${clauseCounter}`,

            position: {
                x: 0,
                y: 0,
            },

            type: "default",

            data: {
                label: emptyClause ? "□ (False) CONTRADICTION" : clauseToString(clause),
                type: emptyClause ? "contradiction" : kind === "kb" ? "kb-clause" : "derived-clause",
                clause,
                role: kind === "kb" ? "kb" : "derived",
                introducedAt: introducedAt.get(key) ?? 0,
                firstUsedAt: firstUsedAt.get(key) ?? null,
            },

            style: nodeStyle,
        };


        nodes.push(node);
        clauseNodes.set( key, node);
        return node;
    }

    // Create initial KB nodes.
    clauses.forEach((clause) => {
        getClauseNode( clause, "kb");
    });

    /*
     * Build COMPLETE proof graph.
     * We need the complete graph for Dagre so that every
     * proof node gets its final position.
     */
    steps.forEach((step) => {
        resolutionCounter++;
        const stepNumber = step.step;

        const clause1Node = getClauseNode(step.clause1, "derived");
        const clause2Node = getClauseNode(step.clause2, "derived" );

        const resolutionNode = {
            id: `resolution-${resolutionCounter}`,
            position: {
                x: 0,
                y: 0,
            },
            type: "default",
            data: {
                label: `Resolve on ${step.pivot}`,
                type: "resolution",
                pivot: step.pivot,
                step,
                stepNumber,
                role: "resolution",
            },
            style: NODE_STYLES.resolution,
        };

        nodes.push(resolutionNode);

        // Clause 1 -> Resolution
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

            data: {stepNumber},
        });

        // Clause 2 -> Resolution
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

            data: {stepNumber},
        });

        // Resolvent
        const resolventNode = getClauseNode(step.resolvent,"derived");
        const contradiction = isEmptyClause(step.resolvent);

        // Resolution -> Resolvent
        edges.push({
            id: `edge-${resolutionCounter}-3`,
            source: resolutionNode.id,
            target: resolventNode.id,
            type: "smoothstep",
            style: contradiction ? EDGE_STYLES.contradiction: EDGE_STYLES.derived,
            animated: contradiction,

            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: contradiction ? EDGE_STYLES.contradiction.stroke: EDGE_STYLES.derived.stroke,
            },

            data: {stepNumber,},
        });
    });

    // Calculate FINAL proof positions.
    const {nodes: proofNodes, edges: proofEdges,} = getLayoutedElements(nodes, edges);

    // Calculate INITIAL horizontal positions.
    const initialNodes = getInitialClauseLayout(proofNodes);

    const playbackNodes =
        proofNodes
            .map((proofNode) => {
                const role =
                    proofNode.data?.role;

                if (role === "kb") {
                    const initialNode = initialNodes.find((node) => node.id === proofNode.id);
                    const firstUsedStep = proofNode.data ?.firstUsedAt;

                    if (firstUsedStep === null || currentStep < firstUsedStep) {
                        return {
                            ...proofNode,
                            position:initialNode.position,
                        };
                    }

                    /*
                     * KB clause has now been used.
                     *
                     * Move it to its Dagre proof position.
                     */
                    return {
                        ...proofNode,
                        position: proofNode.position,
                        className: firstUsedStep ===currentStep ? "resolution-node-enter": "",
                    };
                }

                // Resolution nodes
                if (role ==="resolution") {
                    const stepNumber =proofNode.data ?.stepNumber;

                    // Do not render future resolution nodes.
                    if (stepNumber > currentStep) return null;
                    
                    return {
                        ...proofNode,
                        className: stepNumber === currentStep ? "resolution-node-enter": "",
                    };
                }

                // Derived clause
                const introducedStep = proofNode.data?.introducedAt;

                // Future derived clause.
                if (introducedStep > currentStep) return null;
                
                return {
                    ...proofNode,
                    className: introducedStep === currentStep ? "resolution-node-enter": "",
                };
            })
            .filter(Boolean);

    const visibleNodeIds = new Set(playbackNodes.map((node) => node.id));

    const playbackEdges =
        proofEdges.filter((edge) => {
            const stepNumber = edge.data ?.stepNumber ?? 0;

            const endpointsVisible = visibleNodeIds.has(edge.source) &&
                visibleNodeIds.has(edge.target);
            return (stepNumber <= currentStep && endpointsVisible);
        });

    /*
     * Add entrance animation to edges that belong
     * to the current step.
     */
    playbackEdges.forEach((edge) => {
        if (edge.data ?.stepNumber ===currentStep) {
            edge.className = "resolution-edge-enter";
        }
    });

    return {nodes: playbackNodes, edges: playbackEdges};
}