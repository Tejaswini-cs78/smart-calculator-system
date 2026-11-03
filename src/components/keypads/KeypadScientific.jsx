import React from 'react';

export default function KeypadScientific({ onInput, angleMode, setAngleMode }) {
  const sciButtons = [
    { label: 'sin', action: () => onInput('sin(') },
    { label: 'cos', action: () => onInput('cos(') },
    { label: 'tan', action: () => onInput('tan(') },
    { label: 'asin', action: () => onInput('asin(') },
    { label: 'acos', action: () => onInput('acos(') },
    { label: 'atan', action: () => onInput('atan(') },

    { label: 'csc', action: () => onInput('csc(') },
    { label: 'sec', action: () => onInput('sec(') },
    { label: 'cot', action: () => onInput('cot(') },
    { label: 'log₁₀', action: () => onInput('log(') },
    { label: 'ln', action: () => onInput('ln(') },
    { label: 'log₂', action: () => onInput('log2(') },

    { label: 'x²', action: () => onInput('^2') },
    { label: 'x³', action: () => onInput('^3') },
    { label: 'xⁿ', action: () => onInput('^') },
    { label: '√x', action: () => onInput('sqrt(') },
    { label: '∛x', action: () => onInput('cbrt(') },
    { label: 'n!', action: () => onInput('!') },

    { label: 'π', action: () => onInput('π') },
    { label: 'e', action: () => onInput('e') },
    { label: '(', action: () => onInput('(') },
    { label: ')', action: () => onInput(')') },
    {
      label: angleMode,
      action: () => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG'),
      isBadge: true
    },
    { label: '|x|', action: () => onInput('abs(') },
  ];

  return (
    <div className="glass-card p-3 mb-3 border border-indigo-500/20 shadow-md">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold text-indigo-300">Scientific Functions</span>
        <span className="text-[10px] text-slate-400">Angle: {angleMode}</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5 md:gap-2">
        {sciButtons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className={`py-2 text-xs md:text-sm font-semibold rounded-lg transition-all active:scale-95 flex items-center justify-center font-mono ${
              btn.isBadge
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 border border-indigo-500/20'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
