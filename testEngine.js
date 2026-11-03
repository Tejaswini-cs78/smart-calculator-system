import { parse } from './src/engine/parser.js';
import { evaluateAST } from './src/engine/evaluator.js';
import { solveLinearEquation, solveQuadraticEquation, solveCustomPolynomialEquation } from './src/engine/algebraEngine.js';
import { calculateFractions } from './src/engine/fractionEngine.js';
import { calculateStatistics, calculateFrequencyStatistics } from './src/engine/statisticsEngine.js';
import {
  calculateCircle, calculateCube, calculateRhombus, calculateKite, calculatePentagon,
  calculateRegularHexagon, calculateRegularPolygon, calculateSemicircle, calculateHemisphere,
  calculateTriangularPrism, calculateRectangularPrism, calculateSquarePyramid,
  calculateGeneralPrism, calculateGeneralPyramid
} from './src/engine/geometryEngine.js';
import { calculatePercentage, calculateSimpleInterest, calculateEMI } from './src/engine/financeEngine.js';
import { convertCurrency, SUPPORTED_CURRENCIES } from './src/engine/converterEngine.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, actual = '', expected = '') {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${testName} | Expected '${expected}', got '${actual}'`);
    failed++;
  }
}

function testExactValue(expr, expectedDec, expectedExact = null, expectedSimplified = null, angleMode = 'DEG') {
  try {
    const ast = parse(expr);
    const evalRes = evaluateAST(ast, { angleMode });
    const decOk = Math.abs(evalRes.result - expectedDec) < 1e-9;
    
    const exactStr = evalRes.exactVal?.exact || null;
    const simpStr = evalRes.exactVal?.simplified || null;

    const exactOk = exactStr === expectedExact;
    const simpOk = expectedSimplified ? simpStr === expectedSimplified : true;

    assert(decOk && exactOk && simpOk, `Exact Val '${expr}'`, `Dec: ${evalRes.result}, Exact: ${exactStr}, Simp: ${simpStr}`, `Dec: ${expectedDec}, Exact: ${expectedExact}, Simp: ${expectedSimplified}`);
  } catch (err) {
    assert(false, `Expression '${expr}' thrown error: ${err.message}`, err.message, expectedDec);
  }
}

function testDomainError(expr, testName, expectedMsg = '', angleMode = 'DEG') {
  try {
    const ast = parse(expr);
    evaluateAST(ast, { angleMode });
    assert(false, testName, 'No error thrown', 'DomainError');
  } catch (err) {
    const msgOk = expectedMsg ? err.message.includes(expectedMsg) : true;
    assert(msgOk, `${testName} (Caught: "${err.message}")`);
  }
}

console.log('=== STARTING SMART CALCULATOR LOGARITHM & ENGINE TESTS ===\n');

// Standard trig exact identity tests
testExactValue('sin(30)', 0.5, '1/2');
testExactValue('sin(45)', Math.SQRT1_2, '1/√2', '√2/2');
testExactValue('sin(60)', Math.sqrt(3) / 2, '√3/2');

testExactValue('cos(30)', Math.sqrt(3) / 2, '√3/2');
testExactValue('cos(45)', Math.SQRT1_2, '1/√2', '√2/2');
testExactValue('cos(60)', 0.5, '1/2');

testExactValue('tan(30)', 1 / Math.sqrt(3), '1/√3', '√3/3');
testExactValue('tan(45)', 1, null);
testExactValue('tan(60)', Math.sqrt(3), '√3');

// Logarithms tests requested by prompt
testExactValue('log(1)', 0);
testExactValue('log(5)', Math.log10(5));
testExactValue('log(10)', 1);
testExactValue('log(25)', Math.log10(25));
testExactValue('log(100)', 2);
testExactValue('log(1000)', 3);
testExactValue('log(0.1)', -1);

testExactValue('ln(1)', 0);
testExactValue('ln(e)', 1);
testExactValue('log2(8)', 3);
testExactValue('log2(16)', 4);

// Rational fractions & Radicals
testExactValue('1 / 2', 0.5, '1/2');
testExactValue('3 / 4', 0.75, '3/4');
testExactValue('1 / 3', 1 / 3, '1/3');
testExactValue('sqrt(2)', Math.SQRT2, '√2');
testExactValue('sqrt(8)', 2 * Math.SQRT2, '2√2');
testExactValue('sqrt(144)', 12, null);

