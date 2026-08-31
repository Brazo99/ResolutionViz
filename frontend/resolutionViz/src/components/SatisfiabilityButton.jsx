export default function SatisfiabilityButton({ onClick, isLoading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full rounded-lg px-4 py-2.5 font-medium transition-all duration-200
        ${isLoading
          ? 'bg-slate-700 cursor-not-allowed text-slate-400'
          : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40'
        }
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Checking...
        </span>
      ) : (
        'Check Satisfiability'
      )}
    </button>
  );
}