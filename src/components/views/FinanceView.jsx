import React, { useState } from 'react';
import {
  calculatePercentage,
  calculateProfitLoss,
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculateEMI
} from '../../engine/financeEngine';
import ExplanationCard from '../common/ExplanationCard';
import { DollarSign, AlertCircle } from 'lucide-react';

export default function FinanceView({ onSaveHistory }) {
  const [subMode, setSubMode] = useState('PERCENT'); // 'PERCENT' | 'PROFIT_LOSS' | 'SI' | 'CI' | 'EMI'

  // Percentage states
  const [pType, setPType] = useState('OF_NUMBER');
  const [pVal1, setPVal1] = useState('15');
  const [pVal2, setPVal2] = useState('200');

  // Profit/Loss states
  const [cp, setCp] = useState('500');
  const [sp, setSp] = useState('650');

  // Interest states
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('7.5');
  const [time, setTime] = useState('3');
  const [compFreq, setCompFreq] = useState('1');

  // EMI states
  const [loan, setLoan] = useState('25000');
  const [emiRate, setEmiRate] = useState('8.5');
  const [tenure, setTenure] = useState('3');
  const [tenureType, setTenureType] = useState('YEARS');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = (e) => {
    e?.preventDefault();
    try {
      setError(null);
      let res;
      if (subMode === 'PERCENT') {
        res = calculatePercentage(pType, pVal1, pVal2);
        onSaveHistory?.({
          expression: res.title,
          result: `${res.result}`,
          explanation: { title: res.title, steps: res.steps, finalAnswer: res.result },
          mode: 'Finance'
        });
      } else if (subMode === 'PROFIT_LOSS') {
        res = calculateProfitLoss(cp, sp);
        onSaveHistory?.({
          expression: `CP: $${cp}, SP: $${sp}`,
          result: `${res.status}: $${res.amount} (${res.percentage}%)`,
          explanation: { title: `Profit / Loss Analysis`, steps: res.steps, finalAnswer: `${res.status} of $${res.amount} (${res.percentage}%)` },
          mode: 'Finance'
        });
      } else if (subMode === 'SI') {
        res = calculateSimpleInterest(principal, rate, time);
        onSaveHistory?.({
          expression: `SI (P=$${principal}, R=${rate}%, T=${time}yrs)`,
          result: `Interest: $${res.interest}, Total: $${res.totalAmount}`,
          explanation: { title: `Simple Interest Calculation`, steps: res.steps, finalAnswer: `SI = $${res.interest}` },
          mode: 'Finance'
        });
      } else if (subMode === 'CI') {
        res = calculateCompoundInterest(principal, rate, time, compFreq);
        onSaveHistory?.({
          expression: `CI (P=$${principal}, R=${rate}%, T=${time}yrs)`,
          result: `Interest: $${res.interest}, Total: $${res.totalAmount}`,
          explanation: { title: `Compound Interest Calculation`, steps: res.steps, finalAnswer: `CI = $${res.interest}` },
          mode: 'Finance'
        });
      } else if (subMode === 'EMI') {
        res = calculateEMI(loan, emiRate, tenure, tenureType);
        onSaveHistory?.({
          expression: `EMI Loan: $${loan} @ ${emiRate}%`,
          result: `Monthly EMI: $${res.emi}`,
          explanation: { title: `Loan EMI Calculation`, steps: res.steps, finalAnswer: `Monthly EMI = $${res.emi}` },
          mode: 'Finance'
        });
      }
      setResult(res);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Submode Tab Navigation */}
      <div className="glass-panel p-2 flex items-center justify-center gap-1.5 overflow-x-auto border border-white/10 max-w-2xl mx-auto">
        {[
          { id: 'PERCENT', label: 'Percentage' },
          { id: 'PROFIT_LOSS', label: 'Profit & Loss' },
          { id: 'SI', label: 'Simple Interest' },
          { id: 'CI', label: 'Compound Interest' },
          { id: 'EMI', label: 'Loan EMI' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setSubMode(tab.id); setResult(null); setError(null); }}
            className={`py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              subMode === tab.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <DollarSign className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-200 text-base">Financial Calculator</h3>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
              {/* PERCENTAGE */}
              {subMode === 'PERCENT' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Calculation Type:</label>
                    <select
                      value={pType}
                      onChange={(e) => setPType(e.target.value)}
                      className="w-full bg-slate-900/80 text-white text-xs p-2.5 rounded-lg border border-slate-700 font-semibold"
                    >
                      <option value="OF_NUMBER">% of a Number (e.g. 15% of 200)</option>
                      <option value="INCREASE">% Increase (e.g. 200 + 15%)</option>
                      <option value="DECREASE">% Decrease (e.g. 200 − 15%)</option>
                      <option value="WHAT_PERCENT">What % is X of Y? (e.g. 30 of 200)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Percentage / Value 1</label>
                      <input type="number" step="any" value={pVal1} onChange={(e) => setPVal1(e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700 font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Base Number / Value 2</label>
                      <input type="number" step="any" value={pVal2} onChange={(e) => setPVal2(e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700 font-mono" />
                    </div>
                  </div>
                </div>
              )}

              {/* PROFIT & LOSS */}
              {subMode === 'PROFIT_LOSS' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Cost Price ($)</label>
                    <input type="number" step="any" value={cp} onChange={(e) => setCp(e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Selling Price ($)</label>
                    <input type="number" step="any" value={sp} onChange={(e) => setSp(e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700 font-mono" />
                  </div>
                </div>
              )}

              {/* SIMPLE / COMPOUND INTEREST */}
              {(subMode === 'SI' || subMode === 'CI') && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Principal Amount ($)</label>
                    <input type="number" step="any" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700 font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Annual Rate (%)</label>
                      <input type="number" step="any" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700 font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Time (Years)</label>
                      <input type="number" step="any" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700 font-mono" />
                    </div>
                  </div>
                  {subMode === 'CI' && (
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Compounding Frequency:</label>
                      <select value={compFreq} onChange={(e) => setCompFreq(e.target.value)} className="w-full bg-slate-900/80 text-white text-xs p-2.5 rounded-lg border border-slate-700">
                        <option value="1">Compounded Annually (1/yr)</option>
                        <option value="2">Compounded Semi-Annually (2/yr)</option>
                        <option value="4">Compounded Quarterly (4/yr)</option>
                        <option value="12">Compounded Monthly (12/yr)</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* EMI */}
              {subMode === 'EMI' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Loan Amount ($)</label>
                    <input type="number" step="any" value={loan} onChange={(e) => setLoan(e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700 font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Interest Rate (%)</label>
                      <input type="number" step="any" value={emiRate} onChange={(e) => setEmiRate(e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700 font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Tenure</label>
                      <div className="flex gap-1">
                        <input type="number" step="any" value={tenure} onChange={(e) => setTenure(e.target.value)} className="w-full bg-slate-900/80 text-white p-2 rounded-lg border border-slate-700 font-mono" />
                        <select value={tenureType} onChange={(e) => setTenureType(e.target.value)} className="bg-slate-800 text-xs text-white p-1 rounded-lg border border-slate-700">
                          <option value="YEARS">Yrs</option>
                          <option value="MONTHS">Mos</option>
                        </select>
                      </div>
                    </div>
                  </div>
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
                Calculate Financial Result
              </button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Display Result Summary */}
              {subMode === 'PERCENT' && (
                <div className="glass-card p-5 border border-indigo-500/30 bg-indigo-500/10">
                  <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">{result.title}</span>
                  <div className="font-mono text-3xl font-bold text-white mt-1">{result.result}</div>
                </div>
              )}

              {subMode === 'PROFIT_LOSS' && (
                <div className={`glass-card p-5 border ${
                  result.status === 'PROFIT' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}>
                  <span className="text-xs uppercase tracking-wider font-bold">{result.status} Result</span>
                  <div className="font-mono text-3xl font-bold text-white mt-1">
                    ${result.amount} <span className="text-lg">({result.percentage}%)</span>
                  </div>
                </div>
              )}

              {(subMode === 'SI' || subMode === 'CI') && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-4 border border-indigo-500/30">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {subMode === 'SI' ? 'Simple Interest' : 'Compound Interest'}
                    </span>
                    <div className="font-mono text-2xl font-bold text-indigo-300 mt-1">${result.interest}</div>
                  </div>
                  <div className="glass-card p-4 border border-indigo-500/30">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Amount</span>
                    <div className="font-mono text-2xl font-bold text-white mt-1">${result.totalAmount}</div>
                  </div>
                </div>
              )}

              {subMode === 'EMI' && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="glass-card p-3 border border-indigo-500/30">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly EMI</span>
                    <div className="font-mono text-xl font-bold text-indigo-300 mt-1">${result.emi}</div>
                  </div>
                  <div className="glass-card p-3 border border-indigo-500/30">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Payment</span>
                    <div className="font-mono text-lg font-bold text-white mt-1">${result.totalPayment}</div>
                  </div>
                  <div className="glass-card p-3 border border-indigo-500/30">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Interest</span>
                    <div className="font-mono text-lg font-bold text-purple-300 mt-1">${result.totalInterest}</div>
                  </div>
                </div>
              )}

              <ExplanationCard
                explanation={{
                  title: `Financial Formula & Step-by-Step Breakdown`,
                  steps: result.steps,
                  finalAnswer: result.result || result.amount || result.emi || result.interest
                }}
                defaultExpanded={true}
              />
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-slate-400 space-y-2">
              <h3 className="font-semibold text-slate-300">Financial Mathematics</h3>
              <p className="text-xs">
                Compute percentages, profit/loss, simple interest, compound interest, and loan EMI values with full step breakdowns.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
