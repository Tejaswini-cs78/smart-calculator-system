// Step-by-Step Algebra Engine: Linear and Quadratic Equations

import { cleanFloat } from './evaluator.js';

/**
 * Solves linear equation of form ax + b = c or parses expression string like "2x + 5 = 15"
 */
export function solveLinearEquation(aInput, bInput, cInput) {
  const a = parseFloat(aInput);
  const b = parseFloat(bInput);
  const c = parseFloat(cInput);

  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw new Error('Please enter valid numeric coefficients for a, b, and c.');
  }

  if (a === 0) {
    if (b === c) {
      return {
        type: 'IDENTITY',
        equationStr: `${b} = ${c}`,
        explanation: ['Equation 0x + ' + b + ' = ' + c + ' is true for all real values of x.'],
        solutionText: 'Infinite solutions (x can be any real number)',
      };
    } else {
      return {
        type: 'CONTRADICTION',
        equationStr: `${b} = ${c}`,
        explanation: [`Equation ${b} = ${c} is false. No solution exists.`],
        solutionText: 'No solution',
      };
    }
  }

  const steps = [];
  const eqOriginal = `${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${c}`;
  steps.push(`Original equation: ${eqOriginal}`);

  // Step 1: Isolate linear term (c - b)
  const rhsAfterSub = cleanFloat(c - b);
  const subOpText = b > 0 ? `Subtract ${b} from both sides` : b < 0 ? `Add ${Math.abs(b)} to both sides` : 'Keep RHS constant';
  steps.push(`Step 1: ${subOpText}`);
  steps.push(`${a}x = ${rhsAfterSub}`);

  // Step 2: Divide by coefficient a
  const xVal = cleanFloat(rhsAfterSub / a);
  steps.push(`Step 2: Divide both sides by ${a}`);
  steps.push(`x = ${rhsAfterSub} / ${a}`);
  steps.push(`x = ${xVal}`);

  // Step 3: Verification
  const verifyLhs = cleanFloat(a * xVal + b);
  const isVerified = Math.abs(verifyLhs - c) < 1e-9;
  steps.push(`Step 3: Verification by substituting x = ${xVal} into original equation:`);
  steps.push(`${a}(${xVal}) ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${verifyLhs}`);
  steps.push(`${verifyLhs} = ${c}`);
  steps.push(isVerified ? 'Verified ✓ Correct' : 'Verification failed ✗');

  return {
    type: 'LINEAR',
    equationStr: eqOriginal,
    x: xVal,
    roots: [xVal],
    steps,
    verified: isVerified,
    solutionText: `x = ${xVal}`,
  };
}

/**
 * Parses a simple equation string like "2x + 5 = 15" or "3x - 9 = 0"
 */
