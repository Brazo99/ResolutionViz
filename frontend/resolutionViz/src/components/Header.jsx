import { RotateCcw, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({ onReset }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("resolution.theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("resolution.theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  const handleReset = () => {
    if (!onReset) return;

    const ok = window.confirm(
      "Reset everything? This will delete all saved knowledge bases, annotations, and the knowledge base editor content."
    );

    if (ok) onReset();
  };

  return (
    <header className="navbar h-[57px] min-h-0 border-b border-base-300 bg-base-100 px-5">
      {/* Left */}
      <div className="navbar-start flex items-center gap-3">
        <span className="text-lg font-bold text-base-content">
          ResolutionViz
        </span>
      </div>

      {/* Right */}
      <div className="navbar-end flex items-center gap-2">
        <button
          onClick={handleReset}
          className="btn btn-sm btn-ghost text-base-content/60 hover:text-error"
          title="Reset all data (KB, annotations, saved KBs)"
          aria-label="Reset all data"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={toggleTheme}
          className="btn btn-sm btn-ghost btn-circle"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>
      </div>
    </header>
  );
}