// Domain Error Handling
testDomainError('5 / 0', 'Division by zero test', 'Division by zero is undefined');
testDomainError('sqrt(-4)', 'Square root of negative test', 'not a real number');
testDomainError('log(0)', 'log(0) positive domain test', 'Logarithm is defined only for positive numbers');
testDomainError('log(-5)', 'log(-5) positive domain test', 'Logarithm is defined only for positive numbers');
testDomainError('tan(90)', 'tan(90°) vertical asymptote test', 'tan(90°) is undefined');

// Currency Converter Tests (14 Currencies)
try {
  assert(SUPPORTED_CURRENCIES.length === 14, 'Supported currencies count is 14', SUPPORTED_CURRENCIES.length, 14);
  const usdToInr = convertCurrency(100, 'USD', 'INR');
  assert(usdToInr.rawResult > 8000, 'Currency convert 100 USD to INR', usdToInr.rawResult, '>8000');
  const sameCurr = convertCurrency(50, 'EUR', 'EUR');
  assert(sameCurr.rawResult === 50, 'Currency convert 50 EUR to EUR', sameCurr.rawResult, 50);
} catch (err) {
  assert(false, 'Currency Converter Exception', err.message);
}

// Algebra Custom Polynomial Tests (Linear, Quadratic, Cubic)
try {
  const linRes = solveLinearEquation('2', '5', '15');
  assert(linRes.x === 5 && linRes.verified, 'Linear Solver 2x + 5 = 15', linRes.x, 5);

  const customLin = solveCustomPolynomialEquation('2x + 5 = 15');
  assert(customLin.roots.includes(5) && customLin.verified, 'Custom Linear Solver 2x + 5 = 15', customLin.roots.join(','), '5');

  const quadRes = solveQuadraticEquation('1', '5', '6');
  assert(quadRes.roots.includes(-2) && quadRes.roots.includes(-3) && quadRes.verified, 'Quadratic Solver x² + 5x + 6 = 0', quadRes.roots.join(','), '-2,-3');

  const customCubic = solveCustomPolynomialEquation('x³ - 6x² + 11x - 6 = 0');
  assert(customCubic.roots.includes(1) && customCubic.roots.includes(2) && customCubic.roots.includes(3) && customCubic.verified, 'Custom Cubic Solver x³ - 6x² + 11x - 6 = 0', customCubic.roots.join(','), '1,2,3');
} catch (err) {
  assert(false, 'Algebra Exception', err.message);
}

try {
  const fracRes = calculateFractions(1, 2, '+', 3, 4);
  assert(fracRes.exact === '5/4' && fracRes.decimal === 1.25, 'Fractions 1/2 + 3/4', `${fracRes.exact} (${fracRes.decimal})`, '5/4 (1.25)');
} catch (err) {
  assert(false, 'Fractions Exception', err.message);
}

// Statistics Tests (Population & Sample Variance/StdDev)
try {
  const statRes = calculateStatistics('10, 20, 30, 40, 50');
  const meanOk = statRes.mean === 30;
  const medianOk = statRes.median === 30;
  const modeOk = statRes.mode === 'No unique mode';
  const rangeOk = statRes.range === 40;
  const popVarOk = statRes.popVariance === 200;
  const popStdOk = Math.abs(statRes.popStdDev - Math.sqrt(200)) < 1e-6;
  const sampleVarOk = statRes.sampleVariance === 250;
  const sampleStdOk = Math.abs(statRes.sampleStdDev - Math.sqrt(250)) < 1e-6;
  assert(meanOk && medianOk && modeOk && rangeOk && popVarOk && popStdOk && sampleVarOk && sampleStdOk, 'Statistics Population & Sample Variance/StdDev for [10,20,30,40,50]', `PopVar: ${statRes.popVariance}, SampleVar: ${statRes.sampleVariance}`, 'PopVar: 200, SampleVar: 250');
} catch (err) {
  assert(false, 'Statistics Exception', err.message);
}

try {
  const singleStat = calculateStatistics('5');
  assert(singleStat.popVariance === 0 && singleStat.popStdDev === 0, 'Single-value dataset [5]', singleStat.popVariance, 0);
} catch (err) {
  assert(false, 'Single-value dataset Exception', err.message);
}