export function parseAndSolveLinear(str) {
  if (!str.includes('=')) {
    throw new Error('Linear equation must contain an equals sign "=" (e.g. 2x + 5 = 15)');
  }
  const parts = str.split('=').map(p => p.trim());
  const lhs = parts[0];
  const rhsVal = parseFloat(parts[1]);

  if (isNaN(rhsVal)) {
    throw new Error('Right side of equation must be a valid number.');
  }

  // Regex to extract ax + b
  const match = lhs.match(/^([+-]?\s*\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?$/i);
  if (!match) {
    throw new Error('Supported format: ax + b = c (e.g. 2x + 5 = 15 or 3x - 4 = 11)');
  }

  let aStr = match[1].replace(/\s+/g, '');
  if (aStr === '' || aStr === '+') aStr = '1';
  if (aStr === '-') aStr = '-1';
  const a = parseFloat(aStr);

  let b = 0;
  if (match[2]) {
    b = parseFloat(match[2].replace(/\s+/g, ''));
  }

  return solveLinearEquation(a, b, rhsVal);
}

/**
 * Solves quadratic equation ax² + bx + c = 0
 */
export function solveQuadraticEquation(aInput, bInput, cInput) {
  const a = parseFloat(aInput);
  const b = parseFloat(bInput);
  const c = parseFloat(cInput);

  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw new Error('Please enter valid numeric coefficients a, b, and c.');
  }

  if (a === 0) {
    return solveLinearEquation(b, c, 0);
  }

  const steps = [];
  const formatTerm = (val, symbol) => {
    if (val === 0) return '';
    const sign = val > 0 ? '+ ' : '- ';
    const absVal = Math.abs(val);
    const numStr = absVal === 1 && symbol ? '' : absVal;
    return `${sign}${numStr}${symbol} `;
  };

  const eqStr = `${a === 1 ? '' : a === -1 ? '-' : a}x² ${formatTerm(b, 'x')}${formatTerm(c, '')}= 0`.replace(/^\+\s*/, '');
  steps.push(`Original equation: ${eqStr}`);
  steps.push(`Identified coefficients: a = ${a}, b = ${b}, c = ${c}`);

  // Step 1: Calculate Discriminant D = b² - 4ac
  const bSquared = cleanFloat(b * b);
  const fourAC = cleanFloat(4 * a * c);
  const D = cleanFloat(bSquared - fourAC);

  steps.push(`Step 1: Compute Discriminant D = b² − 4ac`);
  steps.push(`D = (${b})² − 4(${a})(${c})`);
  steps.push(`D = ${bSquared} − (${fourAC})`);
  steps.push(`D = ${D}`);

  steps.push(`Step 2: Apply Quadratic Formula: x = (−b ± √D) / (2a)`);

  let root1, root2, isComplex = false, verified = false;

  if (D > 0) {
    const sqrtD = cleanFloat(Math.sqrt(D));
    steps.push(`Since D > 0, there are two distinct real roots.`);
    steps.push(`√D = √${D} = ${sqrtD}`);

    root1 = cleanFloat((-b + sqrtD) / (2 * a));
    root2 = cleanFloat((-b - sqrtD) / (2 * a));

    steps.push(`x₁ = (−(${b}) + ${sqrtD}) / (2 × ${a}) = ${-b + sqrtD} / ${2 * a} = ${root1}`);
    steps.push(`x₂ = (−(${b}) − ${sqrtD}) / (2 × ${a}) = ${-b - sqrtD} / ${2 * a} = ${root2}`);

    // Verification step
    const v1 = cleanFloat(a * root1 * root1 + b * root1 + c);
    const v2 = cleanFloat(a * root2 * root2 + b * root2 + c);
    steps.push(`Step 3: Verification by substituting roots into ${eqStr}:`);
    steps.push(`For x₁ = ${root1}: ${a}(${root1})² + ${b}(${root1}) + ${c} = ${v1} (Expected 0)`);
    steps.push(`For x₂ = ${root2}: ${a}(${root2})² + ${b}(${root2}) + ${c} = ${v2} (Expected 0)`);

    verified = Math.abs(v1) < 1e-6 && Math.abs(v2) < 1e-6;
    steps.push(verified ? 'Verified ✓ Correct' : 'Verification failed ✗');

    return {
      type: 'QUADRATIC_TWO_REAL',
      equationStr: eqStr,
      discriminant: D,
      roots: [root1, root2],
      solutionText: `x₁ = ${root1}, x₂ = ${root2}`,
      steps,
      verified,
    };
  } else if (D === 0) {
    steps.push(`Since D = 0, there is one repeated real root.`);
    root1 = cleanFloat(-b / (2 * a));
    root2 = root1;

    steps.push(`x = −(${b}) / (2 × ${a}) = ${root1}`);

    const v1 = cleanFloat(a * root1 * root1 + b * root1 + c);
    steps.push(`Step 3: Verification:`);
    steps.push(`${a}(${root1})² + ${b}(${root1}) + ${c} = ${v1}`);
    verified = Math.abs(v1) < 1e-6;
    steps.push(verified ? 'Verified ✓ Correct' : 'Verification failed ✗');

    return {
      type: 'QUADRATIC_REPEATED_REAL',
      equationStr: eqStr,
      discriminant: D,
      roots: [root1],
      solutionText: `x = ${root1} (repeated root)`,
      steps,
      verified,
    };
  } else {
    // D < 0 -> Complex roots
    isComplex = true;
    const realPart = cleanFloat(-b / (2 * a));
    const imagPart = cleanFloat(Math.sqrt(-D) / (2 * a));

    steps.push(`Since D < 0 (${D}), there are two complex conjugate roots.`);
    steps.push(`Real Part = −b / (2a) = ${realPart}`);
    steps.push(`Imaginary Part = √(${Math.abs(D)}) / (2a) = ${imagPart}`);
    steps.push(`x₁ = ${realPart} + ${imagPart}i`);
    steps.push(`x₂ = ${realPart} − ${imagPart}i`);

    return {
      type: 'QUADRATIC_COMPLEX',
      equationStr: eqStr,
      discriminant: D,
      roots: [`${realPart} + ${imagPart}i`, `${realPart} - ${imagPart}i`],
      solutionText: `x = ${realPart} ± ${imagPart}i`,
      steps,
      verified: true,
    };
  }
}

