<<<<<<< HEAD
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
=======
export default function SatisfiabilityButton({
  onCheck
}) {
  return (
    <button
      onClick={onCheck}
      className="btn btn-primary h-14 w-full rounded-2xl text-xl"
    >
      <span className="text-2xl">▷</span>
>>>>>>> b5cb877 (feat(frontend-layout): implement the unresponsive UI layout)
      Check Satisfiability
    </button>
  );
}