// Frequency Distribution Table (X-f) Tests
try {
  // Test Case 1: Standard dataset
  const tc1Rows = [
    { x: '1', f: '10' },
    { x: '2', f: '12' },
    { x: '3', f: '15' },
    { x: '4', f: '18' },
    { x: '5', f: '20' }
  ];
  const tc1Res = calculateFrequencyStatistics(tc1Rows);
  const tc1MeanOk = Math.abs(tc1Res.mean - (251 / 75)) < 1e-6;
  const tc1MedOk = tc1Res.median === 4;
  const tc1ModeOk = tc1Res.mode === 1 || tc1Res.mode === 5; // Highest frequency f=20 at x=5
  const tc1RangeOk = tc1Res.range === 4;
  const tc1PopVarOk = Math.abs(tc1Res.popVariance - 1.88) < 0.01;
  const tc1PopStdOk = Math.abs(tc1Res.popStdDev - 1.371065) < 0.01;
  assert(tc1Res.count === 75 && tc1MeanOk && tc1MedOk && tc1Res.mode === 5 && tc1RangeOk && tc1PopVarOk && tc1PopStdOk, 'Frequency Table Test Case 1 (N=75, Mean=3.3467, Median=4, Mode=5, Range=4)', `Mean: ${tc1Res.mean}, Med: ${tc1Res.median}, Mode: ${tc1Res.mode}, Var: ${tc1Res.popVariance}`, 'N=75, Mean=3.3467, Med=4, Mode=5, Var=1.88');

  // Test Case 2: Simple [1:2, 2:3, 3:5]
  const tc2Res = calculateFrequencyStatistics([
    { x: '1', f: '2' },
    { x: '2', f: '3' },
    { x: '3', f: '5' }
  ]);
  assert(tc2Res.count === 10 && tc2Res.mean === 2.3 && tc2Res.median === 2.5 && tc2Res.mode === 3, 'Frequency Table Test Case 2 (N=10, Mean=2.3, Median=2.5, Mode=3)', `Mean: ${tc2Res.mean}, Med: ${tc2Res.median}`, 'Mean=2.3, Med=2.5');

  // Test Case 3: [10:4, 20:7, 30:3, 40:9]
  const tc3Res = calculateFrequencyStatistics([
    { x: '10', f: '4' },
    { x: '20', f: '7' },
    { x: '30', f: '3' },
    { x: '40', f: '9' }
  ]);
  assert(tc3Res.count === 23 && Math.abs(tc3Res.mean - (630 / 23)) < 1e-6 && tc3Res.mode === 40, 'Frequency Table Test Case 3 (N=23, Mean=27.391, Mode=40)', `Mean: ${tc3Res.mean}, Mode: ${tc3Res.mode}`, 'Mean=27.391, Mode=40');

  // Test Case 4: Unsorted Input [5:20, 2:12, 4:18, 1:10, 3:15]
  const tc4Res = calculateFrequencyStatistics([
    { x: '5', f: '20' },
    { x: '2', f: '12' },
    { x: '4', f: '18' },
    { x: '1', f: '10' },
    { x: '3', f: '15' }
  ]);
  assert(tc4Res.count === 75 && tc4Res.median === 4 && tc4Res.mode === 5 && tc4Res.range === 4, 'Frequency Table Test Case 4 Unsorted (Identical to TC1)', `Med: ${tc4Res.median}, Mode: ${tc4Res.mode}`, 'Med=4, Mode=5');

  // Test Case 5: Tied Modes [10:5, 20:12, 30:12, 40:4]
  const tc5Res = calculateFrequencyStatistics([
    { x: '10', f: '5' },
    { x: '20', f: '12' },
    { x: '30', f: '12' },
    { x: '40', f: '4' }
  ]);
  assert(String(tc5Res.mode).includes('20') && String(tc5Res.mode).includes('30'), 'Frequency Table Test Case 5 Tied Modes (Modes=20, 30)', tc5Res.mode, '20, 30');

  // Test Case 6: Decimal X Values [1.5:4, 2.5:6, 3.5:2]
  const tc6Res = calculateFrequencyStatistics([
    { x: '1.5', f: '4' },
    { x: '2.5', f: '6' },
    { x: '3.5', f: '2' }
  ]);
  assert(tc6Res.count === 12 && Math.abs(tc6Res.mean - (28 / 12)) < 1e-6 && tc6Res.median === 2.5, 'Frequency Table Test Case 6 Decimal X (N=12, Mean=2.333, Med=2.5)', `Mean: ${tc6Res.mean}, Med: ${tc6Res.median}`, 'Mean=2.333, Med=2.5');
} catch (err) {
  assert(false, 'Frequency Table Statistics Exception', err.message);
}