/**
 * Freeform Custom Polynomial Equation Parser & Solver (Degrees 1, 2, 3)
 * Supports natural inputs: "2x + 5 = 15", "2*x = 3", "x^2 + 5x + 6 = 0", "x^3 - 6x^2 + 11x - 6 = 0"
 */
function parsePolynomialSide(sideStr) {
  let str = sideStr.trim()
    .replace(/²/g, '^2')
    .replace(/³/g, '^3');

  const coeffs = { 0: 0, 1: 0, 2: 0, 3: 0 };
  if (!str) return coeffs;

  // Insert + before - if not preceded by ^ or operator
  let normalized = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '-' && i > 0 && str[i - 1] !== '^' && str[i - 1] !== '+' && str[i - 1] !== '-' && str[i - 1] !== '*') {
      normalized += '+-';
    } else {
      normalized += ch;
    }
  }

  const terms = normalized.split('+').filter(t => t.length > 0);

  for (let term of terms) {
    let power = 0;
    let coeff = 1;

    if (term.includes('x')) {
      const parts = term.split('x');
      let coeffPart = parts[0].replace(/\*/g, '').replace(/\s+/g, '').trim();
      if (coeffPart === '' || coeffPart === '+') coeff = 1;
      else if (coeffPart === '-') coeff = -1;
      else coeff = parseFloat(coeffPart);

      let powPart = parts[1] ? parts[1].trim() : '';
      if (powPart.startsWith('^')) {
        power = parseInt(powPart.substring(1), 10);
      } else {
        power = 1;
      }
    } else {
      coeff = parseFloat(term.replace(/\s+/g, ''));
      power = 0;
    }

    if (isNaN(coeff) || isNaN(power)) {
      throw new Error(`Could not parse polynomial term '${term}'`);
    }

    if (power < 0 || power > 3 || !Number.isInteger(power)) {
      throw new Error(`Unsupported term degree ${power}. Only polynomial equations up to degree 3 (cubic) are supported.`);
    }

    coeffs[power] = (coeffs[power] || 0) + coeff;
  }

  return coeffs;
}

function getFactors(num) {
  const n = Math.abs(Math.round(num));
  if (n === 0) return [1];
  const factors = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i * i !== n) factors.push(n / i);
    }
  }
  return factors;
}

function formatPoly(a, b, c, d) {
  let str = '';
  if (a !== 0) str += `${a === 1 ? '' : a === -1 ? '-' : a}x³ `;
  if (b !== 0) str += `${b > 0 && str ? '+ ' : b < 0 ? '- ' : ''}${Math.abs(b) === 1 ? '' : Math.abs(b)}x² `;
  if (c !== 0) str += `${c > 0 && str ? '+ ' : c < 0 ? '- ' : ''}${Math.abs(c) === 1 ? '' : Math.abs(c)}x `;
  if (d !== 0 || !str) str += `${d > 0 && str ? '+ ' : d < 0 ? '- ' : ''}${Math.abs(d)}`;
  return str.trim();
}

