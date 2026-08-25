export default function SatisfiabilityButton({
  onCheck
}) {
  return (
    <button
      onClick={onCheck}
      className="btn btn-primary h-14 w-full rounded-2xl text-xl"
    >
      <span className="text-2xl">▷</span>
      Check Satisfiability
    </button>
  );
}