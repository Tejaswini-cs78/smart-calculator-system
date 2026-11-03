import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';

export default function KeypadBasic({ onInput, onClear, onBackspace, onToggleSign, onEvaluate }) {
  const buttons = [
    { label: 'C', action: onClear, type: 'clear' },
    { label: '( )', action: () => onInput('('), type: 'paren' },
    { label: '%', action: () => onInput('%'), type: 'op' },
    { label: '÷', action: () => onInput('÷'), type: 'op' },

    { label: '7', action: () => onInput('7'), type: 'num' },
    { label: '8', action: () => onInput('8'), type: 'num' },
    { label: '9', action: () => onInput('9'), type: 'num' },
    { label: '×', action: () => onInput('×'), type: 'op' },

    { label: '4', action: () => onInput('4'), type: 'num' },
    { label: '5', action: () => onInput('5'), type: 'num' },
    { label: '6', action: () => onInput('6'), type: 'num' },
    { label: '−', action: () => onInput('-'), type: 'op' },

    { label: '1', action: () => onInput('1'), type: 'num' },
    { label: '2', action: () => onInput('2'), type: 'num' },
    { label: '3', action: () => onInput('3'), type: 'num' },
    { label: '+', action: () => onInput('+'), type: 'op' },

    { label: '±', action: onToggleSign, type: 'num' },
    { label: '0', action: () => onInput('0'), type: 'num' },
    { label: '.', action: () => onInput('.'), type: 'num' },
    { label: '=', action: onEvaluate, type: 'equals' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {buttons.map((btn, i) => {
        let styleClass = 'py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl transition-all flex items-center justify-center select-none active:scale-95 ';

        if (btn.type === 'clear') {
          styleClass += 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30';
        } else if (btn.type === 'equals') {
          styleClass += 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 font-bold';
        } else if (btn.type === 'op') {
          styleClass += 'bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/20 font-bold';
        } else if (btn.type === 'paren') {
          styleClass += 'bg-slate-700/40 hover:bg-slate-700/60 text-slate-200 border border-slate-600/30';
        } else {
          styleClass += 'glass-button text-slate-900 dark:text-slate-100 font-bold';
        }

        return (
          <button key={i} onClick={btn.action} className={styleClass}>
            {btn.label}
          </button>
        );
      })}

      {/* Backspace button spanning bottom */}
      <button
        onClick={onBackspace}
        className="col-span-4 py-2.5 bg-slate-800/40 hover:bg-slate-800/60 text-slate-300 rounded-xl border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98"
      >
        <Delete className="w-4 h-4" />
        <span>Backspace (⌫)</span>
      </button>
    </div>
  );
}
