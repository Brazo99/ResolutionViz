export const NODE_STYLES = {
    // Original knowledge-base clauses
    kb: {
        background: "#0f1b2d",
        color: "#dbeafe",
        border: "1px solid #334e68",
        borderRadius: "8px",
        boxShadow:
            "0 4px 14px rgba(0, 0, 0, 0.25)",
        padding: "12px 20px",
        fontSize: "15px",
        fontWeight: "600",
        width: 160,
        textAlign: "center",
    },

    // Clauses produced by resolution
    derived: {
        background: "#17152b",
        color: "#ede9fe",
        border: "1px solid #7c6ee6",
        borderRadius: "8px",
        boxShadow:
            "0 4px 16px rgba(0, 0, 0, 0.3)",
        padding: "12px 20px",
        fontSize: "15px",
        fontWeight: "600",
        width: 160,
        textAlign: "center",
    },

    // Resolution operation
    resolution: {
        background: "#131b30",
        color: "#ddd6fe",
        border: "1px solid #6366f1",
        borderRadius: "8px",
        boxShadow:
            "0 0 18px rgba(99, 102, 241, 0.12)",
        padding: "12px 20px",
        fontSize: "13px",
        fontWeight: "600",
        width: 180,
        textAlign: "center",
    },

    // Empty clause / contradiction
    contradiction: {
        background: "#2a1218",
        color: "#fecaca",
        border: "1px solid #ef4444",
        borderRadius: "8px",
        boxShadow:
            "0 0 24px rgba(239, 68, 68, 0.20)",
        padding: "13px 20px",
        fontSize: "15px",
        fontWeight: "700",
        width: 180,
        textAlign: "center",
    },
};


export const EDGE_STYLES = {
    // Parent clause -> resolution operation
    parent: {
        stroke: "#475569",
        strokeWidth: 1.5,
    },

    // Resolution operation -> derived clause
    derived: {
        stroke: "#8b7cf6",
        strokeWidth: 2,
    },

    // Resolution operation -> contradiction
    contradiction: {
        stroke: "#ef4444",
        strokeWidth: 2,
    },
};