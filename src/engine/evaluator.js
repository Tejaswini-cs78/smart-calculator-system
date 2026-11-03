// AST Evaluator with Domain Validation, DEG/RAD support, and Symbolic Exact Value Resolution

import { ASTNodeType } from './parser.js';

export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DomainError';
  }
}

export function cleanFloat(value, precision = 12) {
  if (typeof value !== 'number' || isNaN(value)) return value;
  if (!isFinite(value)) return value;
  const factor = Math.pow(10, precision);
  const rounded = Math.round(value * factor) / factor;
  return Math.abs(rounded - Math.round(rounded)) < 1e-12 ? Math.round(rounded) : rounded;
}

/**
 * Continued fraction algorithm to convert rational decimal to p/q fraction string
 */
export function toRationalFraction(value, maxDenom = 1000, tolerance = 1e-9) {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) return null;
  if (Number.isInteger(cleanFloat(value))) return null;

  const sign = value < 0 ? '-' : '';
  const absVal = Math.abs(value);

  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = absVal;

  for (let i = 0; i < 20; i++) {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;

    if (k1 > maxDenom) break;

    const currentFraction = h1 / k1;
    if (Math.abs(absVal - currentFraction) < tolerance) {
      if (k1 > 1) {
        return `${sign}${h1}/${k1}`;
      }
      break;
    }

    const diff = b - a;
    if (diff < 1e-12) break;
    b = 1 / diff;
  }

  return null;
}

/**
 * Simplifies square root of integer n -> a√b (e.g. sqrt(8) -> 2√2, sqrt(2) -> √2, sqrt(144) -> 12)
 */
export function simplifyRadicalInteger(n) {
  if (!Number.isInteger(n) || n <= 0) return null;
  if (n === 1) return { exact: '1' };

  let a = 1;
  let b = n;

  for (let i = Math.floor(Math.sqrt(n)); i >= 2; i--) {
    if (n % (i * i) === 0) {
      a = i;
      b = n / (i * i);
      break;
    }
  }

  if (b === 1) {
    return { exact: `${a}` };
  }
  if (a === 1) {
    return { exact: `√${b}` };
  }
  return { exact: `${a}√${b}` };
}

/**
 * Derives exact mathematical representation for node (Trig exact identities, radicals, fractions)
 */
export function deriveExactValue(node, finalResult, options = {}) {
  const angleMode = options.angleMode || 'DEG';

  // Check single function call for standard trig exact values
  if (node && node.type === ASTNodeType.FUNCTION && node.args.length === 1 && node.args[0].type === ASTNodeType.NUMBER) {
    const name = node.name;
    const arg = node.args[0].value;

    if (angleMode === 'DEG') {
      const normArg = ((arg % 360) + 360) % 360;

      // SIN
      if (name === 'sin') {
        if (normArg === 0 || normArg === 180) return null; // Integer 0
        if (normArg === 90) return null; // Integer 1
        if (normArg === 270) return null; // Integer -1
        if (normArg === 30 || normArg === 150) return { exact: '1/2' };
        if (normArg === 210 || normArg === 330) return { exact: '-1/2' };
        if (normArg === 45 || normArg === 135) return { exact: '1/√2', simplified: '√2/2' };
        if (normArg === 225 || normArg === 315) return { exact: '-1/√2', simplified: '-√2/2' };
        if (normArg === 60 || normArg === 120) return { exact: '√3/2' };
        if (normArg === 240 || normArg === 300) return { exact: '-√3/2' };
      }

      // COS
      if (name === 'cos') {
        if (normArg === 0) return null; // Integer 1
        if (normArg === 180) return null; // Integer -1
        if (normArg === 90 || normArg === 270) return null; // Integer 0
        if (normArg === 60 || normArg === 300) return { exact: '1/2' };
        if (normArg === 120 || normArg === 240) return { exact: '-1/2' };
        if (normArg === 45 || normArg === 315) return { exact: '1/√2', simplified: '√2/2' };
        if (normArg === 135 || normArg === 225) return { exact: '-1/√2', simplified: '-√2/2' };
        if (normArg === 30 || normArg === 330) return { exact: '√3/2' };
        if (normArg === 150 || normArg === 210) return { exact: '-√3/2' };
      }

      // TAN
      if (name === 'tan') {
        if (normArg === 0 || normArg === 180) return null; // Integer 0
        if (normArg === 45 || normArg === 225) return null; // Integer 1
        if (normArg === 135 || normArg === 315) return null; // Integer -1
        if (normArg === 30 || normArg === 210) return { exact: '1/√3', simplified: '√3/3' };
        if (normArg === 150 || normArg === 330) return { exact: '-1/√3', simplified: '-√3/3' };
        if (normArg === 60 || normArg === 240) return { exact: '√3' };
        if (normArg === 120 || normArg === 300) return { exact: '-√3' };
      }

      // CSC / COSEC
      if (name === 'csc' || name === 'cosec') {
        if (normArg === 90) return null; // 1
        if (normArg === 270) return null; // -1
        if (normArg === 30 || normArg === 150) return null; // 2
        if (normArg === 210 || normArg === 330) return null; // -2
        if (normArg === 45 || normArg === 135) return { exact: '√2' };
        if (normArg === 225 || normArg === 315) return { exact: '-√2' };
        if (normArg === 60 || normArg === 120) return { exact: '2/√3', simplified: '2√3/3' };
        if (normArg === 240 || normArg === 300) return { exact: '-2/√3', simplified: '-2√3/3' };
      }

      // SEC
      if (name === 'sec') {
        if (normArg === 0) return null; // 1
        if (normArg === 180) return null; // -1
        if (normArg === 60 || normArg === 300) return null; // 2
        if (normArg === 120 || normArg === 240) return null; // -2
        if (normArg === 45 || normArg === 315) return { exact: '√2' };
        if (normArg === 135 || normArg === 225) return { exact: '-√2' };
        if (normArg === 30 || normArg === 330) return { exact: '2/√3', simplified: '2√3/3' };
        if (normArg === 150 || normArg === 210) return { exact: '-2/√3', simplified: '-2√3/3' };
      }

      // COT
      if (name === 'cot') {
        if (normArg === 45 || normArg === 225) return null; // 1
        if (normArg === 135 || normArg === 315) return null; // -1
        if (normArg === 60 || normArg === 240) return { exact: '1/√3', simplified: '√3/3' };
        if (normArg === 120 || normArg === 300) return { exact: '-1/√3', simplified: '-√3/3' };
        if (normArg === 30 || normArg === 210) return { exact: '√3' };
        if (normArg === 150 || normArg === 330) return { exact: '-√3' };
      }
    }

    // Radical sqrt(n)
    if (name === 'sqrt' && Number.isInteger(arg) && arg > 0) {
      const rad = simplifyRadicalInteger(arg);
      if (rad && rad.exact && rad.exact !== `${finalResult}`) {
        return rad;
      }
    }
  }

  // Check rational fraction
  const frac = toRationalFraction(finalResult);
  if (frac) {
    return { exact: frac };
  }

  return null;
}

