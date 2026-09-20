import { useNavigate } from "react-router-dom";
import { BookOpen, PlayCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen grid-cols-1 bg-base-100 text-base-content md:grid-cols-2">
      {/* Left panel */}
      <section className="flex min-h-screen flex-col justify-between border-base-300 bg-base-200 px-8 py-8 md:border-r md:px-12 md:py-10">
        <div className="flex flex-col">
          {/* Title */}
          <div>
            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-base-content sm:text-5xl lg:text-6xl">
              Resolution
              <br />
              Visualization
            </h1>

            <p className="mt-5 text-lg font-light uppercase tracking-[0.18em] text-base-content/60 md:mt-6 md:text-2xl">
              Educative Tool
            </p>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-base-content/60 md:mt-7 md:text-base">
              Explore propositional logic through interactive set-of-support
              resolution and step-by-step proof visualization.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap md:mt-12">
            {/* Primary action */}
            <button
              onClick={() => navigate("/app")}
              className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-lg font-black uppercase tracking-wider text-primary-content shadow-md transition-all duration-200 hover:opacity-90 active:scale-95 md:px-10 md:py-3.5 md:text-xl"
            >
              Start
              <ArrowRight
                size={22}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

            {/* Secondary actions */}
            <button
              onClick={() => navigate("/docs")}
              className="flex items-center justify-center gap-2 rounded-full border border-base-300 bg-base-100 px-7 py-3 text-lg font-bold uppercase tracking-wider text-base-content transition-all duration-200 hover:bg-base-200 hover:border-base-content/20 active:scale-95 md:px-8 md:py-3.5 md:text-xl"
            >
              <BookOpen size={21} />
              Docs
            </button>

            <button
              onClick={() => navigate("/demo")}
              className="flex items-center justify-center gap-2 rounded-full border border-base-300 bg-base-100 px-7 py-3 text-lg font-bold uppercase tracking-wider text-base-content transition-all duration-200 hover:bg-base-200 hover:border-base-content/20 active:scale-95 md:px-8 md:py-3.5 md:text-xl"
            >
              <PlayCircle size={21} />
              Demo
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-base-content/40">
            Est. 2026
          </p>
        </div>
      </section>

      {/* Right panel */}
      <section className="relative min-h-[45vh] overflow-hidden bg-slate-950 md:min-h-screen">
        <img
          src="/student.jpg"
          alt="Student working on resolution proofs"
          className="h-full w-full object-cover"
        />

        {/* Dark overlay matching the application */}
        <div className="absolute inset-0 bg-slate-950/65" />

        {/* Subtle edge fade into the application background */}
        <div className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-base-200/30 to-transparent md:block" />

        {/* Image label */}
        <div className="absolute bottom-8 left-8 right-8 md:bottom-10 md:left-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
            Interactive Logic
          </p>

          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75 md:text-base">
            Learn how resolution derives new clauses and constructs proofs
            toward a contradiction.
          </p>
        </div>
      </section>
    </div>
  );
}
