import React from 'react';
import { useApp } from '../App';

export default function Charts() {
  const { chartPayload } = useApp();

  return (
    <div className="flex-1 p-5 overflow-y-auto space-y-5 flex flex-col min-w-0">
      <div className="flex-1 border border-white/5 rounded-2xl bg-slate-900/10 backdrop-blur-sm p-6 flex flex-col min-h-[400px]">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pipeline Visualizations Output</span>
        
        {chartPayload ? (
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-slate-950/60">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Selected Pipeline Process</span>
                <div className="text-md font-semibold text-indigo-400 mt-1">{chartPayload.algorithm}</div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-slate-950/60">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Algorithm Accuracy Rating</span>
                <div className="text-md font-semibold text-emerald-400 mt-1">{chartPayload.accuracy_score}%</div>
              </div>
            </div>

            {/* Simulated Chart Container Layer mapping actual backend arrays */}
            <div className="p-5 rounded-xl border border-white/5 bg-slate-950/40 space-y-4">
              <span className="text-xs font-semibold text-slate-300 block font-mono">// Visual Chart Model: {chartPayload.chart_data.title}</span>
              <div className="space-y-2 pt-2">
                {chartPayload.chart_data.labels.map((label, index) => {
                  const val = chartPayload.chart_data.values[index];
                  // Safe bounding width percentage calculation mapping coefficients
                  const absoluteMax = Math.max(...chartPayload.chart_data.values.map(Math.abs), 1);
                  const percentage = Math.min(100, Math.max(5, (Math.abs(val) / absoluteMax) * 100));
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span className="truncate max-w-[70%]">{label}</span>
                        <span>{typeof val === 'number' ? val.toFixed(4) : val}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full transition-all ${val >= 0 ? 'bg-indigo-500' : 'bg-rose-500'}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-[11px] text-slate-400 max-h-48 overflow-y-auto">
              <span className="text-slate-600 block mb-1">// API Native JSON Response Matrix Payload</span>
              <pre className="text-indigo-300">{JSON.stringify(chartPayload.metrics, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs mx-auto">
            <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center text-slate-500 text-lg mb-3">📈</div>
            <p className="text-xs font-medium text-slate-400">Awaiting Pipeline Targeting Matrix</p>
            <p className="text-[11px] text-slate-600 mt-1">Prompt your assistant (e.g., "Predict next month's sales") to train automated models and render charts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
