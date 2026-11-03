import React from 'react';
import {
  Calculator,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';

export default function Header({
  activeMode,
  onBackToHome,
  angleMode,
  setAngleMode,
  precision,
  setPrecision,
  theme,
  toggleTheme,
}) {
  const isHome = activeMode === 'Home';

  return (
    <header className="sticky top-0 z-40 w-full mb-4 md:mb-6">
      <div className="glass-panel px-4 py-3 md:px-6 md:py-4 border-b shadow-lg">
        {/* Header Row: Title / Back Button + Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Home button (when in tool view) OR Logo Title (when on Home) */}
          <div className="flex items-center gap-3">
            {!isHome ? (
              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to Home</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    SMART CALCULATOR SYSTEM
                  </h1>
                  <p className="text-xs text-slate-400 font-medium">
                    Calculate. Understand. Learn.
                  </p>
                </div>
              </div>
            )}

            {!isHome && (
              <span className="hidden sm:inline-block font-bold text-sm text-indigo-300 border-l border-white/10 pl-3">
                {activeMode} Calculator
              </span>
            )}
          </div>

          {/* Right Controls: DEG/RAD, Precision, Theme */}
          <div className="flex items-center gap-2">
            {/* DEG / RAD Toggle */}
            <div className="flex items-center bg-slate-800/60 dark:bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/50">
              <button
                onClick={() => setAngleMode('DEG')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  angleMode === 'DEG'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Degree Angle Mode"
              >
                DEG
              </button>
              <button
                onClick={() => setAngleMode('RAD')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  angleMode === 'RAD'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Radian Angle Mode"
              >
                RAD
              </button>
            </div>

            {/* Precision Select */}
            <select
              value={precision}
              onChange={(e) => setPrecision(e.target.value)}
              className="bg-slate-800/60 dark:bg-slate-900/80 text-slate-200 text-xs font-medium px-2 py-1.5 rounded-lg border border-slate-700/50 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              title="Display Decimal Precision"
            >
              <option value="auto">Auto Precision</option>
              <option value="2">2 Decimals</option>
              <option value="4">4 Decimals</option>
              <option value="6">6 Decimals</option>
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/60 dark:bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
