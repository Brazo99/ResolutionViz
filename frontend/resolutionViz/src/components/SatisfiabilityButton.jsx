import { CircleArrowRight } from "lucide-react";
export default function SatisfiabilityButton({
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className="btn btn-primary h-14 w-full rounded-2xl text-xl"
    >
      <span className="text-2xl">
        <CircleArrowRight/>
      </span>
      Check Satisfiability
    </button>
  );
}