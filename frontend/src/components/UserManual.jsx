import React from 'react';

export default function UserManual({ onStartExploring }) {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-3xl bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col p-8 sm:p-12 relative">
        
        {/* Header from image_bf1994.png */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold rounded-full mb-4">
            ✦ Welcome to ADP AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-none font-sans mb-3">
            Your AI-Powered Data <br />Analysis Co-pilot
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
            ADP AI reads your dataset, understands its structure, and answers questions in plain English — generating real charts, insights, and ML code in seconds.
          </p>
        </div>

        <hr className="border-white/5 mb-8" />

        {/* Main 4 Step Instruction Track */}
        <div className="space-y-6 flex-1">
          {/* Step 1 */}
          <div className="flex gap-4 items-start">
            <div className="w-7 h-7 shrink-0 bg-indigo-500/20 border border-indigo-500/40 rounded-full flex items-center justify-center text-xs font-bold text-indigo-300">1</div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">📁 Upload any dataset</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Drop your data file on the left panel. ADP AI instantly reads its structure — columns, data types, missing values, and sample rows.</p>
              <div className="flex gap-1.5 mt-2.5">
                {['CSV', 'TSV', 'JSON', 'TXT'].map((ext) => (
                  <span key={ext} className="px-2 py-0.5 bg-slate-950 text-slate-500 text-[10px] font-bold rounded-md border border-white/5 font-mono">{ext}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-7 h-7 shrink-0 bg-indigo-500/20 border border-indigo-500/40 rounded-full flex items-center justify-center text-xs font-bold text-indigo-300">2</div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">💬 Ask anything in plain English</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Type questions like <span className="italic text-slate-300">"Which customers are most likely to churn?"</span> or <span className="italic text-slate-300">"What drives revenue?"</span></p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-7 h-7 shrink-0 bg-indigo-500/20 border border-indigo-500/40 rounded-full flex items-center justify-center text-xs font-bold text-indigo-300">3</div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">📊 Get charts, insights, and ML code</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Every response includes real analysis, live charts, and auto-generated Python code you can run directly.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 items-start">
            <div className="w-7 h-7 shrink-0 bg-indigo-500/20 border border-indigo-500/40 rounded-full flex items-center justify-center text-xs font-bold text-indigo-300">4</div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">📥 Download your report</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Export a full PDF analysis report, the generated Python script, or prediction CSV.</p>
            </div>
          </div>
        </div>

        {/* Footer actions matching image_bf1994.png */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-400 hover:text-slate-300 transition-colors select-none">
            <input type="checkbox" className="accent-indigo-600 rounded border-white/5 bg-slate-950 w-4 h-4" />
            Don't show this again
          </label>
          <button 
            onClick={onStartExploring}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1 active:scale-[0.98] transition-all"
          >
            Start Analysing →
          </button>
        </div>

      </div>
    </div>
  );
}