export function solveCubicPolynomial(a, b, c, d, eqStr, steps = []) {
  const roots = [];

  let rationalRoot = null;
  const absD = Math.abs(d);
  const absA = Math.abs(a);

  if (absD === 0) {
    rationalRoot = 0;
  } else {
    const pFactors = getFactors(Math.round(absD * 100));
    const qFactors = getFactors(Math.round(absA * 100));
    const candidates = new Set();

    for (let p of pFactors) {
      for (let q of qFactors) {
        if (q !== 0) {
          candidates.add(p / q);
          candidates.add(-p / q);
        }
      }
    }

    for (let r of candidates) {
      const val = cleanFloat(a * Math.pow(r, 3) + b * Math.pow(r, 2) + c * r + d);
      if (Math.abs(val) < 1e-6) {
        rationalRoot = cleanFloat(r);
        break;
      }
    }
  }

  if (rationalRoot !== null) {
    steps.push(`Found rational root: x₁ = ${rationalRoot}`);
    roots.push(rationalRoot);

    const quadA = a;
    const quadB = cleanFloat(b + quadA * rationalRoot);
    const quadC = cleanFloat(c + quadB * rationalRoot);

    steps.push(`Reduced via synthetic division to quadratic: ${quadA}x² + ${quadB}x + ${quadC} = 0`);

    const quadRes = solveQuadraticEquation(quadA, quadB, quadC);
    if (quadRes.roots) {
      quadRes.roots.forEach(r => {
        if (!roots.includes(r)) roots.push(r);
      });
    }
  } else {
    steps.push(`Applying Cardano's cubic formula...`);
    const f = cleanFloat(((3 * c / a) - ((b * b) / (a * a))) / 3);
    const g = cleanFloat(((2 * Math.pow(b, 3)) / Math.pow(a, 3) - (9 * b * c) / (a * a) + (27 * d / a)) / 27);
    const h = cleanFloat((g * g / 4) + (Math.pow(f, 3) / 27));

    if (h > 0) {
      const R = cleanFloat(-(g / 2) + Math.sqrt(h));
      const S = cleanFloat(Math.cbrt(R));
      const T = cleanFloat(-(g / 2) - Math.sqrt(h));
      const U = cleanFloat(Math.cbrt(T));
      const x1 = cleanFloat((S + U) - (b / (3 * a)));
      roots.push(x1);
    } else {
      const i = Math.sqrt(Math.abs((g * g / 4) - h));
      const j = Math.cbrt(i);
      const k = Math.acos(Math.min(1, Math.max(-1, -(g / (2 * i)))));
      const L = -j;
      const M = Math.cos(k / 3);
      const N = Math.sqrt(3) * Math.sin(k / 3);
      const P = -(b / (3 * a));

      const x1 = cleanFloat(2 * j * Math.cos(k / 3) + P);
      const x2 = cleanFloat(L * (M + N) + P);
      const x3 = cleanFloat(L * (M - N) + P);
      roots.push(x1, x2, x3);
    }
  }

  steps.push(`Step: Substitution verification in original equation:`);
  let verified = true;
  roots.forEach((r, idx) => {
    if (typeof r === 'number') {
      const lhsVal = cleanFloat(a * Math.pow(r, 3) + b * Math.pow(r, 2) + c * r + d);
      const ok = Math.abs(lhsVal) < 1e-4;
      steps.push(`x${idx + 1} = ${r} ──► ${a}(${r})³ + ${b}(${r})² + ${c}(${r}) + ${d} = ${lhsVal} ${ok ? '✓ Verified' : ''}`);
      if (!ok) verified = false;
    }
  });

  const solStr = roots.map((r, i) => `x${i + 1} = ${r}`).join(', ');

  return {
    type: 'CUBIC',
    equationStr: eqStr,
    roots,
    solutionText: solStr,
    steps,
    verified
  };
}

export function solveCustomPolynomialEquation(eqStr) {
  if (!eqStr || typeof eqStr !== 'string' || !eqStr.includes('=')) {
    throw new Error('Please enter a valid equation containing an equals sign "=" (e.g. 2x + 5 = 15 or x² + 5x + 6 = 0).');
  }

  const parts = eqStr.split('=');
  if (parts.length !== 2) {
    throw new Error('Equation must contain exactly one equals sign "=".');
  }

  const lhsStr = parts[0].trim();
  const rhsStr = parts[1].trim();

  const lhsCoeffs = parsePolynomialSide(lhsStr);
  const rhsCoeffs = parsePolynomialSide(rhsStr);

  const A = cleanFloat(lhsCoeffs[3] - rhsCoeffs[3]);
  const B = cleanFloat(lhsCoeffs[2] - rhsCoeffs[2]);
  const C = cleanFloat(lhsCoeffs[1] - rhsCoeffs[1]);
  const D = cleanFloat(lhsCoeffs[0] - rhsCoeffs[0]);

  const steps = [];
  steps.push(`Original equation: ${eqStr}`);
  steps.push(`Rearranged to standard polynomial form: ${formatPoly(A, B, C, D)} = 0`);

  if (A !== 0) {
    steps.push(`Detected Polynomial Degree: 3 (Cubic Equation)`);
    return solveCubicPolynomial(A, B, C, D, eqStr, steps);
  } else if (B !== 0) {
    steps.push(`Detected Polynomial Degree: 2 (Quadratic Equation)`);
    return solveQuadraticEquation(B, C, D);
  } else if (C !== 0) {
    steps.push(`Detected Polynomial Degree: 1 (Linear Equation)`);
    return solveLinearEquation(C, D, 0);
  } else {
    if (D === 0) {
      return {
        type: 'IDENTITY',
        equationStr: eqStr,
        explanation: ['Equation is an identity (0 = 0), true for all real x.'],
        solutionText: 'Infinite solutions (x can be any real number)'
      };
    } else {
      return {
        type: 'CONTRADICTION',
        equationStr: eqStr,
        explanation: [`Equation reduces to ${D} = 0, which is impossible.`],
        solutionText: 'No solution'
      };
    }
  }
}
