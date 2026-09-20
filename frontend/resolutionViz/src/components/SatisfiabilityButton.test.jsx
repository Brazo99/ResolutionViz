import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SatisfiabilityButton from "./SatisfiabilityButton";

describe("SatisfiabilityButton", () => {
  it("renders the check action", () => {
    render(<SatisfiabilityButton onClick={vi.fn()} isLoading={false} disabled={false} />);
    expect(screen.getByRole("button", { name: /check satisfiability/i })).toBeEnabled();
  });

  it("shows a loading state when a check is running", () => {
    render(<SatisfiabilityButton onClick={vi.fn()} isLoading={true} disabled={true} />);
    expect(screen.getByRole("button", { name: /checking/i })).toBeDisabled();
  });
});
