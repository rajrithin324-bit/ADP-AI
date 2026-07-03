import React, { useState } from 'react';
import { useApp } from '../App';
import { api } from '../services/api';

export default function UploadBox() {
  const { setActiveFileId, setHealthReport, setChatLog } = useApp();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);

    try {
      const res = await api.uploadDataset(file);
      setActiveFileId(res.file_id);
      setHealthReport(res.health_report);
      setChatLog(prev => [...prev, { 
        role: 'assistant', 
        content: `Successfully ingested structural matrix tracking **${file.name}** containing **${res.summary.rows} rows** across **${res.summary.columns} parameters**. I have automatically compiled your Dataset Health Report in the panel! Ask me anything.` 
      }]);
    } catch (err) {
      alert(err.message);
      setFileName('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm space-y-3">
      <span className="text-xs font-semibold text-slate-300 block">Dataset Ingestion Gateway</span>
      <div className="border border-dashed border-white/10 hover:border-indigo-500/30 rounded-lg p-4 transition-all bg-slate-950/40 text-center relative group">
        <input type="file" accept=".csv,.xlsx" id="file-drop" className="hidden" onChange={handleFileChange} disabled={loading} />
        <label htmlFor="file-drop" className="cursor-pointer text-[11px] text-slate-400 group-hover:text-slate-200 flex flex-col items-center gap-1.5 py-2">
          <span className="text-lg transition-transform group-hover:-translate-y-0.5">{loading ? '⚡' : '📥'}</span>
          <span className="font-medium tracking-wide break-all">{fileName ? `📄 ${fileName}` : 'Click to drop CSV/XLSX file matrix'}</span>
        </label>
      </div>
    </div>
  );
}
