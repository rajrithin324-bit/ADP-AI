import React from 'react';

export default function Navbar() {
  return (
    <header className="h-16 border-b border-white/5 bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20 relative">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">A</div>
        <h1 className="text-md font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">ADP-AI Platform</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] tracking-widest uppercase px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-bold">Hackathon Prototype Build v1.0</span>
      </div>
    </header>
  );
}
