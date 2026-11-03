import React, { useState } from 'react';
import { Copy, Check, Star, AlertTriangle } from 'lucide-react';

export default function Display({
  expression,
  result,
  fraction,
  exactVal,
  error,
  angleMode,
  isFavorite,
  onToggleFavorite,
  onCopy
}) {
  const [copied, setCopied] = useState(false);

  const exactStr = exactVal?.exact || fraction;
  const simplifiedStr = exactVal?.simplified;

  const handleCopy = () => {
    if (result !== undefined && result !== null && !error) {
      let copyText = result.toString();
      if (exactStr) copyText += ` (Exact: ${exactStr})`;
      if (simplifiedStr) copyText += ` (Simplified: ${simplifiedStr})`;
      navigator.clipboard.writeText(copyText);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card p-4 md:p-5 mb-4 shadow-xl border border-white/10 relative overflow-hidden transition-all">
      {/* Angle Mode Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {angleMode} MODE
        </span>

        {/* Action icons: Copy & Favorite */}
        <div className="flex items-center gap-1.5">
          {result !== undefined && result !== null && !error && (
            <>
              <button
                onClick={onToggleFavorite}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isFavorite
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                }`}
                title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 border border-white/10 hover:text-white transition-colors"
                title="Copy Result"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expression Area */}
      <div className="min-h-[28px] text-right font-mono text-sm md:text-base text-slate-400 dark:text-slate-400 overflow-x-auto whitespace-nowrap tracking-wide py-1 no-scrollbar">
        {expression || '0'}
      </div>

      {/* Result or Error Area */}
      <div className="text-right py-1 min-h-[48px] flex flex-col items-end justify-center overflow-x-auto no-scrollbar">
        {error ? (
          <div className="flex items-center gap-2 text-rose-400 text-sm md:text-base bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1.5">
            {/* Main Decimal Result */}
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-sans text-slate-400 uppercase tracking-wider font-semibold">Decimal:</span>
              <span className="text-2xl md:text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                {result !== undefined && result !== null ? result : '= 0'}
              </span>
            </div>

            {/* Exact & Approximate Badges */}
            {((exactStr || simplifiedStr) || (typeof result === 'number' && !isNaN(result))) && (
              <div className="flex flex-wrap items-center justify-end gap-2 font-mono text-xs md:text-sm">
                {typeof result === 'number' && !isNaN(result) && (
                  <div className="flex items-center gap-1.5 text-emerald-300 font-semibold bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                    <span className="text-slate-400 font-sans font-normal text-[11px]">Approximately:</span>
                    <span className="font-bold text-emerald-200">{Math.round(result)}</span>
                  </div>
                )}
                {exactStr && (
                  <div className="flex items-center gap-1.5 text-indigo-300 font-semibold bg-indigo-500/15 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                    <span className="text-slate-400 font-sans font-normal text-[11px]">Exact:</span>
                    <span className="font-bold text-indigo-200">{exactStr}</span>
                  </div>
                )}
                {simplifiedStr && simplifiedStr !== exactStr && (
                  <div className="flex items-center gap-1.5 text-purple-300 font-semibold bg-purple-500/15 px-2.5 py-0.5 rounded-md border border-purple-500/30">
                    <span className="text-slate-400 font-sans font-normal text-[11px]">Simplified:</span>
                    <span className="font-bold text-purple-200">{simplifiedStr}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
