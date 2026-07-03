import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Charts from '../components/Charts';
import ChatBox from '../components/ChatBox';
import OnboardingModal from '../components/Onboarding'; 

export default function Dashboard() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    const skipOnboarding = localStorage.getItem('adp_skip_onboarding');
    if (!skipOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#030712] relative">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/0 blur-[120px] animate-pulseGlow"></div>
        <div className="absolute bottom-[-15%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-blue-500/10 to-cyan-500/0 blur-[140px] animate-pulseGlow" style={{ animationDelay: '-4s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>
      
      <Navbar />
      
      {/* Premium Glassmorphic Layout Container */}
      <div className="app-layout flex-1 relative z-10 w-full">
        <Sidebar />
        <main className="flex-1 flex overflow-hidden min-w-0 bg-slate-950/20">
          <Charts />
          <ChatBox />
        </main>
      </div>

      {/* Renders your beautiful onboarding modal component */}
      <OnboardingModal open={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </div>
  );
}
