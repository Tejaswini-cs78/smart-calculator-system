import React from 'react';
import Display from '../common/Display';
import KeypadBasic from '../keypads/KeypadBasic';
import KeypadScientific from '../keypads/KeypadScientific';
import ExplanationCard from '../common/ExplanationCard';

export default function BasicScientificView({
  expression,
  setExpression,
  result,
  fraction,
  exactVal,
  error,
  explanation,
  angleMode,
  setAngleMode,
  mode,
  isFavorite,
  onToggleFavorite,
  onEvaluate,
  onClear,
  onBackspace,
  onToggleSign,
  onInputChar
}) {
  const isScientific = mode === 'Scientific';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left / Main Column: Keypad & Input */}
      <div className="lg:col-span-7 space-y-4">
        {/* Display Area */}
        <Display
          expression={expression}
          result={result}
          fraction={fraction}
          exactVal={exactVal}
          error={error}
          angleMode={angleMode}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />

        {/* Scientific Keypad (If Scientific mode selected) */}
        {isScientific && (
          <KeypadScientific
            onInput={onInputChar}
            angleMode={angleMode}
            setAngleMode={setAngleMode}
          />
        )}

        {/* Basic Keypad */}
        <div className="glass-panel p-4 shadow-xl border border-white/10">
          <KeypadBasic
            onInput={onInputChar}
            onClear={onClear}
            onBackspace={onBackspace}
            onToggleSign={onToggleSign}
            onEvaluate={onEvaluate}
          />
        </div>
      </div>

      {/* Right Column: Step-by-Step Explanation */}
      <div className="lg:col-span-5 space-y-4">
        {explanation ? (
          <ExplanationCard explanation={explanation} defaultExpanded={true} />
        ) : (
          <div className="glass-card p-6 text-center text-slate-400 space-y-2">
            <h3 className="font-semibold text-slate-300">Step-by-Step Explanations</h3>
            <p className="text-xs">
              Enter any mathematical expression and press <strong className="text-indigo-400 font-mono">=</strong> to see complete, step-by-step educational explanations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
