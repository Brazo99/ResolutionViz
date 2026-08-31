import { getLayoutedElements } from "./dynamicLayouting";

export function literalToString(literal) {
    const [variable, positive] = literal;
    return !positive ? variable : `!${variable}`;
}

export function clauseToString(clause) {
    return clause
        .map(literalToString)
        .join(" ∨ ");
}

function clauseKey(clause) {
    return clause
        .map(([variable, positive]) => `${variable}:${positive}`)
        .sort()
        .join("|");
}

export function convertStepsToGraph(clauses = [], steps = []) {
    const nodes = [];
    const edges = [];

    const clauseNodes = new Map();

    let clauseCounter = 0;
    let resolutionCounter = 0;

    function getClauseNode(clause, position) {
        const key = clauseKey(clause);

        if (clauseNodes.has(key)) {
            return clauseNodes.get(key);
        }

        clauseCounter++;

        const node = {
            id: `clause-${clauseCounter}`,
            position,

            data: {
                label: clauseToString(clause),
                type: "clause",
                clause,
            },

            style: {
                background: "#1e293b",
                color: "#f8fafc",
                border: "1px solid #475569",
                borderRadius: "12px",
                padding: "12px 20px",
                fontSize: "15px",
                fontWeight: "600",
                width: 160,
                textAlign: "center",
            },
        };
        nodes.push(node);
        clauseNodes.set(key, node);
        return node;
    }

    clauses.forEach((clause, index) => {
        getClauseNode(clause, {
            x: index * 220,
            y: 0,
        });
    });

    steps.forEach((step, index) => {
        resolutionCounter++;

        const parentY = (index + 1) * 300;
        const clause1Node = getClauseNode(
            step.clause1,
            {
                x: 50,
                y: parentY,
            }
        );

        const clause2Node = getClauseNode(
            step.clause2,
            {
                x: 350,
                y: parentY,
            }
        );

        const resolutionNode = {
            id: `resolution-${resolutionCounter}`,

            position: {
                x: 200,
                y: parentY + 120,
            },

            data: {
                label: `Resolve on ${step.pivot}`,
                type: "resolution",
                pivot: step.pivot,
                step,
            },

            style: {
                background: "#334155",
                color: "#f8fafc",
                border: "1px solid #64748b",
                borderRadius: "12px",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "600",
                width: 180,
                textAlign: "center",
            },
        };

        nodes.push(resolutionNode);
        edges.push({
            id: `edge-${resolutionCounter}-1`,
            source: clause1Node.id,
            target: resolutionNode.id,
        });

        edges.push({
            id: `edge-${resolutionCounter}-2`,
            source: clause2Node.id,
            target: resolutionNode.id,
        });


        const resolventNode = getClauseNode(
            step.resolvent,
            {
                x: 200,
                y: parentY + 240,
            }
        );

        edges.push({
            id: `edge-${resolutionCounter}-3`,
            source: resolutionNode.id,
            target: resolventNode.id,
        });
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } =getLayoutedElements(nodes, edges);

    return {
        nodes: layoutedNodes,
        edges: layoutedEdges,
    };
}