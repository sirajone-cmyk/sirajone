import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 800);
    const t2 = setTimeout(() => setPhase('out'), 3800);
    const t3 = setTimeout(() => onDone(), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050d07] px-5 py-8"
      style={{
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.8s ease' : phase === 'in' ? 'opacity 0.8s ease' : 'none',
      }}
    >
      <style>{`
        @keyframes sirajonePatternDrift {
          0%, 100% { transform: perspective(900px) rotateX(58deg) rotateZ(-3deg) translate3d(-2%, 0, 0) scale(1.05); }
          50% { transform: perspective(900px) rotateX(58deg) rotateZ(-3deg) translate3d(2%, -2%, 28px) scale(1.08); }
        }

        @keyframes sirajoneEdgeGlow {
          0%, 100% { opacity: 0.22; filter: drop-shadow(0 0 5px rgba(52, 211, 153, 0.08)); }
          50% { opacity: 0.38; filter: drop-shadow(0 0 12px rgba(52, 211, 153, 0.18)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sirajone-3d-pattern,
          .sirajone-3d-highlights {
            animation: none !important;
          }
        }
      `}</style>

      {/* Islamic geometric pattern background with subtle 3D depth */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-95">
        <div
          className="sirajone-3d-pattern absolute -inset-x-24 -inset-y-44 origin-center"
          style={{
            animation: 'sirajonePatternDrift 9s ease-in-out infinite',
            transformStyle: 'preserve-3d',
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="islamic3d" x="0" y="0" width="96" height="96" patternUnits="userSpaceOnUse">
                <g transform="translate(8 8)">
                  <polygon points="40,5 75,20 75,60 40,75 5,60 5,20" fill="rgba(7,28,18,0.22)" stroke="rgba(0,0,0,0.55)" strokeWidth="3.2" transform="translate(4 5)" />
                  <polygon points="40,5 75,20 75,60 40,75 5,60 5,20" fill="rgba(6,22,14,0.08)" stroke="rgba(9,60,38,0.6)" strokeWidth="1.15" />
                  <polyline points="5,20 40,5 75,20" fill="none" stroke="rgba(112,255,190,0.18)" strokeWidth="1.15" />
                  <polyline points="75,60 40,75 5,60" fill="none" stroke="rgba(0,0,0,0.34)" strokeWidth="1.8" />
                  <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="rgba(52,211,153,0.15)" strokeWidth="0.9" />
                  <polyline points="16,28 40,16 64,28" fill="none" stroke="rgba(180,255,220,0.12)" strokeWidth="0.8" />
                </g>
              </pattern>

              <radialGradient id="patternFalloff" cx="50%" cy="50%" r="74%">
                <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                <stop offset="55%" stopColor="white" stopOpacity="0.42" />
                <stop offset="100%" stopColor="white" stopOpacity="0.04" />
              </radialGradient>
              <mask id="patternMask">
                <rect width="100%" height="100%" fill="url(#patternFalloff)" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic3d)" mask="url(#patternMask)" />
          </svg>
        </div>

        <div
          className="sirajone-3d-highlights absolute inset-0"
          style={{ animation: 'sirajoneEdgeGlow 4.8s ease-in-out infinite' }}
        >
          <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/5 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050d07] via-[#050d07]/40 to-transparent" />
        </div>
      </div>

      {/* Foreground readability field */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(2,7,4,0.85) 0%, rgba(2,7,4,0.78) 34%, rgba(2,7,4,0.34) 58%, transparent 100%)',
        }}
      />

      {/* Logo */}
      <div
        className="relative flex w-full max-w-[420px] flex-col items-center px-4 py-8 text-center sm:max-w-[520px] sm:px-8 sm:py-10"
        style={{
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(20px)' : 'translateY(0)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div
          className="absolute inset-0 -z-10 rounded-[2rem]"
          style={{
            background: 'radial-gradient(circle, rgba(2,7,4,0.88) 0%, rgba(2,7,4,0.7) 44%, rgba(2,7,4,0.2) 76%, transparent 100%)',
            filter: 'blur(0.2px)',
          }}
        />

        {/* Emblem */}
        <div className="mb-7 sm:mb-8">
          <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)] sm:h-24 sm:w-24"
          >
            <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" fill="none" stroke="#34d399" strokeWidth="2" />
            <polygon points="40,14 64,28 64,52 40,66 16,52 16,28" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.6" />
            <polygon points="40,24 54,34 54,46 40,56 26,46 26,34" fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.3" />
            <circle cx="40" cy="40" r="5" fill="#34d399" />
          </svg>
        </div>

        {/* Name */}
        <h1
          className="mb-5 text-5xl font-bold tracking-tight text-white sm:text-6xl"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 34px rgba(0,0,0,0.85)' }}
        >
          SirajOne
        </h1>

        <div
          className="w-full max-w-[360px] rounded-xl px-5 py-4 sm:max-w-[430px] sm:px-7"
          style={{
            background: 'rgba(4, 14, 8, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,255,136,0.15)',
            boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300 sm:text-base">
            Faith. Knowledge. Action.
          </p>
          <p className="mt-4 text-2xl leading-relaxed text-slate-100 sm:text-3xl" dir="rtl" lang="ar">
            إيمان • علم • عمل
          </p>
        </div>

        {/* Loading bar */}
        <div className="mt-10 h-0.5 w-48 overflow-hidden rounded-full bg-white/15 sm:mt-12">
          <div
            className="h-full rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.75)]"
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
