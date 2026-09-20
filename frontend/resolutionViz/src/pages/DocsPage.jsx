import { useNavigate } from "react-router-dom";

export default function DocsPage() {
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
            How to Use
          </h1>

          <p className="mt-6 text-lg font-light leading-relaxed text-base-content/60 md:text-xl">
            A short guide to entering formulas, running the resolution
            algorithm, and reading the proof visualisation.
          </p>
        </div>

        {/* 1 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            1. Enter a Knowledge Base
          </h2>

          <p className="mt-4 leading-relaxed text-base-content/70">
            The knowledge base is your set of facts and rules. Each formula
            goes on its own line. Formulas are validated as you type. If
            something is wrong, an error appears above the line with a
            description of the problem.
          </p>

          <div className="mt-4 rounded-lg border border-base-300 bg-base-200 p-4 font-mono text-sm text-primary">
            P -&gt; Q
            <br />
            P
          </div>
        </section>

        {/* 2 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            2. Set a Query Goal
          </h2>

          <p className="mt-4 leading-relaxed text-base-content/70">
            The goal is what you want to prove. The tool negates the goal,
            adds it to the knowledge base, and attempts to derive a
            contradiction. If a contradiction is found, the goal follows from
            the knowledge base.
          </p>

          <div className="mt-4 rounded-lg border border-base-300 bg-base-200 p-4 font-mono text-sm text-primary">
            Q
          </div>
        </section>

        {/* 3 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            3. Run the Check
          </h2>

          <p className="mt-4 leading-relaxed text-base-content/70">
            Click{" "}
            <span className="font-mono text-primary">
              Check Satisfiability
            </span>
            . The backend converts everything to conjunctive normal form,
            runs resolution, and returns each resolution step. While the
            request is running, all inputs are disabled.
          </p>
        </section>

        {/* 4 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            4. Read the Proof Graph
          </h2>

          <p className="mt-4 leading-relaxed text-base-content/70">
            Each node is a clause. Edges connect a resolvent to its two parent
            clauses. The pivot literal being eliminated is shown on the edge.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-base-content/70">
            <li>
              <span className="font-semibold text-base-content">
                Grey nodes
              </span>{" "}
              — clauses from the original knowledge base.
            </li>

            <li>
              <span className="font-semibold text-primary">Blue nodes</span>{" "}
              — resolvents produced during the proof.
            </li>

            <li>
              <span className="font-semibold text-success">Green node</span>{" "}
              — the empty clause, marking a contradiction.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            5. Playback Controls
          </h2>

          <p className="mt-4 leading-relaxed text-base-content/70">
            Use the controls below the graph to step through the proof one
            resolution at a time, or hit play to animate it.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-base-content/70">
            <li>
              <span className="font-semibold text-base-content">
                Play / Pause
              </span>{" "}
              — animate the derivation.
            </li>

            <li>
              <span className="font-semibold text-base-content">
                Step back
              </span>{" "}
              — return to the previous clause.
            </li>

            <li>
              <span className="font-semibold text-base-content">
                Step forward
              </span>{" "}
              — advance one resolution step.
            </li>
          </ul>
        </section>

        {/* 6 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            6. Formula Syntax
          </h2>

          <p className="mt-4 leading-relaxed text-base-content/70">
            Variables are uppercase letters{" "}
            <span className="font-mono text-primary">P</span>,{" "}
            <span className="font-mono text-primary">Q</span>,{" "}
            <span className="font-mono text-primary">R</span> and operators
            are combined with parentheses.
          </p>

          <div className="mt-4 overflow-hidden rounded-lg border border-base-300">
            <table className="w-full text-left text-sm">
              <thead className="bg-base-200 text-base-content">
                <tr>
                  <th className="px-4 py-3 font-semibold">Operator</th>
                  <th className="px-4 py-3 font-semibold">Meaning</th>
                  <th className="px-4 py-3 font-semibold">Example</th>
                </tr>
              </thead>

              <tbody className="font-mono text-base-content/70">
                <tr className="border-t border-base-300">
                  <td className="px-4 py-3 text-primary">~</td>
                  <td className="px-4 py-3 font-sans">negation</td>
                  <td className="px-4 py-3">~P</td>
                </tr>

                <tr className="border-t border-base-300">
                  <td className="px-4 py-3 text-primary">&amp;</td>
                  <td className="px-4 py-3 font-sans">conjunction</td>
                  <td className="px-4 py-3">P &amp; Q</td>
                </tr>

                <tr className="border-t border-base-300">
                  <td className="px-4 py-3 text-primary">|</td>
                  <td className="px-4 py-3 font-sans">disjunction</td>
                  <td className="px-4 py-3">P | Q</td>
                </tr>

                <tr className="border-t border-base-300">
                  <td className="px-4 py-3 text-primary">-&gt;</td>
                  <td className="px-4 py-3 font-sans">implication</td>
                  <td className="px-4 py-3">P -&gt; Q</td>
                </tr>

                <tr className="border-t border-base-300">
                  <td className="px-4 py-3 text-primary">&lt;-&gt;</td>
                  <td className="px-4 py-3 font-sans">biconditional</td>
                  <td className="px-4 py-3">P &lt;-&gt; Q</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 7 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            7. Saving and Loading
          </h2>

          <p className="mt-4 leading-relaxed text-base-content/70">
            The toolbar at the top of the left panel lets you create, rename,
            load, and delete knowledge bases. You can also export the current
            knowledge base to a text file and import one back in.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-16 border-t border-base-300 pt-10">
          <button
            onClick={() => navigate("/app")}
            className="rounded-full bg-primary px-10 py-3 text-xl font-black uppercase tracking-wider text-primary-content shadow-md transition hover:opacity-90 active:scale-95 md:text-2xl"
          >
            Start
          </button>
        </div>
      </main>
    </div>
  );
}
