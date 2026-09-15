import { CircleArrowRight } from "lucide-react";

export default function SatisfiabilityButton({ onClick, isLoading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn btn-primary h-14 w-full rounded-2xl text-xl disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <span className="text-2xl">
        <CircleArrowRight/>
      </span>
      {isLoading ? "Checking..." : "Check Satisfiability"}
    </button>

  );
}
