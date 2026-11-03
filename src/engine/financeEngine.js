// Financial Mathematics Engine: Percentage, Profit/Loss, SI, CI, and EMI

import { cleanFloat } from './evaluator.js';

/**
 * Percentage Calculations
 */
export function calculatePercentage(type, pInput, vInput) {
  const p = parseFloat(pInput);
  const v = parseFloat(vInput);

  if (isNaN(p) || isNaN(v)) throw new Error('Please enter valid numeric inputs.');

  const steps = [];

  if (type === 'OF_NUMBER') {
    // p% of v
    const res = cleanFloat((p / 100) * v);
    steps.push(`Calculate ${p}% of ${v}`);
    steps.push(`Formula: (${p} / 100) × ${v}`);
    steps.push(`= ${p / 100} × ${v} = ${res}`);
    return { title: `${p}% of ${v}`, result: res, steps };
  }

  if (type === 'INCREASE') {
    // v increased by p%
    const incAmount = cleanFloat((p / 100) * v);
    const total = cleanFloat(v + incAmount);
    steps.push(`Increase ${v} by ${p}%`);
    steps.push(`Increase Amount = (${p} / 100) × ${v} = ${incAmount}`);
    steps.push(`Final Amount = ${v} + ${incAmount} = ${total}`);
    return { title: `${v} + ${p}% Increase`, result: total, steps };
  }

  if (type === 'DECREASE') {
    // v decreased by p%
    const decAmount = cleanFloat((p / 100) * v);
    const total = cleanFloat(v - decAmount);
    steps.push(`Decrease ${v} by ${p}%`);
    steps.push(`Decrease Amount = (${p} / 100) × ${v} = ${decAmount}`);
    steps.push(`Final Amount = ${v} − ${decAmount} = ${total}`);
    return { title: `${v} - ${p}% Decrease`, result: total, steps };
  }

  if (type === 'WHAT_PERCENT') {
    // p is what % of v
    if (v === 0) throw new Error('Base value cannot be zero.');
    const percentRes = cleanFloat((p / v) * 100);
    steps.push(`What percentage is ${p} of ${v}?`);
    steps.push(`Formula: (${p} / ${v}) × 100`);
    steps.push(`= ${p / v} × 100 = ${percentRes}%`);
    return { title: `${p} as % of ${v}`, result: `${percentRes}%`, steps };
  }

  throw new Error('Invalid percentage calculation type');
}

/**
 * Profit & Loss Calculator
 */
export function calculateProfitLoss(cpInput, spInput) {
  const cp = parseFloat(cpInput);
  const sp = parseFloat(spInput);

  if (isNaN(cp) || isNaN(sp) || cp <= 0 || sp < 0) {
    throw new Error('Cost Price must be positive and Selling Price non-negative.');
  }

  const steps = [];
  steps.push(`Cost Price (CP) = $${cp}, Selling Price (SP) = $${sp}`);

  if (sp > cp) {
    const profit = cleanFloat(sp - cp);
    const profitPercent = cleanFloat((profit / cp) * 100);
    steps.push(`Since SP ($${sp}) > CP ($${cp}), it is a PROFIT.`);
    steps.push(`Profit Formula: SP − CP = $${sp} − $${cp} = $${profit}`);
    steps.push(`Profit Percentage: (Profit / CP) × 100 = ($${profit} / $${cp}) × 100 = ${profitPercent}%`);

    return { status: 'PROFIT', amount: profit, percentage: profitPercent, steps };
  } else if (sp < cp) {
    const loss = cleanFloat(cp - sp);
    const lossPercent = cleanFloat((loss / cp) * 100);
    steps.push(`Since SP ($${sp}) < CP ($${cp}), it is a LOSS.`);
    steps.push(`Loss Formula: CP − SP = $${cp} − $${sp} = $${loss}`);
    steps.push(`Loss Percentage: (Loss / CP) × 100 = ($${loss} / $${cp}) × 100 = ${lossPercent}%`);

    return { status: 'LOSS', amount: loss, percentage: lossPercent, steps };
  } else {
    steps.push(`Since SP ($${sp}) = CP ($${cp}), there is NO PROFIT and NO LOSS.`);
    return { status: 'NEUTRAL', amount: 0, percentage: 0, steps };
  }
}

/**
 * Simple Interest Calculator
 */
