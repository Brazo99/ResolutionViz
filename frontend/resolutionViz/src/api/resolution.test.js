import { describe, expect, it, vi } from "vitest";

import api from "./axios";
import { checkSatisfiability, validateFormula } from "./resolution";

vi.mock("./axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("resolution API client", () => {
  it("splits knowledge-base text into formulas before sending it", async () => {
    api.post.mockResolvedValueOnce({ data: { result: false } });

    await checkSatisfiability("A\nA -> B\n\n!C", "B");

    expect(api.post).toHaveBeenCalledWith("/checkSatisfiability", {
      formula: ["A", "A -> B", "!C"],
      goal: "B",
    });
  });

  it("calls the single-formula validation endpoint", async () => {
    api.post.mockResolvedValueOnce({ data: { valid: true } });

    const result = await validateFormula("A & B");

    expect(api.post).toHaveBeenCalledWith("/checkFormula", { formula: "A & B" });
    expect(result).toEqual({ valid: true });
  });
});