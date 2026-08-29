import Header from "../components/Header";
import KBToolbar from "../components/KBToolbar";
import AnnotationsPanel from "../components/AnnotationsPanel";
import KnowledgeBase from "../components/KnowledgeBase";
import QueryGoal from "../components/QueryGoal";
import SatisfiabilityButton from "../components/SatisfiabilityButton";

import ProofTreePanel from "../components/ProofTree/ProofTreePanel";
import PlaybackControls from "../components/ProofTree/PlaybackControls";

import { checkSatisfiability } from "../api/resolution";

import { useState} from "react";;

export default function ResolutionPage() {
  const [annotations, setAnnotations] = useState("");

  const [knowledgeBase, setKnowledgeBase] = useState("");

  const [goal, setGoal] = useState("");

  const handleCheckSatisfiability = async () => {
    try {
      const result = await checkSatisfiability(
        knowledgeBase,
        goal
      );
      
      console.log(result);
    } catch (error) {
      console.error("Resolution failed:", error);
    }
  };

  return (
    <>
      {/*header */}
      <Header />

      {/* Application workspace */}
      <main className="fixed inset-x-0 top-[57px] bottom-0 overflow-hidden bg-slate-900">
        <div className="grid h-full grid-cols-[500px_minmax(0,1fr)]">
          {/* LEFT PANEL */}

          <aside
            className="
              grid
              h-full
              min-h-0
              grid-rows-[auto_1fr_auto_auto]
              gap-3
              overflow-hidden
              border-r
              border-slate-800
              bg-slate-900
              p-5
            "
          >
            {/* Toolbar*/}
            <KBToolbar />

            {/* Main editor area */}
            <div className="grid min-h-0 grid-rows-[40%_60%] gap-3">
              <AnnotationsPanel value={annotations} onChange={setAnnotations}/>
              <KnowledgeBase value={knowledgeBase} onChange={setKnowledgeBase}/>
            </div>

            {/* Query Goal */}
            <QueryGoal 
              value={goal} 
              onChange={setGoal} 
            />

            {/* Satisfiability Button */}
            <SatisfiabilityButton onClick={handleCheckSatisfiability}/>
          </aside>

          {/* RIGHT PANEL */}
          <section className="grid h-full grid-rows-[1fr_auto_auto] gap-5 overflow-hidden bg-slate-900 p-5">
          {/* Proof tree - fills space */}
          <div className="min-h-0">
            <ProofTreePanel />
          </div>
          
          {/* Playback */}
          <PlaybackControls />
          
          </section>
                  
        </div>

      </main>
    </>
  );
}