export function calculateSimpleInterest(pInput, rInput, tInput) {
  const P = parseFloat(pInput);
  const R = parseFloat(rInput);
  const T = parseFloat(tInput);

  if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || R < 0 || T <= 0) {
    throw new Error('Principal (P), Rate (R), and Time (T) must be positive values.');
  }

  const SI = cleanFloat((P * R * T) / 100);
  const Amount = cleanFloat(P + SI);

  const steps = [
    `Principal (P) = ${P}, Rate (R) = ${R}% per annum, Time (T) = ${T} years`,
    `Simple Interest Formula: SI = (P × R × T) / 100`,
    `SI = (${P} × ${R} × ${T}) / 100 = ${P * R * T} / 100 = ${SI}`,
    `Total Amount Formula: A = P + SI`,
    `A = ${P} + ${SI} = ${Amount}`
  ];

  return { interest: SI, totalAmount: Amount, steps };
}

/**
 * Compound Interest Calculator
 */
export function calculateCompoundInterest(pInput, rInput, tInput, freqInput = 1) {
  const P = parseFloat(pInput);
  const R = parseFloat(rInput);
  const T = parseFloat(tInput);
  const n = parseInt(freqInput, 10); // compounding times per year (1=annually, 2=semi, 4=quarterly, 12=monthly)

  if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || R < 0 || T <= 0) {
    throw new Error('Principal, Rate, and Time must be positive values.');
  }

  const rateDecimal = R / 100;
  const Amount = cleanFloat(P * Math.pow(1 + rateDecimal / n, n * T));
  const CI = cleanFloat(Amount - P);

  const steps = [
    `Principal (P) = ${P}, Rate (R) = ${R}%, Time (T) = ${T} years, Compounding frequency (n) = ${n}/year`,
    `Compound Interest Formula: A = P × (1 + R/(100×n))^(n×T)`,
    `A = ${P} × (1 + ${R}/(100×${n}))^(${n}×${T})`,
    `A = ${P} × (1 + ${R / (100 * n)})^(${n * T}) = ${Amount}`,
    `Compound Interest (CI) = A − P = ${Amount} − ${P} = ${CI}`
  ];

  return { interest: CI, totalAmount: Amount, steps };
}

/**
 * Loan EMI Calculator
 */
export function calculateEMI(loanInput, rateInput, tenureInput, tenureType = 'YEARS') {
  const P = parseFloat(loanInput);
  const R = parseFloat(rateInput);
  let tenureVal = parseFloat(tenureInput);

  if (isNaN(P) || isNaN(R) || isNaN(tenureVal) || P <= 0 || R < 0 || tenureVal <= 0) {
    throw new Error('Loan amount, interest rate, and tenure must be positive numbers.');
  }

  const N = tenureType === 'YEARS' ? tenureVal * 12 : tenureVal; // tenure in months
  const steps = [];

  steps.push(`Loan Amount (P) = ${P}`);
  steps.push(`Annual Interest Rate (R) = ${R}%`);
  steps.push(`Tenure (N) = ${N} months`);

  let emi, totalPayment, totalInterest;

  if (R === 0) {
    // 0% interest fallback
    emi = cleanFloat(P / N);
    totalPayment = P;
    totalInterest = 0;
    steps.push(`Since Interest Rate is 0%:`);
    steps.push(`Monthly EMI = Loan Amount / N = ${P} / ${N} = ${emi}`);
  } else {
    const r = R / (12 * 100); // monthly interest rate
    const factor = Math.pow(1 + r, N);
    emi = cleanFloat((P * r * factor) / (factor - 1));
    totalPayment = cleanFloat(emi * N);
    totalInterest = cleanFloat(totalPayment - P);

    steps.push(`Monthly Interest Rate (r) = R / (12 × 100) = ${R} / 1200 = ${r}`);
    steps.push(`EMI Formula: EMI = [P × r × (1+r)^N] / [(1+r)^N − 1]`);
    steps.push(`EMI = [${P} × ${r} × (1+${r})^${N}] / [(1+${r})^${N} − 1] = ${emi}`);
    steps.push(`Total Payment = EMI × N = ${emi} × ${N} = ${totalPayment}`);
    steps.push(`Total Interest Payable = Total Payment − P = ${totalPayment} − ${P} = ${totalInterest}`);
  }

  return { emi, totalPayment, totalInterest, steps };
}
