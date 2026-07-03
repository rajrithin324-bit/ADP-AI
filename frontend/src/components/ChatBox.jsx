import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';
import { api } from '../services/api';

export default function ChatBox() {
  const { activeFileId, chatLog, setChatLog, setChartPayload } = useApp();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  // Dynamic file creation using your chatLog array
  const handleExportChat = () => {
    if (!chatLog || chatLog.length === 0) return;

    // Formats the chat array into a beautiful printable text report
    const formattedChat = chatLog
      .map((msg) => {
        const sender = msg.role === 'user' ? 'User' : 'Gemini AI';
        return `[${sender}]\n${msg.content}\n-----------------------------------`;
      })
      .join('\n\n');

    // Creates the text blob and clicks it silently via browser memory
    const blob = new Blob([formattedChat], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gemini_analytics_report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!input.trim() || !activeFileId || sending) return;
    const query = input;
    setInput('');
    setSending(true);

    // Append localized user bubble instant state updates
    setChatLog(prev => [...prev, { role: 'user', content: query }]);

    try {
      const data = await api.sendChatMessage(activeFileId, query);
      setChatLog(prev => [...prev, { role: 'assistant', content: data.explanation }]);
      if (data.model_results) {
        setChartPayload(data.model_results);
      }
    } catch (err) {
      setChatLog(prev => [...prev, { role: 'assistant', content: 'Operational pipeline block encountered parsing queries.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-80 border-l border-white/5 bg-slate-900/20 backdrop-blur-md flex flex-col shrink-0 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-slate-900/40">
        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">💬 Gemini Powered Analytics Co-Pilot</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatLog.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed border ${msg.role === 'user' ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10' : 'bg-slate-900/80 border-white/5 text-slate-300'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input panel wrapped in flex-col to allow stacking of our new export button */}
      <div className="p-4 border-t border-white/5 bg-slate-950/40 flex flex-col gap-2">
        
        {/* Only displays when chat contains messages */}
        {chatLog.length > 0 && (
          <button 
            onClick={handleExportChat}
            className="w-full py-1.5 bg-slate-900/60 hover:bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-slate-200 text-[10px] font-medium transition flex items-center justify-center gap-1.5 mb-1"
          >
            📄 Download AI Insights Report
          </button>
        )}

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder={activeFileId ? "Ask: 'Predict Sales'..." : "Awaiting CSV ingestion payload..."} 
            disabled={!activeFileId || sending} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} 
            className="bg-slate-900 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-200 flex-1 focus:outline-none focus:border-indigo-500 disabled:opacity-40 transition-all font-medium tracking-wide" 
          />
          <button 
            onClick={handleSubmit} 
            disabled={!activeFileId || !input.trim() || sending} 
            className="px-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl text-white font-medium text-xs transition-all shadow-md shadow-indigo-600/10"
          >
            {sending ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}