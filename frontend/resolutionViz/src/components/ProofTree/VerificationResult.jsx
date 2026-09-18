import { CircleCheckBig, CircleX } from "lucide-react";

export default function VerificationResult({ isSatisfiable }) {
  return (
    <div className={`w-full rounded-xl border px-4 py-3 ${isSatisfiable
        ? "border-success/40 bg-success/10"
        : "border-error/40 bg-error/10"
        }`
    }>
      <div className="flex items-center gap-3">
        {/* Icon */}
        {isSatisfiable ? (
          <CircleCheckBig className="w-5 h-5 text-success shrink-0" />
        ) : (
          <CircleX className="w-5 h-5 text-error shrink-0" />
        )}

        {/* Label */}
        <span className="text-sm font-semibold text-base-content whitespace-nowrap">
          Verification Result
        </span>

        {/* Divider between label and badge */}
        <span className="h-4 w-px bg-base-300" />

        {/* Badge */}
        <span
          className={`ml-auto inline-flex items-center px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${
            isSatisfiable
              ? "bg-success/15 text-success border border-success/40"
              : "bg-error/15 text-error border border-error/40"
          }`}
        >
          {isSatisfiable ? "Satisfiable" : "Unsatisfiable"}
        </span>
      </div>
    </div>
  );
}