// New 2D & 3D Geometry Shape Tests
try {
  const rhombus = calculateRhombus(6, 8, 5);
  assert(rhombus.area === 24 && rhombus.perimeter === 20, 'Rhombus d1=6, d2=8, a=5', `Area: ${rhombus.area}, Peri: ${rhombus.perimeter}`, 'Area: 24, Peri: 20');

  const semi = calculateSemicircle(7);
  assert(Math.round(semi.area) === 77 && Math.round(semi.perimeter) === 36, 'Semicircle r=7', `Area: ${semi.area}, Peri: ${semi.perimeter}`, 'Area: ~77, Peri: ~36');

  const hemi = calculateHemisphere(3);
  assert(hemi.volume > 0 && hemi.csa > 0 && hemi.tsa > 0, 'Hemisphere r=3', hemi.volume, '>0');

  const sqPyramid = calculateSquarePyramid(6, 4);
  assert(sqPyramid.volume === 48, 'Square Pyramid a=6, h=4', sqPyramid.volume, 48);
} catch (err) {
  assert(false, 'New Geometry Shapes Exception', err.message);
}

try {
  const geomRes = calculateCircle(7);
  const expectedArea = Math.PI * 49;
  const areaUnitOk = geomRes.steps.some(s => s.includes('square units'));
  const periUnitOk = geomRes.steps.some(s => s.includes('units'));
  const approxAreaOk = Math.round(geomRes.area) === 154;
  const approxCircOk = Math.round(geomRes.circumference) === 44;
  assert(Math.abs(geomRes.area - expectedArea) < 1e-3 && areaUnitOk && periUnitOk && approxAreaOk && approxCircOk, 'Circle Area r=7 (Accurate & Approx 154/44)', geomRes.area, expectedArea);
} catch (err) {
  assert(false, 'Circle Area Exception', err.message);
}

// Mathematical rounding accuracy tests
assert(Math.round(153.9380400259) === 154, 'Approx: 153.9380400259 -> 154', Math.round(153.9380400259), 154);
assert(Math.round(43.9822971503) === 44, 'Approx: 43.9822971503 -> 44', Math.round(43.9822971503), 44);
assert(Math.round(19.6) === 20, 'Approx: 19.6 -> 20', Math.round(19.6), 20);
assert(Math.round(19.2) === 19, 'Approx: 19.2 -> 19', Math.round(19.2), 19);
assert(Math.round(153.4) === 153, 'Approx: 153.4 -> 153', Math.round(153.4), 153);
assert(Math.round(153.5) === 154, 'Approx: 153.5 -> 154', Math.round(153.5), 154);
assert(Math.round(149.49) === 149, 'Approx: 149.49 -> 149', Math.round(149.49), 149);
assert(Math.round(149.50) === 150, 'Approx: 149.50 -> 150', Math.round(149.50), 150);
assert(Math.round(16) === 16, 'Approx: 16 -> 16', Math.round(16), 16);

try {
  const cubeRes = calculateCube(4);
  const volUnitOk = cubeRes.steps.some(s => s.includes('cubic units'));
  const tsaUnitOk = cubeRes.steps.some(s => s.includes('square units'));
  assert(cubeRes.volume === 64 && volUnitOk && tsaUnitOk, 'Cube Volume & Surface Area units for edge=4', cubeRes.volume, 64);
} catch (err) {
  assert(false, 'Cube Calculation Exception', err.message);
}

try {
  const percRes = calculatePercentage('OF_NUMBER', 15, 200);
  assert(percRes.result === 30, '15% of 200', percRes.result, 30);

  const siRes = calculateSimpleInterest(10000, 7.5, 3);
  assert(siRes.interest === 2250, 'Simple Interest (10000, 7.5%, 3yrs)', siRes.interest, 2250);

  const emiRes = calculateEMI(25000, 8.5, 3, 'YEARS');
  assert(emiRes.emi > 0, 'EMI calculation sample', emiRes.emi, '>0');
} catch (err) {
  assert(false, 'Finance Exception', err.message);
}

console.log(`\n=== ENGINE TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) process.exit(1);

