import Header from "../components/Header";
import KBToolbar from "../components/KBToolbar";
import AnnotationsPanel from "../components/AnnotationsPanel";
import KnowledgeBase from "../components/KnowledgeBase";
import QueryGoal from "../components/QueryGoal";
import SatisfiabilityButton from "../components/SatisfiabilityButton";
import ResolutionPanel from "../components/ProofTree/ResolutionPanel";

import { useState} from "react";;
import { checkSatisfiability } from "../api/resolution";

export default function ResolutionPage() {
  const [annotations, setAnnotations] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [goal, setGoal] = useState("");
  const [resolutionResult, setResolutionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== IMPORT / EXPORT HANDLERS =====

  const handleImportKB = (lines) => {
    setKnowledgeBase(lines.join('\n'));
    setError(null);
  };

  const handleExportKB = () => {
    if (!knowledgeBase || knowledgeBase.trim() === '') {
      alert('Knowledge base is empty. Nothing to export.');
      return;
    }

    const lines = knowledgeBase.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knowledge_base.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportResult = () => {
    if (!resolutionResult) {
      alert('No resolution result to export. Please run Check Satisfiability first.');
      return;
    }
    
    const json = JSON.stringify(resolutionResult, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resolution_result.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Clear all inputs and results?')) {
      setKnowledgeBase('');
      setGoal('');
      setAnnotations('');
      setResolutionResult(null);
      setError(null);
    }
  };

  // ===== CHECK SATISFIABILITY =====

  const handleCheckSatisfiability = async () => {
    // Clear previous results
    setError(null);
    setResolutionResult(null);

    // Validate: Knowledge base not empty
    if (!knowledgeBase || knowledgeBase.trim() === '') {
      const msg = '❌ Knowledge base cannot be empty.';
      setError(msg);
      setAnnotations(msg);
      return;
    }

    // Validate: Goal not empty
    if (!goal || goal.trim() === '') {
      const msg = '❌ Query goal cannot be empty.';
      setError(msg);
      setAnnotations(msg);
      return;
    }

    // Validate each formula in knowledge base
    const formulas = knowledgeBase.split('\n').filter(line => line.trim() !== '');
    for (const f of formulas) {
      if (!validateFormula(f.trim())) {
        const msg = `❌ Invalid formula: "${f.trim()}"\nCheck for unbalanced parentheses.`;
        setError(msg);
        setAnnotations(msg);
        return;
      }
    }

    // Validate goal formula
    if (!validateFormula(goal.trim())) {
      const msg = `❌ Invalid goal: "${goal.trim()}"\nCheck for unbalanced parentheses.`;
      setError(msg);
      setAnnotations(msg);
      return;
    }

    setIsLoading(true);
    setAnnotations('⏳ Checking satisfiability...');

    try {
      const result = await checkSatisfiability(knowledgeBase, goal);
      console.log("Response from backend:", result);

      setResolutionResult(result);

      // Build annotation message
      let resultMessage = '';
      if (result.steps && result.steps.length > 0) {
        resultMessage = `=== Resolution Result ===\n\n`;
        resultMessage += `Goal: ${goal}\n`;
        resultMessage += `Result: ${result.is_satisfiable || (result.result ? 'SATISFIABLE' : 'UNSATISFIABLE')}\n`;
        resultMessage += `Steps: ${result.steps.length} resolution step(s)\n\n`;
        resultMessage += `--- Resolution Steps ---\n`;
        result.steps.forEach((step, i) => {
          resultMessage += `Step ${i + 1}: Resolving clauses on pivot '${step.pivot || '?'}'\n`;
        });
        resultMessage += `\n✅ Done.`;
      } else {
        resultMessage = `✅ Result: ${result.is_satisfiable || (result.result ? 'SATISFIABLE' : 'UNSATISFIABLE')}`;
      }

      setAnnotations(resultMessage);
      setError(null);

    } catch (err) {
      console.error("Resolution failed:", err);
      const errorMsg = `❌ Error: ${err.message || 'Failed to check satisfiability. Is the backend running?'}`;
      setError(errorMsg);
      setAnnotations(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ===== KEYBOARD SHORTCUTS =====

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Enter (or Cmd + Enter on Mac) to check satisfiability
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCheckSatisfiability();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [knowledgeBase, goal]);

  // ===== RENDER =====

  const status = getStatusBadge();

  return (
    <>
      <Header />
      <main className="fixed inset-x-0 top-[57px] bottom-0 overflow-hidden bg-slate-900">
        <div className="grid h-full grid-cols-[500px_minmax(0,1fr)]">
          {/* LEFT PANEL */}
          <aside className="grid h-full min-h-0 grid-rows-[auto_1fr_auto_auto] gap-3 overflow-hidden border-r border-slate-800 bg-slate-900 p-5">
            {/* Toolbar */}
            <KBToolbar
              onImport={handleImportKB}
              onExport={handleExportKB}
              onReset={handleReset}
              onExportResult={handleExportResult}
              hasContent={knowledgeBase.trim().length > 0}
              hasResult={!!resolutionResult}
            />

            {/* Main editor area */}
            <div className="grid min-h-0 grid-rows-[40%_60%] gap-3">
              <AnnotationsPanel value={annotations} onChange={setAnnotations}/>
              <KnowledgeBase value={knowledgeBase} onChange={setKnowledgeBase}/>
            </div>

            {/* Query Goal */}
            <QueryGoal value={goal} onChange={setGoal} />

            {/* Status Badge */}
            {status && (
              <div className={`text-center text-sm font-medium py-1 px-3 rounded ${status.className}`}>
                {status.text}
              </div>
            )}

            {/* Satisfiability Button */}
            <SatisfiabilityButton
              onClick={handleCheckSatisfiability}
              isLoading={isLoading}
            />

            {/* Keyboard Shortcut Hint */}
            <div className="text-xs text-slate-500 text-center mt-1">
              Press Ctrl+Enter to check satisfiability
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="grid h-full grid-rows-[1fr] gap-5 overflow-hidden bg-slate-900 p-5">
            <div className="min-h-0">
              <ResolutionPanel
                result={resolutionResult}
                error={error}
                isLoading={isLoading}
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}