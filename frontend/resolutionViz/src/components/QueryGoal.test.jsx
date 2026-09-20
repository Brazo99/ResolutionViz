import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QueryGoal from "./QueryGoal";

describe("QueryGoal", () => {
  it("renders the current goal", () => {
    render(<QueryGoal value="A" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox", { name: "" })).toHaveValue("A");
  });

  it("reports goal changes to the parent", () => {
    const onChange = vi.fn();
    render(<QueryGoal value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText(/enter goal/i);
    fireEvent.change(input, { target: { value: "B" } });

    expect(onChange).toHaveBeenCalledWith("B");
  });

  it("disables the input while a request is running", () => {
    render(<QueryGoal value="A" onChange={vi.fn()} disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});