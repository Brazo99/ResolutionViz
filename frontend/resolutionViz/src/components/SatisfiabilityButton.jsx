import { CircleArrowRight } from "lucide-react";

export default function SatisfiabilityButton({ onClick, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="btn btn-primary h-14 w-full rounded-2xl text-xl disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <span className="text-2xl">
        <CircleArrowRight/>
      </span>
      {isLoading ? "Checking..." : "Check Satisfiability"}
    </button>
  );
}