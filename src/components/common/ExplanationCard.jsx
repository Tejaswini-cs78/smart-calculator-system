import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from 'lucide-react';

export default function ExplanationCard({ explanation, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!explanation || !explanation.steps || explanation.steps.length === 0) {
    return null;
  }

  return (
    <div className="glass-card overflow-hidden transition-all duration-300 border border-indigo-500/20 shadow-lg mt-4">
      {/* Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-indigo-500/10 hover:bg-indigo-500/15 flex items-center justify-between transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-indigo-300 dark:text-indigo-300 font-semibold text-xs md:text-sm">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>How was this calculated?</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
          <span>{isExpanded ? 'Hide Steps' : 'View Explanation'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Explanation Content */}
      {isExpanded && (
        <div className="p-4 md:p-5 text-xs md:text-sm text-slate-300 space-y-3 bg-slate-900/40 border-t border-indigo-500/10 animate-fade-in">
          {explanation.title && (
            <h4 className="font-bold text-slate-200 text-sm border-b border-white/10 pb-2 mb-3">
              {explanation.title}
            </h4>
          )}

          <div className="space-y-2 font-mono leading-relaxed">
            {explanation.steps.map((step, idx) => {
              const isVerified = step.includes('Verified ✓') || step.includes('✓');
              const isStepTitle = step.startsWith('Step') || step.startsWith('---') || step.startsWith('Formula') || step.startsWith('Operation');

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg transition-colors ${
                    isVerified
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-2'
                      : isStepTitle
                      ? 'bg-indigo-500/10 text-indigo-200 font-semibold border-l-2 border-indigo-500 pl-3'
                      : 'bg-white/5 text-slate-300'
                  }`}
                >
                  {isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>

          {explanation.finalAnswer !== undefined && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Final Calculated Result:</span>
              <span className="font-mono text-base text-indigo-400 dark:text-indigo-300 font-bold bg-indigo-500/20 px-3 py-1 rounded-md border border-indigo-500/30">
                {explanation.finalAnswer}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
