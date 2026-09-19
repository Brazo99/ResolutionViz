export const NODE_STYLES = {
  kb: {
    background: "var(--rv-node-kb-bg)",
    color: "var(--rv-node-kb-text)",
    border: "1px solid var(--rv-node-kb-border)",
    borderRadius: "8px",
    boxShadow: "0 4px 14px var(--rv-node-shadow)",
    padding: "12px 20px",
    fontSize: "15px",
    fontWeight: "600",
    width: 160,
    textAlign: "center",
  },

  derived: {
    background: "var(--rv-node-derived-bg)",
    color: "var(--rv-node-derived-text)",
    border: "1px solid var(--rv-node-derived-border)",
    borderRadius: "8px",
    boxShadow: "0 4px 16px var(--rv-node-shadow)",
    padding: "12px 20px",
    fontSize: "15px",
    fontWeight: "600",
    width: 160,
    textAlign: "center",
  },

  resolution: {
    background: "var(--rv-node-resolution-bg)",
    color: "var(--rv-node-resolution-text)",
    border: "1px solid var(--rv-node-resolution-border)",
    borderRadius: "8px",
    boxShadow: "0 0 18px var(--rv-node-resolution-shadow)",
    padding: "12px 20px",
    fontSize: "13px",
    fontWeight: "600",
    width: 180,
    textAlign: "center",
  },

  contradiction: {
    background: "var(--rv-node-contradiction-bg)",
    color: "var(--rv-node-contradiction-text)",
    border: "1px solid var(--rv-node-contradiction-border)",
    borderRadius: "8px",
    boxShadow: "0 0 24px var(--rv-node-contradiction-shadow)",
    padding: "13px 20px",
    fontSize: "15px",
    fontWeight: "700",
    width: 180,
    textAlign: "center",
  },
};

export const EDGE_STYLES = {
  parent: {
    stroke: "var(--rv-edge-parent)",
    strokeWidth: 1.5,
  },

  derived: {
    stroke: "var(--rv-edge-derived)",
    strokeWidth: 2,
  },

  contradiction: {
    stroke: "var(--rv-edge-contradiction)",
    strokeWidth: 2,
  },
};