import React, { useState } from 'react';
import { calculateStatistics, calculateFrequencyStatistics } from '../../engine/statisticsEngine';
import ExplanationCard from '../common/ExplanationCard';
import { AlertCircle, PieChart, Plus, Trash2, Edit3, Table } from 'lucide-react';

export default function StatisticsView({ onSaveHistory }) {
  const [datasetStr, setDatasetStr] = useState('10, 20, 30, 40, 50');
  const [tableRows, setTableRows] = useState([
    { x: '1', f: '10' },
    { x: '2', f: '12' },
    { x: '3', f: '15' },
    { x: '4', f: '18' },
    { x: '5', f: '20' }
  ]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('TABLE'); // 'TABLE' | 'TEXT'

  const handleXChange = (index, val) => {
    const updated = [...tableRows];
    const curF = updated[index]?.f ?? updated[index]?.y ?? '';
    updated[index] = { x: val, f: curF };
    setTableRows(updated);
  };

  const handleFChange = (index, val) => {
    const updated = [...tableRows];
    const curX = updated[index]?.x ?? '';
    updated[index] = { x: curX, f: val };
    setTableRows(updated);
  };

  const handleAddRow = () => {
    let nextX = '';
    if (tableRows.length > 0) {
      const lastXNum = parseFloat(tableRows[tableRows.length - 1].x);
      if (!isNaN(lastXNum)) {
        if (tableRows.length > 1) {
          const prevXNum = parseFloat(tableRows[tableRows.length - 2].x);
          if (!isNaN(prevXNum)) {
            const step = lastXNum - prevXNum;
            nextX = (lastXNum + step).toString();
          } else {
            nextX = (lastXNum + 1).toString();
          }
        } else {
          nextX = (lastXNum + 1).toString();
        }
      }
    }
    setTableRows([...tableRows, { x: nextX, f: '' }]);
  };

  const handleDeleteRow = (index) => {
    if (tableRows.length <= 1) {
      setTableRows([{ x: '', f: '' }]);
      return;
    }
    setTableRows(tableRows.filter((_, i) => i !== index));
  };

  const handleCalculate = (e) => {
    e?.preventDefault();
    try {
      setError(null);
      if (activeTab === 'TABLE') {
        const res = calculateFrequencyStatistics(tableRows);
        setStats(res);
        onSaveHistory?.({
          expression: `Frequency Table (X-f)`,
          result: `Mean: ${res.mean}, Median: ${res.median}, Mode: ${res.mode}`,
          explanation: { title: `Frequency Distribution Analysis (X-f)`, steps: res.steps, finalAnswer: `Mean = ${res.mean}, Pop StdDev = ${res.popStdDev}` },
          mode: 'Statistics'
        });
      } else {
        const res = calculateStatistics(datasetStr);
        setStats(res);
        onSaveHistory?.({
          expression: `Dataset: [${datasetStr}]`,
          result: `Mean: ${res.mean}, Median: ${res.median}, Mode: ${res.mode}`,
          explanation: { title: `Statistical Analysis`, steps: res.steps, finalAnswer: `Mean = ${res.mean}, Pop StdDev = ${res.popStdDev}` },
          mode: 'Statistics'
        });
      }
    } catch (err) {
      setError(err.message);
      setStats(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Input Form Column */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-200 text-base">Descriptive Statistics</h3>
            </div>
            {/* Input Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('TABLE')}
                className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 ${
                  activeTab === 'TABLE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-3 h-3" /> Table (X-f)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('TEXT')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  activeTab === 'TEXT' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Text
              </button>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            {activeTab === 'TABLE' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Frequency Distribution Table</span>
                  <span>{tableRows.length} rows</span>
                </div>

                {/* Table Column Headers */}
                <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-300 px-1 border-b border-white/10 pb-1.5">
                  <div className="col-span-1 text-center text-slate-500">#</div>
                  <div className="col-span-5 text-indigo-300">X (Value)</div>
                  <div className="col-span-5 text-purple-300">f (Frequency)</div>
                  <div className="col-span-1 text-center"></div>
                </div>

                {/* Table Data Rows */}
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {tableRows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <span className="col-span-1 text-xs font-mono text-slate-500 text-center">{idx + 1}</span>
                      <input
                        type="number"
                        step="any"
                        value={row.x}
                        onChange={(e) => handleXChange(idx, e.target.value)}
                        placeholder="X value"
                        className="col-span-5 bg-slate-900/80 text-white font-mono px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={row.f ?? row.y ?? ''}
                        onChange={(e) => handleFChange(idx, e.target.value)}
                        placeholder="Frequency f"
                        className="col-span-5 bg-slate-900/80 text-white font-mono px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(idx)}
                        className="col-span-1 flex items-center justify-center p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                        title="Delete Row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddRow}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row (X & f)
                </button>
                
                <div className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2 rounded-lg border border-white/5">
                  Frequency Distribution: Mean (μ) = Σfx / Σf, Median via Cumulative Frequencies, Mode = X with max f.
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Dataset (numbers separated by commas or spaces):
                </label>
                <textarea
                  rows={4}
                  value={datasetStr}
                  onChange={(e) => setDatasetStr(e.target.value)}
                  className="w-full bg-slate-900/80 text-white font-mono p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="e.g. 10, 20, 30, 40, 50"
                />
              </div>
            )}

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
              Analyze Dataset Statistics
            </button>
          </form>
        </div>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-7 space-y-4">
        {stats ? (
          <div className="space-y-4">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="glass-card p-3 border border-indigo-500/20">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mean (μ / x̄)</span>
                <div className="font-mono text-lg font-bold text-indigo-300 mt-1">{stats.mean}</div>
              </div>
              <div className="glass-card p-3 border border-indigo-500/20">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Median</span>
                <div className="font-mono text-lg font-bold text-indigo-300 mt-1">{stats.median}</div>
              </div>
              <div className="glass-card p-3 border border-indigo-500/20">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mode</span>
                <div className="font-mono text-base font-bold text-indigo-300 mt-1 truncate">{stats.mode}</div>
              </div>
              <div className="glass-card p-3 border border-indigo-500/20">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Range</span>
                <div className="font-mono text-lg font-bold text-indigo-300 mt-1">{stats.range}</div>
              </div>
            </div>

            {/* Variance & Std Dev Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="glass-card p-3 border border-purple-500/30 bg-purple-500/5">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Variance (σ²)</span>
                <div className="font-mono text-lg font-bold text-purple-200 mt-1">{stats.popVariance}</div>
              </div>
              <div className="glass-card p-3 border border-purple-500/30 bg-purple-500/5">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Standard Deviation (σ)</span>
                <div className="font-mono text-lg font-bold text-purple-200 mt-1">{stats.popStdDev}</div>
              </div>
              <div className="glass-card p-3 border border-cyan-500/30 bg-cyan-500/5">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Sample Var (s²)</span>
                <div className="font-mono text-lg font-bold text-cyan-200 mt-1">{stats.sampleVariance}</div>
              </div>
              <div className="glass-card p-3 border border-cyan-500/30 bg-cyan-500/5">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Sample Std Dev (s)</span>
                <div className="font-mono text-lg font-bold text-cyan-200 mt-1">{stats.sampleStdDev}</div>
              </div>
            </div>

            <ExplanationCard
              explanation={{
                title: `Statistical Formulas & Step-by-Step Breakdown`,
                steps: stats.steps,
                finalAnswer: `Mean = ${stats.mean}, Pop StdDev (σ) = ${stats.popStdDev}`
              }}
              defaultExpanded={true}
            />
          </div>
        ) : (
          <div className="glass-card p-6 text-center text-slate-400 space-y-2">
            <h3 className="font-semibold text-slate-300">Statistical Analysis</h3>
            <p className="text-xs">
              Enter a dataset of numbers to compute Mean, Median, Mode (handling multimodal or no-mode cases), Range, Sample/Population Variance, and Standard Deviation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

