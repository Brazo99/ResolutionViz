import { describe, expect, it } from "vitest";
import { clauseToString, literalToString } from "./formatting";
import { clauseKey, isEmptyClause } from "./clauseUtils";

describe("graph formatting utilities", () => {
  it("formats positive and negative literals", () => {
    expect(literalToString(["A", false])).toBe("A");
    expect(literalToString(["A", true])).toBe("!A");
  });

  it("formats clauses and the empty clause", () => {
    expect(clauseToString([["A", false], ["B", true]])).toBe("A ∨ !B");
    expect(clauseToString([])).toBe("□");
  });

  it("detects empty clauses", () => {
    expect(isEmptyClause([])).toBe(true);
    expect(isEmptyClause([["A", false]])).toBe(false);
  });

  it("creates the same key regardless of literal order", () => {
    expect(clauseKey([["A", false], ["B", true]])).toBe(
      clauseKey([["B", true], ["A", false]])
    );
  });
});