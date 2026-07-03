import React, { useState, createContext, useContext } from 'react';
import Dashboard from './pages/Dashboard';

// 1. Import the brand new components we just built
import AuthPage from './components/AuthPage';
import UserManual from './components/UserManual';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export default function App() {
  // 2. Add the Phase Tracker state (Starts at 'LOGIN' by default)
  const [currentPhase, setCurrentPhase] = useState('LOGIN'); 

  // --- Your Original Dashboard State Variables ---
  const [activeFileId, setActiveFileId] = useState(null);
  const [healthReport, setHealthReport] = useState(null);
  const [chartPayload, setChartPayload] = useState(null);
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: 'Systems active. Drop a spreadsheet block into the Ingestion Hub to begin.' }
  ]);

  // 3. Phase 1: Intercept the render to show the Auth Screen
  if (currentPhase === 'LOGIN') {
    return <AuthPage onLoginSuccess={() => setCurrentPhase('MANUAL')} />;
  }

  // 4. Phase 2: Intercept the render to show the User Manual
  if (currentPhase === 'MANUAL') {
    return <UserManual onStartExploring={() => setCurrentPhase('WORKSPACE')} />;
  }

  // 5. Phase 3: The Actual Dashboard (Your exact original return block)
  return (
    <AppContext.Provider value={{
      activeFileId, setActiveFileId,
      healthReport, setHealthReport,
      chartPayload, setChartPayload,
      chatLog, setChatLog
    }}>
      <div className="bg-[#030712] text-slate-100 min-h-screen font-sans antialiased selection:bg-indigo-500/30">
        <Dashboard />
      </div>
    </AppContext.Provider>
  );
}
