import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 800);
    const t2 = setTimeout(() => setPhase('out'), 3800);
    const t3 = setTimeout(() => onDone(), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050d07]"
      style={{
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.8s ease' : phase === 'in' ? 'opacity 0.8s ease' : 'none',
      }}
    >
      {/* Islamic geometric pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <polygon points="40,5 75,20 75,60 40,75 5,60 5,20" fill="none" stroke="#34d399" strokeWidth="0.8"/>
              <polygon points="40,15 65,27 65,53 40,65 15,53 15,27" fill="none" stroke="#34d399" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic)" />
        </svg>
      </div>

      {/* Logo */}
      <div
        className="relative flex flex-col items-center"
        style={{
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(20px)' : 'translateY(0)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Emblem */}
        <div className="mb-6">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
            <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" fill="none" stroke="#34d399" strokeWidth="2"/>
            <polygon points="40,14 64,28 64,52 40,66 16,52 16,28" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.6"/>
            <polygon points="40,24 54,34 54,46 40,56 26,46 26,34" fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.3"/>
            <circle cx="40" cy="40" r="5" fill="#34d399"/>
          </svg>
        </div>

        {/* Name */}
        <h1 className="text-5xl font-bold text-white tracking-tight mb-2">SirajOne</h1>
        <p className="text-emerald-400 text-sm font-medium tracking-widest uppercase mb-1">Faith. Knowledge. Action.</p>
        <p className="text-slate-500 text-2xl mt-4 font-arabic" dir="rtl" lang="ar">إيمان • علم • عمل</p>

        {/* Loading bar */}
        <div className="mt-10 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{
              width: phase === 'in' ? '0%' : phase === 'hold' ? '80%' : '100%',
              transition: phase === 'hold' ? 'width 3s ease' : phase === 'out' ? 'width 0.5s ease' : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
