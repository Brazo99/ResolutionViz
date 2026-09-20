export default function ProofControls() {
  return (
    <div className="card bg-slate-900 border border-slate-800 shadow-xl rounded-lg px-6 py-4 flex justify-center items-center relative">
       <div className="flex items-center gap-4">
         <button className="btn btn-ghost btn-circle text-base-content/60">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
         </button>
         <button className="btn btn-primary btn-circle w-12 h-12 text-lg">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
         </button>
         <button className="btn btn-ghost btn-circle text-base-content/60">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
         </button>
       </div>
       <div className="absolute right-6 text-xs text-base-content/50">
         Step interval: <span className="font-mono text-slate-300">1.0s</span>
       </div>
    </div>
  );
}