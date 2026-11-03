import React, { useState } from 'react';
import { calculateFractions } from '../../engine/fractionEngine';
import ExplanationCard from '../common/ExplanationCard';
import { AlertCircle } from 'lucide-react';

export default function FractionsView({ onSaveHistory }) {
  const [n1, setN1] = useState('1');
  const [d1, setD1] = useState('2');
  const [op, setOp] = useState('+');
  const [n2, setN2] = useState('3');
  const [d2, setD2] = useState('4');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = (e) => {
    e?.preventDefault();
    try {
      setError(null);
      const res = calculateFractions(n1, d1, op, n2, d2);
      setResult(res);
      onSaveHistory?.({
        expression: `${n1}/${d1} ${op} ${n2}/${d2}`,
        result: `${res.exact} (Decimal: ${res.decimal})`,
        explanation: { title: `Fraction Calculation (${op})`, steps: res.steps, finalAnswer: `${res.exact} = ${res.decimal}` },
        mode: 'Fractions'
      });
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Form Input Column */}
      <div className="lg:col-span-6 space-y-4">
        <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-4">
          <h3 className="font-bold text-slate-200 text-base border-b border-white/10 pb-2">
            Fraction Arithmetic & Reduction
          </h3>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="flex items-center justify-center gap-3 md:gap-4 font-mono">
              {/* Fraction 1 */}
              <div className="flex flex-col items-center gap-1.5 w-20 md:w-24">
                <input
                  type="number"
                  value={n1}
                  onChange={(e) => setN1(e.target.value)}
                  className="w-full text-center bg-slate-900/80 text-white font-bold py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Num"
                />
                <div className="w-full h-0.5 bg-indigo-500/50" />
                <input
                  type="number"
                  value={d1}
                  onChange={(e) => setD1(e.target.value)}
                  className="w-full text-center bg-slate-900/80 text-white font-bold py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Den"
                />
              </div>

              {/* Operator Select */}
              <select
                value={op}
                onChange={(e) => setOp(e.target.value)}
                className="bg-slate-800 text-indigo-300 font-bold text-lg px-2 py-3 rounded-xl border border-indigo-500/30 focus:outline-none cursor-pointer"
              >
                <option value="+">+</option>
                <option value="-">−</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>

              {/* Fraction 2 */}
              <div className="flex flex-col items-center gap-1.5 w-20 md:w-24">
                <input
                  type="number"
                  value={n2}
                  onChange={(e) => setN2(e.target.value)}
                  className="w-full text-center bg-slate-900/80 text-white font-bold py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Num"
                />
                <div className="w-full h-0.5 bg-indigo-500/50" />
                <input
                  type="number"
                  value={d2}
                  onChange={(e) => setD2(e.target.value)}
                  className="w-full text-center bg-slate-900/80 text-white font-bold py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Den"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              Calculate Fraction Step-by-Step
            </button>
          </form>
        </div>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-6 space-y-4">
        {result ? (
          <div className="space-y-4">
            <div className="glass-card p-5 border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">Exact Fraction</span>
                <div className="font-mono text-3xl font-bold text-white mt-1">
                  {result.exact}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">Decimal Value</span>
                <div className="font-mono text-2xl font-bold text-indigo-200 mt-1">
                  {result.decimal}
                </div>
              </div>
            </div>

            <ExplanationCard
              explanation={{
                title: `Fraction Calculation & GCD Reduction`,
                steps: result.steps,
                finalAnswer: `${result.exact} = ${result.decimal}`
              }}
              defaultExpanded={true}
            />
          </div>
        ) : (
          <div className="glass-card p-6 text-center text-slate-400 space-y-2">
            <h3 className="font-semibold text-slate-300">Fraction Calculator</h3>
            <p className="text-xs">
              Perform fraction addition, subtraction, multiplication, and division with automatic LCM denominator matching and GCD simplification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
