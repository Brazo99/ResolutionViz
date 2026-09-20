import { useNavigate } from "react-router-dom";

export default function DocsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#051a2b] text-[#f5e6c8]">
      {/* Header */}
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

      {/* Content */}
      <main className="mx-auto max-w-4xl px-8 py-12 md:px-12 md:py-16">
        <h1 className="font-black text-4xl uppercase leading-tight tracking-tight md:text-5xl">
          How to Use
        </h1>

        <p className="mt-6 text-lg font-light text-[#f5e6c8]/80 md:text-xl">
          A short guide to entering formulas, running the resolution
          algorithm, and reading the proof visualisation.
        </p>

        {/* 1 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            1. Enter a Knowledge Base
          </h2>
          <p className="mt-4 leading-relaxed text-[#f5e6c8]/80">
            The knowledge base is your set of facts and rules. Each formula
            goes on its own line. Formulas are validated as you type, if
            something is wrong, an error appears above the line with a
            description of the problem.
          </p>
          <div className="mt-4 rounded-lg border border-[#f5e6c8]/10 bg-[#0c2a44] p-4 font-mono text-sm text-[#7db4d1]">
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
          <p className="mt-4 leading-relaxed text-[#f5e6c8]/80">
            The goal is what you want to prove. The tool negates the goal,
            adds it to the knowledge base, and attempts to derive a
            contradiction. If a contradiction is found, the goal is proven.
          </p>
          <div className="mt-4 rounded-lg border border-[#f5e6c8]/10 bg-[#0c2a44] p-4 font-mono text-sm text-[#7db4d1]">
            Q
          </div>
        </section>

        {/* 3 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            3. Run the Check
          </h2>
          <p className="mt-4 leading-relaxed text-[#f5e6c8]/80">
            Click{" "}
            <span className="font-mono text-[#7db4d1]">
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
          <p className="mt-4 leading-relaxed text-[#f5e6c8]/80">
            Each node is a clause. Edges connect a resolvent to its two
            parent clauses. The pivot literal being eliminated is shown on
            the edge.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-[#f5e6c8]/80">
            <li>
              <span className="font-semibold">Grey nodes</span> — clauses
              from the original knowledge base.
            </li>
            <li>
              <span className="font-semibold">Blue nodes</span> — resolvents
              produced during the proof.
            </li>
            <li>
              <span className="font-semibold">Green node</span> — the empty
              clause, marking a contradiction.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            5. Playback Controls
          </h2>
          <p className="mt-4 leading-relaxed text-[#f5e6c8]/80">
            Use the controls below the graph to step through the proof one
            resolution at a time, or hit play to animate it.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-[#f5e6c8]/80">
            <li>
              <span className="font-semibold">Play / Pause</span> — animate
              the derivation.
            </li>
            <li>
              <span className="font-semibold">Step back</span> — return to
              the previous clause.
            </li>
            <li>
              <span className="font-semibold">Step forward</span> — advance
              one resolution step.
            </li>
          </ul>
        </section>

        {/* 6 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">
            6. Formula Syntax
          </h2>
          <p className="mt-4 leading-relaxed text-[#f5e6c8]/80">
            Variables are uppercase letters{" "}
            <span className="font-mono text-[#7db4d1]">P</span>,{" "}
            <span className="font-mono text-[#7db4d1]">Q</span>,{" "}
            <span className="font-mono text-[#7db4d1]">R</span>{" "}
            and operators are combined with parentheses.
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-[#f5e6c8]/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0c2a44] text-[#f5e6c8]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Operator</th>
                  <th className="px-4 py-3 font-semibold">Meaning</th>
                  <th className="px-4 py-3 font-semibold">Example</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[#f5e6c8]/80">
                <tr className="border-t border-[#f5e6c8]/10">
                  <td className="px-4 py-3 text-[#7db4d1]">~</td>
                  <td className="px-4 py-3">negation</td>
                  <td className="px-4 py-3">~P</td>
                </tr>
                <tr className="border-t border-[#f5e6c8]/10">
                  <td className="px-4 py-3 text-[#7db4d1]">&amp;</td>
                  <td className="px-4 py-3">conjunction</td>
                  <td className="px-4 py-3">P &amp; Q</td>
                </tr>
                <tr className="border-t border-[#f5e6c8]/10">
                  <td className="px-4 py-3 text-[#7db4d1]">|</td>
                  <td className="px-4 py-3">disjunction</td>
                  <td className="px-4 py-3">P | Q</td>
                </tr>
                <tr className="border-t border-[#f5e6c8]/10">
                  <td className="px-4 py-3 text-[#7db4d1]">-&gt;</td>
                  <td className="px-4 py-3">implication</td>
                  <td className="px-4 py-3">P -&gt; Q</td>
                </tr>
                <tr className="border-t border-[#f5e6c8]/10">
                  <td className="px-4 py-3 text-[#7db4d1]">&lt;-&gt;</td>
                  <td className="px-4 py-3">biconditional</td>
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
          <p className="mt-4 leading-relaxed text-[#f5e6c8]/80">
            The toolbar at the top of the left panel lets you create, rename,
            load, and delete knowledge bases. You can also export the current
            knowledge base to a text file and import one back in.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-16 border-t border-[#f5e6c8]/10 pt-10">
          <button
            onClick={() => navigate("/app")}
            className="rounded-full border-2 border-[#051a2b]/60 bg-gradient-to-b from-[#7db4d1] to-[#5f9ec0] px-10 py-3 text-xl font-black uppercase tracking-wider text-[#0c3a5e] shadow-md transition hover:from-[#8cc0da] hover:to-[#6faed0] active:scale-95 md:text-2xl"
          >
            Start
          </button>
        </div>
      </main>
    </div>
  );
}