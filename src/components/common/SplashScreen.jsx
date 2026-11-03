import React, { useEffect, useState } from 'react';
import { Calculator, ArrowRight, Sparkles } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 600); // 600ms fade out transition
    }, 2800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(onFinish, 300);
  };

  const symbols = ['+', '−', '×', '÷', '√', 'π', '∑', '∫', 'sin', 'cos', 'tan', 'log', 'x²', 'x³'];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Floating Math Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {symbols.map((sym, idx) => (
          <span
            key={idx}
            className="absolute font-mono text-indigo-400/20 text-2xl font-bold animate-float"
            style={{
              left: `${(idx * 7) + 4}%`,
              top: `${(idx * 13) % 80 + 10}%`,
              animationDuration: `${6 + (idx % 5)}s`,
              animationDelay: `${idx * 0.2}s`,
            }}
          >
            {sym}
          </span>
        ))}
      </div>

      {/* Glass Container */}
      <div className="relative max-w-md w-full mx-4 p-8 glass-panel text-center flex flex-col items-center border border-white/20 shadow-2xl animate-fade-in">
        {/* Animated App Icon */}
        <div className="relative mb-6 p-4 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 animate-bounce">
          <Calculator className="w-12 h-12 text-white" />
          <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
        </div>

        <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-1">
          WELCOME TO
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2 bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
          SMART CALCULATOR SYSTEM
        </h1>

        <p className="text-indigo-300/90 font-medium text-sm md:text-base mb-8 tracking-wide">
          Calculate. Understand. Learn.
        </p>

        {/* Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6 border border-white/10">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-[slideUp_2.8s_ease-in-out_forwards]" style={{ width: '100%' }} />
        </div>

        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-white/10"
        >
          <span>Continue to Calculator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
