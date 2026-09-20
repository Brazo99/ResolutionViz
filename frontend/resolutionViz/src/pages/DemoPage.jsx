import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------
 * Static, non-interactive demo.
 * No API calls, no state, no handlers — just a rendered example of what
 * the app produces for KB = {P -> Q, P}, goal = Q.
 * ------------------------------------------------------------------------- */

const KB_FORMULAS = ["P -> Q", "P"];
const GOAL = "Q";

const INITIAL_CLAUSES = ["¬P ∨ Q", "P"];
const NEGATED_GOAL = ["¬Q"];

const PROOF_STEPS = [
  { id: "s1", label: "¬P ∨ Q", kind: "kb" },
  { id: "s2", label: "P",       kind: "kb" },
  { id: "s3", label: "¬Q",      kind: "goal" },
  { id: "s4", label: "Q",       kind: "resolvent", note: "resolve s1 + s2 on P" },
  { id: "s5", label: "□",       kind: "empty",    note: "resolve s4 + s3 on Q" },
];

const NODE_STYLES = {
  kb:        "border-[#f5e6c8]/25 bg-[#0c2a44] text-[#f5e6c8]",
  goal:      "border-[#7db4d1]/40 bg-[#0c3a5e] text-[#f5e6c8]",
  resolvent: "border-[#7db4d1]/50 bg-[#7db4d1]/15 text-[#7db4d1]",
  empty:     "border-emerald-400/60 bg-emerald-400/15 text-emerald-300",
};

function ClauseNode({ label, kind }) {
  return (
    <span
      className={`inline-block rounded-md border px-3 py-1.5 font-mono text-sm ${NODE_STYLES[kind]}`}
    >
      {label}
    </span>
  );
}

export default function DemoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#051a2b] text-[#f5e6c8]">
      {/* Header — same pattern as DocsPage */}
      <header className="flex items-center justify-between border-b border-[#f5e6c8]/10 px-8 py-5 md:px-12">
        <button
          onClick={() => navigate("/")}
          className="text-xl font-black uppercase tracking-tight text-[#f5e6c8] transition hover:text-[#7db4d1] md:text-2xl"
        >
          Resolution Visualizer
        </button>

        <button
          onClick={() => navigate("/app")}
          className="rounded-full border-2 border-[#051a2b]/60 bg-gradient-to-b from-[#7db4d1] to-[#5f9ec0] px-6 py-2 text-base font-black uppercase tracking-wider text-[#0c3a5e] shadow-md transition hover:from-[#8cc0da] hover:to-[#6faed0] active:scale-95 md:px-8 md:text-lg"
        >
          Start
        </button>
      </header>

      {/* Content — same container as DocsPage */}
      <main className="mx-auto max-w-4xl px-8 py-12 md:px-12 md:py-16">
        <h1 className="font-black text-4xl uppercase leading-tight tracking-tight md:text-5xl">
          Demo
        </h1>

        <p className="mt-6 text-lg font-light text-[#f5e6c8]/80 md:text-xl">
          A static example. Nothing on this page is interactive, it shows
          what the tool produces for a known proof.
        </p>

        {/* 1. Input */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            1. Input
          </h2>
          <p className="mt-4 leading-relaxed text-[#f5e6c8]/80">
            The knowledge base is{" "}
            <span className="font-mono text-[#7db4d1]">{"{ P -> Q, P }"}</span>{" "}
            and the goal is{" "}
            <span className="font-mono text-[#7db4d1]">Q</span>.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#f5e6c8]/10 bg-[#0c2a44] p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#f5e6c8]/60">
                Knowledge Base
              </p>
              <pre className="font-mono text-sm text-[#7db4d1]">
                {KB_FORMULAS.join("\n")}
              </pre>
            </div>

            <div className="rounded-lg border border-[#f5e6c8]/10 bg-[#0c2a44] p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#f5e6c8]/60">
                Goal
              </p>
              <pre className="font-mono text-sm text-[#7db4d1]">{GOAL}</pre>
            </div>
          </div>
        </section>

        {/* 2. Clauses */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            2. Clauses
          </h2>
          <p className="mt-4 leading-relaxed text-[#f5e6c8]/80">
            The knowledge base is converted to CNF, and the goal is negated
            and added to the clause set.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {INITIAL_CLAUSES.map((c) => (
              <ClauseNode key={c} label={c} kind="kb" />
            ))}
            {NEGATED_GOAL.map((c) => (
              <ClauseNode key={c} label={c} kind="goal" />
            ))}
          </div>
        </section>

        {/* 3. Proof */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            3. Proof
          </h2>
          <p className="mt-4 leading-relaxed text-[#f5e6c8]/80">
            Set-of-support resolution derives the empty clause in two steps.
          </p>

          <ol className="mt-4 space-y-3">
            {PROOF_STEPS.map((step, i) => (
              <li
                key={step.id}
                className="flex items-center gap-4 rounded-lg border border-[#f5e6c8]/10 bg-[#0c2a44]/60 px-4 py-3"
              >
                <span className="w-6 shrink-0 font-mono text-sm text-[#f5e6c8]/50">
                  {i + 1}
                </span>
                <ClauseNode label={step.label} kind={step.kind} />
                {step.note && (
                  <span className="ml-auto text-xs text-[#f5e6c8]/60">
                    {step.note}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* 4. Verdict */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            4. Verdict
          </h2>

          <div className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#f5e6c8]">
                Verification Result
              </span>
              <span className="h-4 w-px bg-[#f5e6c8]/20" />
              <span className="ml-auto inline-flex items-center rounded-md border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-300">
                Unsatisfiable
              </span>
            </div>
            <p className="mt-2 text-sm text-[#f5e6c8]/70">
              The negation of the goal leads to the empty clause, so the goal{" "}
              <span className="font-mono text-[#7db4d1]">Q</span> follows from
              the knowledge base.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 border-t border-[#f5e6c8]/10 pt-10">
          <button
            onClick={() => navigate("/app")}
            className="rounded-full border-2 border-[#051a2b]/60 bg-gradient-to-b from-[#7db4d1] to-[#5f9ec0] px-10 py-3 text-xl font-black uppercase tracking-wider text-[#0c3a5e] shadow-md transition hover:from-[#8cc0da] hover:to-[#6faed0] active:scale-95 md:text-2xl"
          >
            Try It Yourself
          </button>
        </div>
      </main>
    </div>
  );
}