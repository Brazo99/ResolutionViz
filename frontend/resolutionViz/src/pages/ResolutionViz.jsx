import Header from "../components/Header";
import KBToolbar from "../components/KBToolbar";
import AnnotationsPanel from "../components/AnnotationsPanel";
import KnowledgeBase from "../components/KnowledgeBase";
import QueryGoal from "../components/QueryGoal";
import SatisfiabilityButton from "../components/SatisfiabilityButton";
import ResolutionPanel from "../components/ProofTree/ResolutionPanel";
import { useState, useEffect, useCallback, useMemo } from "react";
import { checkSatisfiability } from "../api/resolution";

// localStorage
const LS_KEYS = {
  savedKBs: "resolution.savedKBs",
  currentKBID: "resolution.currentKBID",
  currentKBName: "resolution.currentKBName",
  annotations: "resolution.annotations",
  knowledgeBase: "resolution.knowledgeBase",
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now());

const hasContent = (a, k) => a.trim().length > 0 || k.trim().length > 0;

export default function ResolutionPage() {
  // persisted state
  const [annotations, setAnnotations] = useState(() => loadJSON(LS_KEYS.annotations, "") || "");
  const [knowledgeBase, setKnowledgeBase] = useState(() => loadJSON(LS_KEYS.knowledgeBase, "") || "");
  const [savedKBs, setSavedKBs] = useState(() => loadJSON(LS_KEYS.savedKBs, []) || []);
  const [currentKBName, setCurrentKBName] = useState(() => loadJSON(LS_KEYS.currentKBName, "New KB") || "New KB");
  const [currentKBID, setCurrentKBID] = useState(() => loadJSON(LS_KEYS.currentKBID, null));

  // transient state
  const [goal, setGoal] = useState("");
  const [resolutionResult, setResolutionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // persist each slice on change 
  useEffect(() => saveJSON(LS_KEYS.annotations, annotations), [annotations]);
  useEffect(() => saveJSON(LS_KEYS.knowledgeBase, knowledgeBase), [knowledgeBase]);
  useEffect(() => saveJSON(LS_KEYS.savedKBs, savedKBs), [savedKBs]);
  useEffect(() => saveJSON(LS_KEYS.currentKBName, currentKBName), [currentKBName]);
  useEffect(() => saveJSON(LS_KEYS.currentKBID, currentKBID), [currentKBID]);

  // autosave + auto-create current KB 
  useEffect(() => {
    const dirty = hasContent(annotations, knowledgeBase);
    if (!currentKBID && !dirty) return;

    setSavedKBs((prev) => {
      if (currentKBID) {
        // Avoid a no-op state update when nothing actually changed.
        const idx = prev.findIndex((kb) => kb.id === currentKBID);
        if (idx === -1) {
          // Current id refers to a KB that no longer exists, deleted.
          // Fall back to creating one below.
        } else {
          const existing = prev[idx];
          if (
            existing.name === currentKBName &&
            existing.annotations === annotations &&
            existing.knowledgeBase === knowledgeBase
          ) {
            return prev;
          }
          const updated = [...prev];
          updated[idx] = {
            ...existing,
            name: currentKBName,
            annotations,
            knowledgeBase,
          };
          return updated;
        }
      }

      // No current KB but there's content -> create one.
      const id = newId();
      queueMicrotask(() => setCurrentKBID(id));
      return [
        ...prev,
        {
          id,
          name: currentKBName || "New KB",
          annotations,
          knowledgeBase,
        },
      ];
    });
  }, [annotations, knowledgeBase, currentKBName, currentKBID]);

  // flush on tab close 
  useEffect(() => {
    const flush = () => {
      saveJSON(LS_KEYS.annotations, annotations);
      saveJSON(LS_KEYS.knowledgeBase, knowledgeBase);
      saveJSON(LS_KEYS.savedKBs, savedKBs);
      saveJSON(LS_KEYS.currentKBID, currentKBID);
      saveJSON(LS_KEYS.currentKBName, currentKBName);
    };
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [annotations, knowledgeBase, savedKBs, currentKBID, currentKBName]);

  const isDirty = useMemo(() => {
    if (!currentKBID) return hasContent(annotations, knowledgeBase);
    const kb = savedKBs.find((k) => k.id === currentKBID);
    if (!kb) return true;
    return (
      kb.name !== currentKBName ||
      kb.annotations !== annotations ||
      kb.knowledgeBase !== knowledgeBase
    );
  }, [savedKBs, currentKBID, currentKBName, annotations, knowledgeBase]);

  // Actions 
  // Explicit save: snapshot the current editor as a KB (creates one if
  // none is selected, even if empty — so a name can be reserved).
  const handleSaveKB = useCallback(() => {
    const name = (currentKBName || "").trim() || "New KB";
    const id = currentKBID || newId();
    setCurrentKBName(name);

    setSavedKBs((prev) => {
      const exists = prev.some((kb) => kb.id === id);
      const entry = { id, name, annotations, knowledgeBase };
      return exists
        ? prev.map((kb) => (kb.id === id ? entry : kb))
        : [...prev, entry];
    });

    if (!currentKBID) setCurrentKBID(id);
  }, [currentKBID, currentKBName, annotations, knowledgeBase]);

  const handleCreateNewKB = useCallback(() => {
    // Autosave already persisted the previous editor. Start fresh.
    setCurrentKBID(null);
    setCurrentKBName("New KB");
    setAnnotations("");
    setKnowledgeBase("");
    setError(null);
  }, []);

  const handleLoadKB = useCallback((kb) => {
    setAnnotations(kb.annotations || "");
    setKnowledgeBase(kb.knowledgeBase || "");
    setCurrentKBName(kb.name || "New KB");
    setCurrentKBID(kb.id);
    setError(null);
  }, []);

  const handleDeleteKB = useCallback(
    (kbToDelete) => {
      const ok = window.confirm(`Are you sure you want to delete "${kbToDelete.name}"?`);
      if (!ok) return;

      setSavedKBs((prev) => prev.filter((kb) => kb.id !== kbToDelete.id));

      if (currentKBID === kbToDelete.id) {
        setCurrentKBID(null);
        setCurrentKBName("New KB");
        setAnnotations("");
        setKnowledgeBase("");
        setError(null);
      }
    },
    [currentKBID]
  );

  const handleSaveKBName = useCallback(() => {
    const trimmed = currentKBName.trim() || "New KB";
    setCurrentKBName(trimmed);
    if (currentKBID) {
      setSavedKBs((prev) =>
        prev.map((kb) =>
          kb.id === currentKBID ? { ...kb, name: trimmed } : kb
        )
      );
    }
  }, [currentKBID, currentKBName]);

  const handleRenameKB = useCallback((newName) => {
    setCurrentKBName(newName);
  }, []);

  const handleImportKB = useCallback((lines) => {
    setKnowledgeBase(lines.join("\n"));
    setError(null);
  }, []);

  const handleExportKB = useCallback(() => {
    const lines = knowledgeBase
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(currentKBName || "knowledge_base").replace(
      /\s+/g,
      "_"
    )}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [knowledgeBase, currentKBName]);

  const handleClearKB = useCallback(() => {
    setKnowledgeBase("");
    setError(null);
  }, []);

  const handleCheckSatisfiability = useCallback(async () => {
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
  }, [knowledgeBase, goal]);

  const handleUseKB = useCallback(
    (kb) => {
      const mergeContent = (prev, next) =>
        !prev?.trim()
          ? next || ""
          : !next?.trim()
          ? prev || ""
          : prev + "\n" + next;

      const updatedAnnotations = mergeContent(annotations, kb.annotations);
      const updatedKb = mergeContent(knowledgeBase, kb.knowledgeBase);

      setAnnotations(updatedAnnotations);
      setKnowledgeBase(updatedKb);

      if (!currentKBID) {
        const id = newId();
        const newKB = {
          id,
          name: currentKBName || kb.name || "New KB",
          annotations: updatedAnnotations,
          knowledgeBase: updatedKb,
        };
        setSavedKBs((prev) => [...prev, newKB]);
        setCurrentKBID(id);
      }
    },
    [annotations, knowledgeBase, currentKBID, currentKBName]
  );

  const canSubmit = knowledgeBase.trim().length > 0 && goal.trim().length > 0 && !isLoading;

  const handleResetAll = useCallback(() => {
    // Clear in-memory state
    setAnnotations("");
    setKnowledgeBase("");
    setSavedKBs([]);
    setCurrentKBID(null);
    setCurrentKBName("New KB");
    setError(null);
    setResolutionResult(null);

    // Wipe persisted slices
    Object.values(LS_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    });
  }, []);

  return (
    <>
      <Header />
      <main className="fixed inset-x-0 top-[57px] bottom-0 overflow-hidden bg-slate-900">
        <div className="grid h-full grid-cols-[500px_minmax(0,1fr)]">
          <aside className="grid h-full min-h-0 grid-rows-[auto_1fr_auto_auto] gap-3 overflow-hidden border-r border-slate-800 bg-slate-900 p-5">
            <KBToolbar
              onImport={handleImportKB}
              onExport={handleExportKB}
              onClear={handleClearKB}
              onSave={handleSaveKB}
              isDirty={isDirty}
              currentKBName={currentKBName}
              currentKBID={currentKBID}
              savedKBs={savedKBs}
              onCreateNewKB={handleCreateNewKB}
              onLoadKB={handleLoadKB}
              onDeleteKB={handleDeleteKB}
              onRenameKB={handleRenameKB}
              onSaveKBName={handleSaveKBName}
              hasContent={knowledgeBase.trim().length > 0}
              disabled={isLoading}
            />

            <div className="grid min-h-0 grid-rows-[40%_60%] gap-3">
              <AnnotationsPanel
                value={annotations}
                onChange={setAnnotations}
                savedKBs={savedKBs}
                onUseKB={handleUseKB}
                disabled={isLoading}
              />
              <KnowledgeBase
                value={knowledgeBase}
                onChange={setKnowledgeBase}
                disabled={isLoading}
              />
            </div>

            <QueryGoal value={goal} onChange={setGoal} disabled={isLoading} />

            <SatisfiabilityButton
              onClick={handleCheckSatisfiability}
              isLoading={isLoading}
              disabled={!canSubmit}
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