export function calculateFactorial(n) {
  if (n < 0) throw new DomainError('Factorial is not defined for negative numbers');
  if (!Number.isInteger(n)) throw new DomainError('Factorial is only defined for non-negative integers');
  if (n > 170) throw new DomainError('Factorial value is too large to compute precisely');
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

export function evaluateAST(node, options = {}) {
  const angleMode = options.angleMode || 'DEG';
  const steps = [];

  function toRad(angle) {
    return angleMode === 'DEG' ? (angle * Math.PI) / 180 : angle;
  }

  function toAngleOutput(rad) {
    return angleMode === 'DEG' ? cleanFloat((rad * 180) / Math.PI) : cleanFloat(rad);
  }

  function evalNode(n) {
    if (!n) return 0;

    switch (n.type) {
      case ASTNodeType.NUMBER:
        return n.value;

      case ASTNodeType.CONSTANT:
        return n.value;

      case ASTNodeType.UNARY: {
        const val = evalNode(n.expr);
        if (n.op === '-') return -val;
        if (n.op === '+') return val;
        return val;
      }

      case ASTNodeType.FACTORIAL: {
        const val = evalNode(n.expr);
        const res = calculateFactorial(val);
        steps.push({
          type: 'FACTORIAL',
          input: val,
          result: res,
          desc: `${val}! = ${res}`
        });
        return res;
      }

      case ASTNodeType.BINARY: {
        const leftVal = evalNode(n.left);
        const rightVal = evalNode(n.right);

        let res;
        switch (n.op) {
          case '+':
            res = leftVal + rightVal;
            break;
          case '-':
            res = leftVal - rightVal;
            break;
          case '*':
            res = leftVal * rightVal;
            break;
          case '/':
            if (Math.abs(rightVal) < 1e-15) {
              throw new DomainError('Division by zero is undefined');
            }
            res = leftVal / rightVal;
            break;
          case '%':
            if (Math.abs(rightVal) < 1e-15) {
              throw new DomainError('Modulo by zero is undefined');
            }
            res = leftVal % rightVal;
            break;
          case '^':
            if (leftVal < 0 && !Number.isInteger(rightVal)) {
              const denom = Math.round(1 / rightVal);
              if (Math.abs(1 / denom - rightVal) < 1e-10 && denom % 2 !== 0) {
                res = -Math.pow(-leftVal, rightVal);
              } else {
                throw new DomainError(`Negative base '${leftVal}' raised to non-integer power '${rightVal}' is complex`);
              }
            } else {
              res = Math.pow(leftVal, rightVal);
            }
            break;
          default:
            throw new Error(`Unsupported operator '${n.op}'`);
        }

        const cleanedRes = cleanFloat(res);
        steps.push({
          type: 'BINARY',
          op: n.op,
          left: leftVal,
          right: rightVal,
          result: cleanedRes,
          desc: `${leftVal} ${n.rawOp || n.op} ${rightVal} = ${cleanedRes}`
        });
        return cleanedRes;
      }

      case ASTNodeType.FUNCTION: {
        const argVals = n.args.map(evalNode);
        const arg = argVals[0];
        let res;

        switch (n.name) {
          case 'sin': {
            const rad = toRad(arg);
            if (angleMode === 'DEG' && arg % 180 === 0) res = 0;
            else if (angleMode === 'DEG' && (arg - 90) % 360 === 0) res = 1;
            else if (angleMode === 'DEG' && (arg - 270) % 360 === 0) res = -1;
            else if (angleMode === 'DEG' && (arg % 30 === 0 && (arg / 30) % 6 === 1)) res = 0.5;
            else res = Math.sin(rad);
            break;
          }
          case 'cos': {
            const rad = toRad(arg);
            if (angleMode === 'DEG' && (arg - 90) % 180 === 0) res = 0;
            else if (angleMode === 'DEG' && arg % 360 === 0) res = 1;
            else if (angleMode === 'DEG' && (arg - 180) % 360 === 0) res = -1;
            else if (angleMode === 'DEG' && (arg % 60 === 0 && (arg / 60) % 6 === 1)) res = 0.5;
            else res = Math.cos(rad);
            break;
          }
          case 'tan': {
            if (angleMode === 'DEG' && (arg - 90) % 180 === 0) {
              throw new DomainError(`tan(${arg}°) is undefined (vertical asymptote)`);
            }
            const rad = toRad(arg);
            if (angleMode === 'DEG' && arg % 180 === 0) res = 0;
            else if (angleMode === 'DEG' && (arg - 45) % 180 === 0) res = 1;
            else res = Math.tan(rad);
            break;
          }
          case 'csc':
          case 'cosec': {
            const sinVal = Math.sin(toRad(arg));
            if (Math.abs(sinVal) < 1e-15) {
              throw new DomainError(`cosec(${arg}${angleMode === 'DEG' ? '°' : ''}) is undefined (sin is 0)`);
            }
            res = 1 / sinVal;
            break;
          }
          case 'sec': {
            const cosVal = Math.cos(toRad(arg));
            if (Math.abs(cosVal) < 1e-15) {
              throw new DomainError(`sec(${arg}${angleMode === 'DEG' ? '°' : ''}) is undefined (cos is 0)`);
            }
            res = 1 / cosVal;
            break;
          }
          case 'cot': {
            const tanVal = Math.tan(toRad(arg));
            if (Math.abs(tanVal) < 1e-15) {
              throw new DomainError(`cot(${arg}${angleMode === 'DEG' ? '°' : ''}) is undefined`);
            }
            res = 1 / tanVal;
            break;
          }
          case 'asin':
          case 'arcsin': {
            if (arg < -1 || arg > 1) {
              throw new DomainError(`asin input '${arg}' is outside the valid real domain [-1, 1]`);
            }
            res = toAngleOutput(Math.asin(arg));
            break;
          }
          case 'acos':
          case 'arccos': {
            if (arg < -1 || arg > 1) {
              throw new DomainError(`acos input '${arg}' is outside the valid real domain [-1, 1]`);
            }
            res = toAngleOutput(Math.acos(arg));
            break;
          }
          case 'atan':
          case 'arctan': {
            res = toAngleOutput(Math.atan(arg));
            break;
          }
          case 'log':
          case 'log10': {
            if (arg <= 0) {
              throw new DomainError('Logarithm is defined only for positive numbers.');
            }
            res = Math.log10(arg);
            break;
          }
          case 'ln': {
            if (arg <= 0) {
              throw new DomainError('Logarithm is defined only for positive numbers.');
            }
            res = Math.log(arg);
            break;
          }
          case 'log2': {
            if (arg <= 0) {
              throw new DomainError('Logarithm is defined only for positive numbers.');
            }
            res = Math.log2(arg);
            break;
          }
          case 'sqrt': {
            if (arg < 0) {
              throw new DomainError(`Square root of negative number '${arg}' is not a real number`);
            }
            res = Math.sqrt(arg);
            break;
          }
          case 'cbrt': {
            res = Math.cbrt(arg);
            break;
          }
          case 'abs': {
            res = Math.abs(arg);
            break;
          }
          case 'fact': {
            res = calculateFactorial(arg);
            break;
          }
          default:
            throw new Error(`Unknown function '${n.name}'`);
        }

        const cleanedRes = cleanFloat(res);
        steps.push({
          type: 'FUNCTION',
          name: n.name,
          arg: arg,
          result: cleanedRes,
          angleMode: ['sin','cos','tan','csc','cosec','sec','cot','asin','acos','atan'].includes(n.name) ? angleMode : undefined
        });
        return cleanedRes;
      }

      default:
        throw new Error(`Invalid AST node type '${n.type}'`);
    }
  }

  const finalResult = cleanFloat(evalNode(node));
  const exactVal = deriveExactValue(node, finalResult, { angleMode });

  return {
    result: finalResult,
    fraction: exactVal ? exactVal.exact : null,
    exactVal: exactVal,
    steps,
  };
}
