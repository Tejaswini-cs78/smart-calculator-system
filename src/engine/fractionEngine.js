// Fraction Calculator Engine with GCD/LCM and Step-by-Step Explanations

import { cleanFloat } from './evaluator.js';

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function simplifyFraction(num, den) {
  if (den === 0) throw new Error('Denominator cannot be zero.');
  if (num === 0) return { num: 0, den: 1, text: '0' };

  let g = gcd(num, den);
  let n = num / g;
  let d = den / g;

  if (d < 0) {
    n = -n;
    d = -d;
  }

  return {
    num: n,
    den: d,
    text: d === 1 ? `${n}` : `${n}/${d}`
  };
}

export function calculateFractions(n1, d1, op, n2, d2) {
  n1 = parseInt(n1, 10);
  d1 = parseInt(d1, 10);
  n2 = parseInt(n2, 10);
  d2 = parseInt(d2, 10);

  if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
    throw new Error('Please enter valid integer values for all fraction numerators and denominators.');
  }

  if (d1 === 0 || d2 === 0) {
    throw new Error('Denominator cannot be zero.');
  }

  const steps = [];
  const frac1Str = `${n1}/${d1}`;
  const frac2Str = `${n2}/${d2}`;
  steps.push(`Operation: ${frac1Str} ${op} ${frac2Str}`);

  let resultNum, resultDen;

  if (op === '+' || op === '-') {
    const commonDen = lcm(d1, d2);
    const m1 = commonDen / d1;
    const m2 = commonDen / d2;

    const scaledN1 = n1 * m1;
    const scaledN2 = n2 * m2;

    steps.push(`Step 1: Find Least Common Denominator (LCM of ${d1} and ${d2}) = ${commonDen}`);
    steps.push(`Step 2: Convert fractions to common denominator:`);
    steps.push(`${frac1Str} = (${n1} × ${m1})/(${d1} × ${m1}) = ${scaledN1}/${commonDen}`);
    steps.push(`${frac2Str} = (${n2} × ${m2})/(${d2} × ${m2}) = ${scaledN2}/${commonDen}`);

    if (op === '+') {
      resultNum = scaledN1 + scaledN2;
      resultDen = commonDen;
      steps.push(`Step 3: Add numerators: (${scaledN1} + ${scaledN2}) / ${commonDen} = ${resultNum}/${commonDen}`);
    } else {
      resultNum = scaledN1 - scaledN2;
      resultDen = commonDen;
      steps.push(`Step 3: Subtract numerators: (${scaledN1} − ${scaledN2}) / ${commonDen} = ${resultNum}/${commonDen}`);
    }
  } else if (op === '*' || op === '×') {
    resultNum = n1 * n2;
    resultDen = d1 * d2;
    steps.push(`Step 1: Multiply numerators together: ${n1} × ${n2} = ${resultNum}`);
    steps.push(`Step 2: Multiply denominators together: ${d1} × ${d2} = ${resultDen}`);
    steps.push(`Result before simplification: ${resultNum}/${resultDen}`);
  } else if (op === '/' || op === '÷') {
    if (n2 === 0) throw new Error('Cannot divide by a fraction with numerator 0 (division by zero).');
    resultNum = n1 * d2;
    resultDen = d1 * n2;
    steps.push(`Step 1: Multiply first fraction by reciprocal of second fraction (${d2}/${n2}):`);
    steps.push(`(${n1}/${d1}) × (${d2}/${n2})`);
    steps.push(`Numerator: ${n1} × ${d2} = ${resultNum}`);
    steps.push(`Denominator: ${d1} × ${n2} = ${resultDen}`);
    steps.push(`Result before simplification: ${resultNum}/${resultDen}`);
  }

  const simplified = simplifyFraction(resultNum, resultDen);
  const commonFactor = gcd(resultNum, resultDen);

  if (commonFactor > 1) {
    steps.push(`Step 4: Simplify fraction by dividing numerator & denominator by GCD (${commonFactor}):`);
    steps.push(`${resultNum} ÷ ${commonFactor} = ${simplified.num}`);
    steps.push(`${resultDen} ÷ ${commonFactor} = ${simplified.den}`);
    steps.push(`Simplified Fraction: ${simplified.text}`);
  } else {
    steps.push(`Fraction is already in simplest form: ${simplified.text}`);
  }

  const decimalVal = cleanFloat(simplified.num / simplified.den);
  steps.push(`Decimal equivalent: ${decimalVal}`);

  return {
    exact: simplified.text,
    num: simplified.num,
    den: simplified.den,
    decimal: decimalVal,
    steps,
  };
}
