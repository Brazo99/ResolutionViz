
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
  { id: "s2", label: "P", kind: "kb" },
  { id: "s3", label: "¬Q", kind: "goal" },
  { id: "s4", label: "Q", kind: "resolvent", note: "resolve s1 + s2 on P" },
  { id: "s5", label: "□", kind: "empty", note: "resolve s4 + s3 on Q" },
];

const NODE_STYLES = {
  kb: "border-base-300 bg-base-200 text-base-content",
  goal: "border-primary/40 bg-primary/10 text-primary",
  resolvent: "border-primary/50 bg-primary/10 text-primary",
  empty: "border-success/50 bg-success/10 text-success",
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
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-base-300 bg-base-200 px-8 py-5 md:px-12">
        <button
          onClick={() => navigate("/")}
          className="text-xl font-black uppercase tracking-tight text-base-content transition hover:text-primary md:text-2xl"
        >
          Resolution Visualizer
        </button>

        <button
          onClick={() => navigate("/app")}
          className="rounded-full bg-primary px-6 py-2 text-base font-black uppercase tracking-wider text-primary-content shadow-md transition hover:opacity-90 active:scale-95 md:px-8 md:text-lg"
        >
          Start
        </button>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-8 py-12 md:px-12 md:py-16">
        {/* Page heading */}
        <div>
          <h1 className="text-4xl font-black uppercase leading-tight tracking-tight md:text-5xl">
            Demo
          </h1>

          <p className="mt-6 text-lg font-light leading-relaxed text-base-content/60 md:text-xl">
            A static example showing what the tool produces for a known
            resolution proof.
          </p>
        </div>

        {/* 1. Input */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            1. Input
          </h2>

          <p className="mt-4 leading-relaxed text-base-content/70">
            The knowledge base is{" "}
            <span className="font-mono text-primary">
              {"{ P -> Q, P }"}
            </span>{" "}
            and the goal is{" "}
            <span className="font-mono text-primary">{GOAL}</span>.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-base-300 bg-base-200 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                Knowledge Base
              </p>

              <pre className="font-mono text-sm text-primary">
                {KB_FORMULAS.join("\n")}
              </pre>
            </div>

            <div className="rounded-lg border border-base-300 bg-base-200 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                Goal
              </p>

              <pre className="font-mono text-sm text-primary">
                {GOAL}
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Clauses */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            2. Clauses
          </h2>

          <p className="mt-4 leading-relaxed text-base-content/70">
            The knowledge base is converted to CNF, and the goal is negated
            and added to the clause set.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {INITIAL_CLAUSES.map((clause) => (
              <ClauseNode key={clause} label={clause} kind="kb" />
            ))}

            {NEGATED_GOAL.map((clause) => (
              <ClauseNode key={clause} label={clause} kind="goal" />
            ))}
          </div>
        </section>

        {/* 3. Proof */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            3. Proof
          </h2>

          <p className="mt-4 leading-relaxed text-base-content/70">
            Set-of-support resolution derives the empty clause, showing that
            the negated goal is inconsistent with the knowledge base.
          </p>

          <ol className="mt-4 space-y-3">
            {PROOF_STEPS.map((step, index) => (
              <li
                key={step.id}
                className="flex items-center gap-4 rounded-lg border border-base-300 bg-base-200/60 px-4 py-3"
              >
                <span className="w-6 shrink-0 font-mono text-sm text-base-content/40">
                  {index + 1}
                </span>

                <ClauseNode label={step.label} kind={step.kind} />

                {step.note && (
                  <span className="ml-auto text-right text-xs text-base-content/50">
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

          <div className="mt-4 rounded-xl border border-success/40 bg-success/10 px-4 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-base-content">
                Verification Result
              </span>

              <span className="h-4 w-px bg-base-content/20" />

              <span className="ml-auto inline-flex items-center rounded-md border border-success/40 bg-success/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-success">
                Proven
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-base-content/60">
              The negation of the goal leads to the empty clause, so the goal{" "}
              <span className="font-mono text-primary">Q</span> follows from
              the knowledge base.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 border-t border-base-300 pt-10">
          <button
            onClick={() => navigate("/app")}
            className="rounded-full bg-primary px-10 py-3 text-xl font-black uppercase tracking-wider text-primary-content shadow-md transition hover:opacity-90 active:scale-95 md:text-2xl"
          >
            Try It Yourself
          </button>
        </div>
      </main>
    </div>
  );
}
