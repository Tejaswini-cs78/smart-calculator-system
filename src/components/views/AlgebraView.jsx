import React, { useState } from 'react';
import { solveLinearEquation, solveQuadraticEquation, parseAndSolveLinear, solveCustomPolynomialEquation } from '../../engine/algebraEngine';
import ExplanationCard from '../common/ExplanationCard';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function AlgebraView({ onSaveHistory }) {
  const [subMode, setSubMode] = useState('CUSTOM'); // 'CUSTOM' | 'LINEAR' | 'QUADRATIC'

  // Linear form states
  const [linA, setLinA] = useState('2');
  const [linB, setLinB] = useState('5');
  const [linC, setLinC] = useState('15');

  // Quadratic form states
  const [quadA, setQuadA] = useState('1');
  const [quadB, setQuadB] = useState('5');
  const [quadC, setQuadC] = useState('6');

  // Freeform text
  const [freeEq, setFreeEq] = useState('x^3 - 6x^2 + 11x - 6 = 0');

  // Result & Error
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);

  const handleSolveLinear = (e) => {
    e?.preventDefault();
    try {
      setError(null);
      const res = solveLinearEquation(linA, linB, linC);
      setSolution(res);
      onSaveHistory?.({
        expression: res.equationStr,
        result: res.solutionText,
        explanation: { title: `Linear Equation Solution`, steps: res.steps, finalAnswer: res.solutionText },
        mode: 'Algebra'
      });
    } catch (err) {
      setError(err.message);
      setSolution(null);
    }
  };

  const handleSolveQuadratic = (e) => {
    e?.preventDefault();
    try {
      setError(null);
      const res = solveQuadraticEquation(quadA, quadB, quadC);
      setSolution(res);
      onSaveHistory?.({
        expression: res.equationStr,
        result: res.solutionText,
        explanation: { title: `Quadratic Equation Solution`, steps: res.steps, finalAnswer: res.solutionText },
        mode: 'Algebra'
      });
    } catch (err) {
      setError(err.message);
      setSolution(null);
    }
  };

  const handleSolveFreeform = (e) => {
    e?.preventDefault();
    try {
      setError(null);
      const res = solveCustomPolynomialEquation(freeEq);
      setSolution(res);
      onSaveHistory?.({
        expression: res.equationStr,
        result: res.solutionText,
        explanation: { title: `Algebra Equation Solution`, steps: res.steps, finalAnswer: res.solutionText },
        mode: 'Algebra'
      });
    } catch (err) {
      setError(err.message);
      setSolution(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-mode selector tabs */}
      <div className="glass-panel p-2 flex items-center justify-center gap-2 border border-white/10 max-w-xl mx-auto">
        <button
          onClick={() => { setSubMode('CUSTOM'); setSolution(null); setError(null); }}
          className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
            subMode === 'CUSTOM' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Custom Equation (Linear/Quadratic/Cubic)
        </button>
        <button
          onClick={() => { setSubMode('LINEAR'); setSolution(null); setError(null); }}
          className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
            subMode === 'LINEAR' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Linear (ax + b = c)
        </button>
        <button
          onClick={() => { setSubMode('QUADRATIC'); setSolution(null); setError(null); }}
          className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
            subMode === 'QUADRATIC' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Quadratic (ax² + bx + c = 0)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-4">
            {subMode === 'CUSTOM' && (
              <form onSubmit={handleSolveFreeform} className="space-y-4">
                <h3 className="font-bold text-slate-200 text-base border-b border-white/10 pb-2">
                  Solve Custom Polynomial: <span className="font-mono text-indigo-400">Degrees 1, 2, 3</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Enter Equation (e.g., 2x + 5 = 15, x² + 5x + 6 = 0, x³ - 6x² + 11x - 6 = 0)</label>
                  <input
                    type="text"
                    value={freeEq}
                    onChange={(e) => setFreeEq(e.target.value)}
                    placeholder="e.g. x^3 - 6x^2 + 11x - 6 = 0"
                    className="w-full bg-slate-900/80 text-white font-mono px-3 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-400 py-1">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setFreeEq('2x + 5 = 15')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-xs border border-white/5"
                  >
                    2x + 5 = 15
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreeEq('x² + 5x + 6 = 0')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-xs border border-white/5"
                  >
                    x² + 5x + 6 = 0
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreeEq('x³ - 6x² + 11x - 6 = 0')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-xs border border-white/5"
                  >
                    x³ - 6x² + 11x - 6 = 0
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500 transition-all"
                >
                  Parse, Detect Degree & Solve
                </button>
              </form>
            )}

            {subMode === 'LINEAR' && (
              <form onSubmit={handleSolveLinear} className="space-y-4">
                <h3 className="font-bold text-slate-200 text-base border-b border-white/10 pb-2">
                  Solve Linear Equation: <span className="font-mono text-indigo-400">ax + b = c</span>
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Coefficient a</label>
                    <input
                      type="number"
                      step="any"
                      value={linA}
                      onChange={(e) => setLinA(e.target.value)}
                      className="w-full bg-slate-900/80 text-white font-mono px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Constant b</label>
                    <input
                      type="number"
                      step="any"
                      value={linB}
                      onChange={(e) => setLinB(e.target.value)}
                      className="w-full bg-slate-900/80 text-white font-mono px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">RHS c</label>
                    <input
                      type="number"
                      step="any"
                      value={linC}
                      onChange={(e) => setLinC(e.target.value)}
                      className="w-full bg-slate-900/80 text-white font-mono px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="text-center font-mono text-sm text-indigo-300 bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20">
                  Preview: {linA || 'a'}x {parseFloat(linB) >= 0 ? '+ ' + linB : '- ' + Math.abs(linB || 0)} = {linC || 'c'}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500 transition-all"
                >
                  Solve Linear Equation & Verify
                </button>
              </form>
            )}

            {subMode === 'QUADRATIC' && (
              <form onSubmit={handleSolveQuadratic} className="space-y-4">
                <h3 className="font-bold text-slate-200 text-base border-b border-white/10 pb-2">
                  Solve Quadratic Equation: <span className="font-mono text-indigo-400">ax² + bx + c = 0</span>
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Coeff a (x²)</label>
                    <input
                      type="number"
                      step="any"
                      value={quadA}
                      onChange={(e) => setQuadA(e.target.value)}
                      className="w-full bg-slate-900/80 text-white font-mono px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Coeff b (x)</label>
                    <input
                      type="number"
                      step="any"
                      value={quadB}
                      onChange={(e) => setQuadB(e.target.value)}
                      className="w-full bg-slate-900/80 text-white font-mono px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Constant c</label>
                    <input
                      type="number"
                      step="any"
                      value={quadC}
                      onChange={(e) => setQuadC(e.target.value)}
                      className="w-full bg-slate-900/80 text-white font-mono px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="text-center font-mono text-sm text-indigo-300 bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20">
                  Preview: {quadA || 'a'}x² + {quadB || 'b'}x + {quadC || 'c'} = 0
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500 transition-all"
                >
                  Solve Quadratic Roots & Verify
                </button>
              </form>
            )}

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results & Verification Column */}
        <div className="lg:col-span-6 space-y-4">
          {solution ? (
            <div className="space-y-4">
              <div className="glass-card p-5 border border-emerald-500/30 bg-emerald-500/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">Calculated Roots / Solution</span>
                  {solution.verified && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified ✓
                    </span>
                  )}
                </div>
                <div className="font-mono text-xl md:text-2xl font-bold text-white mb-1">
                  {solution.solutionText}
                </div>
                <div className="text-xs text-slate-400">
                  Equation: <span className="font-mono text-slate-200">{solution.equationStr}</span>
                </div>
              </div>

              {/* Step Explanation Card */}
              <ExplanationCard
                explanation={{
                  title: `${subMode === 'LINEAR' ? 'Linear' : subMode === 'QUADRATIC' ? 'Quadratic' : 'Polynomial'} Equation Solving Process`,
                  steps: solution.steps,
                  finalAnswer: solution.solutionText
                }}
                defaultExpanded={true}
              />
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-slate-400 space-y-2">
              <h3 className="font-semibold text-slate-300">Algebraic Solver</h3>
              <p className="text-xs">
                Enter equation parameters above to calculate variables, inspect discriminants, and view step-by-step verification.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
