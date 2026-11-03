import React, { useState, useEffect } from 'react';
import { CONVERSION_CATEGORIES, convertUnits, fetchLiveExchangeRates } from '../../engine/converterEngine';
import ExplanationCard from '../common/ExplanationCard';
import { ArrowRightLeft, AlertCircle } from 'lucide-react';

export default function ConverterView({ onSaveHistory }) {
  const [categoryKey, setCategoryKey] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [valueStr, setValueStr] = useState('1000');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLiveExchangeRates();
  }, []);

  const category = CONVERSION_CATEGORIES[categoryKey];

  const handleCategoryChange = (key) => {
    setCategoryKey(key);
    if (key === 'currency') fetchLiveExchangeRates();
    const cat = CONVERSION_CATEGORIES[key];
    const unitKeys = Object.keys(cat.units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
    setResult(null);
    setError(null);
  };

  const handleConvert = (e) => {
    e?.preventDefault();
    try {
      setError(null);
      const res = convertUnits(categoryKey, fromUnit, toUnit, valueStr);
      setResult(res);
      onSaveHistory?.({
        expression: `${valueStr} ${fromUnit} → ${toUnit}`,
        result: `${res.result} ${toUnit}`,
        explanation: { title: `Unit Conversion (${category.name})`, steps: res.steps, finalAnswer: `${res.result} ${toUnit}` },
        mode: 'Converter'
      });
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Category Tabs & Form */}
      <div className="lg:col-span-6 space-y-4">
        {/* Category selector buttons */}
        <div className="glass-panel p-2 grid grid-cols-3 gap-1.5 border border-white/10">
          {Object.keys(CONVERSION_CATEGORIES).map((key) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all truncate ${
                categoryKey === key ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {CONVERSION_CATEGORIES[key].name}
            </button>
          ))}
        </div>

        <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-200 text-base">{category.name} Converter</h3>
          </div>

          <form onSubmit={handleConvert} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Value to Convert:</label>
              <input
                type="number"
                step="any"
                value={valueStr}
                onChange={(e) => setValueStr(e.target.value)}
                className="w-full bg-slate-900/80 text-white font-mono text-lg p-2.5 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">From Unit:</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full bg-slate-900/80 text-white font-medium p-2.5 rounded-lg border border-slate-700 text-xs"
                >
                  {Object.keys(category.units).map((uKey) => (
                    <option key={uKey} value={uKey}>
                      {category.units[uKey].name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">To Unit:</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full bg-slate-900/80 text-white font-medium p-2.5 rounded-lg border border-slate-700 text-xs"
                >
                  {Object.keys(category.units).map((uKey) => (
                    <option key={uKey} value={uKey}>
                      {category.units[uKey].name}
                    </option>
                  ))}
                </select>
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
              Convert Units & Show Formula
            </button>
          </form>
        </div>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-6 space-y-4">
        {result ? (
          <div className="space-y-4">
            <div className="glass-card p-5 border border-indigo-500/30 bg-indigo-500/10">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">Conversion Result</span>
              <div className="font-mono text-3xl font-bold text-white mt-1">
                {result.result} <span className="text-indigo-300 text-lg font-normal">{result.toUnit}</span>
              </div>
              <div className="text-xs text-slate-400 mt-2">
                {result.fromValue} {result.fromUnit} = {result.result} {result.toUnit}
              </div>
            </div>

            <ExplanationCard
              explanation={{
                title: `Unit Conversion Step-by-Step`,
                steps: result.steps,
                finalAnswer: `${result.result} ${result.toUnit}`
              }}
              defaultExpanded={true}
            />
          </div>
        ) : (
          <div className="glass-card p-6 text-center text-slate-400 space-y-2">
            <h3 className="font-semibold text-slate-300">Unit Converter</h3>
            <p className="text-xs">
              Select category (Length, Weight, Temperature, Time, Area, Storage), choose units, and view conversion steps.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
