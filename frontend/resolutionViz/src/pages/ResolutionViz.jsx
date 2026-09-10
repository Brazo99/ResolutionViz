import Header from "../components/Header";
import KBToolbar from "../components/KBToolbar";
import AnnotationsPanel from "../components/AnnotationsPanel";
import KnowledgeBase from "../components/KnowledgeBase";
import QueryGoal from "../components/QueryGoal";
import SatisfiabilityButton from "../components/SatisfiabilityButton";
import ResolutionPanel from "../components/ProofTree/ResolutionPanel";

import { useState, useEffect } from "react";
import { checkSatisfiability } from "../api/resolution";

export default function ResolutionPage() {
  const [annotations, setAnnotations] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [goal, setGoal] = useState("");
  const [resolutionResult, setResolutionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [savedKBs, setSavedKBs] = useState([]);
  const [currentKBName, setCurrentKBName] = useState("New KB");
  const [currentKBID, setCurrentKBID] = useState(null);


  const handleCreateNewKB = () => {
    const newKB = {
      id: Date.now(),
      name: "New KB", // Default name
      annotations: annotations,
      knowledgeBase: knowledgeBase,
    };

    setSavedKBs([...savedKBs, newKB]);
    setCurrentKBID(newKB.id);
    setCurrentKBName("New KB"); 
    setAnnotations(""); 
    setKnowledgeBase("");
    setError(null);
  };

  const handleLoadKB = (kb) => {
    setAnnotations(kb.annotations || "");
    setKnowledgeBase(kb.knowledgeBase || "");
    setCurrentKBName(kb.name);
    setCurrentKBID(kb.id);
    setError(null);
  };

  const handleDeleteKB = (kbToDelete) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${kbToDelete.name}"?`);
    if (!confirmDelete) return;

    const updatedKBs = savedKBs.filter(kb => kb.id !== kbToDelete.id);
    setSavedKBs(updatedKBs);

    if (currentKBID === kbToDelete.id) {
      setCurrentKBID(null);
      setCurrentKBName("New KB");
      setAnnotations("");
      setKnowledgeBase("");
      setError(null);
    }
  };

  const handleSaveKBName = () => {
    const trimmedName = currentKBName.trim() || "New KB";
    setCurrentKBName(trimmedName);
    
    if (currentKBID) {
      setSavedKBs(prevKBs => 
        prevKBs.map(kb => 
          kb.id === currentKBID ? { ...kb, name: trimmedName } : kb
        )
      );
    }
};

  const handleRenameKB = (newName) => {
      setCurrentKBName(newName);
  };

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

  const handleCheckSatisfiability = async () => {
    setError(null);
    setResolutionResult(null);
    setIsLoading(true);

    try {
      const result = await checkSatisfiability(knowledgeBase, goal);
      setResolutionResult(result);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseKB = (kb) => {
    setAnnotations(prev => {
      const newContent = kb.annotations || "";
      if (!prev.trim()) return newContent;
      if (!newContent.trim()) return prev;
      return prev + '\n' + newContent;
    });

  setKnowledgeBase(prev => {
      const newContent = kb.knowledgeBase || "";
      if (!prev.trim()) return newContent;
      if (!newContent.trim()) return prev;
      return prev + '\n' + newContent;
    });


    // Close dropdown
    document.activeElement.blur();
  };

  return (
    <>
      <Header />
      <main className="fixed inset-x-0 top-[57px] bottom-0 overflow-hidden bg-slate-900">
        <div className="grid h-full grid-cols-[500px_minmax(0,1fr)]">
          <aside className="grid h-full min-h-0 grid-rows-[auto_1fr_auto_auto] gap-3 overflow-hidden border-r border-slate-800 bg-slate-900 p-5">
            
            <KBToolbar
              onImport={handleImportKB}
              onExport={handleExportKB}
              currentKBName={currentKBName}
              savedKBs={savedKBs}
              onCreateNewKB={handleCreateNewKB}
              onLoadKB={handleLoadKB}
              onDeleteKB={handleDeleteKB}
              onRenameKB={handleRenameKB}
              onSaveKBName={handleSaveKBName}
              hasContent={knowledgeBase.trim().length > 0}
            />

            <div className="grid min-h-0 grid-rows-[40%_60%] gap-3">
              <AnnotationsPanel 
                value={annotations} 
                onChange={setAnnotations} 
                savedKBs={savedKBs}
                onUseKB={handleUseKB}
                />
              <KnowledgeBase value={knowledgeBase} onChange={setKnowledgeBase}/>
            </div>

            <QueryGoal value={goal} onChange={setGoal} />

            <SatisfiabilityButton
              onClick={handleCheckSatisfiability}
              isLoading={isLoading}
            />
          </aside>

          <section className="grid h-full grid-rows-[1fr] gap-5 overflow-hidden bg-slate-950 p-5">
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