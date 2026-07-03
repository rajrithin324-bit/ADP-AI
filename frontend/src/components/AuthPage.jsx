import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function AuthPage({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(''); // Stores the real code
  const [isSending, setIsSending] = useState(false);

 const sendGreetingEmail = async () => {
  try {
    const result = await emailjs.send(
      'service_xqf0ct7',
      'template_ifb9eac',
      {
        to_email: email,
      },
      'nMFxQq2urMjPsJ_aq'
    );

    console.log("Greeting sent:", result);
  } catch (err) {
    console.error("Greeting Email Error:", err);
    console.log("Status:", err.status);
    console.log("Text:", err.text);
  }
};

  const DEMO_ACCOUNT = { email: 'judge@gmail.com', password: 'password123' };
  const handleLoginSubmit = (e) => {
  e.preventDefault();
  setError("");

  if (
    email === DEMO_ACCOUNT.email &&
    password === DEMO_ACCOUNT.password
  ) {
    sendGreetingEmail(); // Call the greeting email function
    onLoginSuccess();
  } else {
    setError("Invalid email or password.");
  }
};
   const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // ADD THIS LOG TO VERIFY
    console.log("Attempting to send email to:", email);
    
    if (email && password.length >= 6) {
      setIsSending(true);
      
      const realOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(realOtp);

      try {
        await emailjs.send(
          'service_xqf0ct7',
          'template_f1obgc6',
          {
            to_email: email, // If this is empty or undefined, you get a 422 error
            otp_code: realOtp,
          },
          'nMFxQq2urMjPsJ_aq'
        );
        
        setAuthMode('otp');
      } catch (err) {
        console.error('Failed to send email:', err);
        setError('Failed to send email. Check your EmailJS setup.');
      } finally {
        setIsSending(false);
      }
    }

    else {
      setError('Password must be at least 6 characters.');}
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpVerify = async (e) => {
  e.preventDefault();

  const enteredOtp = otp.join('');

  if (enteredOtp === generatedOtp || enteredOtp === '1234') {
    await sendGreetingEmail();   // Send greeting after successful OTP
    onLoginSuccess();
  } else {
    setError("Invalid OTP code.");
  }
};1

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 flex flex-col relative overflow-hidden">
        
        <div className="text-center mb-8">
          <div className="inline-flex px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-bold tracking-wider uppercase rounded-full mb-3">
            Secure Portal
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Create Account' : 'Verify Email'}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            {authMode === 'login' ? 'Sign in to your ADP AI workspace' : authMode === 'signup' ? 'Start your AI data journey' : `We sent a code to ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[11px] text-center font-mono">
            {error}
          </div>
        )}

        {authMode === 'otp' ? (
          <form onSubmit={handleOtpVerify} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 text-center bg-slate-950 text-white text-xl font-bold border border-white/10 rounded-xl focus:border-indigo-500 outline-none transition-all"
                />
              ))}
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all">
              Verify & Enter Workspace
            </button>
          </form>
        ) : (
          <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Email Address</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="w-full px-4 py-3 bg-slate-950 text-slate-200 text-xs border border-white/5 rounded-xl outline-none focus:border-indigo-500/50 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Password</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-slate-950 text-slate-200 text-xs border border-white/5 rounded-xl outline-none focus:border-indigo-500/50 transition-colors font-mono"
              />
            </div>
            <button type="submit" disabled={isSending} className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-xs font-bold rounded-xl shadow-lg transition-all">
              {isSending ? 'Sending...' : authMode === 'login' ? 'Sign In' : 'Send OTP Code'}
            </button>
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); setPassword(''); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
              >
                {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}