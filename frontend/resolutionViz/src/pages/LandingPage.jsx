import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-2">
      {/* Left panel */}
      <div className="relative flex flex-col justify-between bg-[#0c3a5e] px-8 py-8 md:px-12 md:py-10">
        <div>
          <h1 className="font-black text-4xl leading-[0.95] tracking-tight text-[#f5e6c8] uppercase sm:text-5xl lg:text-6xl">
            Resolution
            <br />
            Visualization
          </h1>

          <p className="mt-5 text-lg font-light tracking-wide text-[#f5e6c8] uppercase md:mt-6 md:text-2xl">
            Educative Tool
          </p>

          <button
            onClick={() => navigate("/app")}
            className="mt-10 block rounded-full border-2 border-[#0c3a5e]/60 bg-gradient-to-b from-[#7db4d1] to-[#5f9ec0] px-8 py-2 text-xl font-black tracking-wider text-[#0c3a5e] uppercase shadow-md transition hover:from-[#8cc0da] hover:to-[#6faed0] active:scale-95 md:mt-12 md:px-10 md:py-2.5 md:text-2xl"
          >
            Start
          </button>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="flex items-center gap-2 rounded-full border-2 border-[#0c3a5e]/60 bg-gradient-to-b from-[#7db4d1] to-[#5f9ec0] px-6 py-2 text-xl font-black tracking-wider text-[#0c3a5e] uppercase shadow-md transition hover:from-[#8cc0da] hover:to-[#6faed0] active:scale-95 md:px-8 md:py-2.5 md:text-2xl"
            >
              <BookOpen size={24} />
              Docs
            </button>
          </div>
        </div>

        <p className="font-serif text-lg font-bold text-[#f5e6c8] md:text-xl">
          Est. 2026
        </p>
      </div>

      {/* Right panel — photo with dark blue tint */}
      <div className="relative h-full min-h-[40vh] bg-[#0c3a5e]">
        <img
          src="/student.jpg"
          alt="Student working on resolution proofs"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0c3a5e]/70" />
      </div>
    </div>
  );
}