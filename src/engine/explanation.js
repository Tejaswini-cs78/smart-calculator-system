// Explanation Generator for Mathematical Expressions

import { ASTNodeType } from './parser.js';

export function generateExplanation(ast, evaluationResult, rawExpression, options = {}) {
  const angleMode = options.angleMode || 'DEG';
  const { result, steps } = evaluationResult;

  const explanationSteps = [];

  // Helper for single operation expressions
  if (ast.type === ASTNodeType.BINARY && ast.left.type === ASTNodeType.NUMBER && ast.right.type === ASTNodeType.NUMBER) {
    const left = ast.left.value;
    const right = ast.right.value;
    const op = ast.op;

    if (op === '+') {
      explanationSteps.push(`First number = ${left}`);
      explanationSteps.push(`Second number = ${right}`);
      explanationSteps.push(`Operation = Addition (+)`);
      explanationSteps.push(`${left} + ${right} = ${result}`);
      explanationSteps.push(`Therefore: Answer = ${result}`);
      return { title: 'Addition Step-by-Step', steps: explanationSteps, finalAnswer: result };
    }

    if (op === '-') {
      explanationSteps.push(`First number = ${left}`);
      explanationSteps.push(`Second number = ${right}`);
      explanationSteps.push(`Operation = Subtraction (−)`);
      explanationSteps.push(`${left} − ${right} = ${result}`);
      explanationSteps.push(`Therefore: Answer = ${result}`);
      return { title: 'Subtraction Step-by-Step', steps: explanationSteps, finalAnswer: result };
    }

    if (op === '*') {
      explanationSteps.push(`First number = ${left}`);
      explanationSteps.push(`Second number = ${right}`);
      explanationSteps.push(`Operation = Multiplication (×)`);
      if (Number.isInteger(right) && right > 1 && right <= 10) {
        const terms = Array(right).fill(left).join(' + ');
        explanationSteps.push(`${left} × ${right} = ${terms}`);
      } else {
        explanationSteps.push(`${left} × ${right} = ${result}`);
      }
      explanationSteps.push(`Therefore: Answer = ${result}`);
      return { title: 'Multiplication Step-by-Step', steps: explanationSteps, finalAnswer: result };
    }

    if (op === '/') {
      explanationSteps.push(`${left} divided by ${right}`);
      explanationSteps.push(`Operation = Division (÷)`);
      explanationSteps.push(`${left} ÷ ${right} = ${result}`);
      if (right !== 0) {
        explanationSteps.push(`Verification: ${right} × ${result} = ${left}`);
      }
      explanationSteps.push(`Therefore: Answer = ${result}`);
      return { title: 'Division Step-by-Step', steps: explanationSteps, finalAnswer: result };
    }

    if (op === '^') {
      explanationSteps.push(`Base = ${left}`);
      explanationSteps.push(`Exponent (Power) = ${right}`);
      if (Number.isInteger(right) && right >= 1 && right <= 12) {
        const factors = Array(right).fill(left).join(' × ');
        explanationSteps.push(`${left}^${right} = ${factors}`);
        explanationSteps.push(`= ${result}`);
      } else {
        explanationSteps.push(`${left}^${right} = ${result}`);
      }
      explanationSteps.push(`Therefore: Answer = ${result}`);
      return { title: 'Power Step-by-Step', steps: explanationSteps, finalAnswer: result };
    }
  }

  // Single Function Call (e.g. sqrt(144), cbrt(125), sin(30), log(1000))
  if (ast.type === ASTNodeType.FUNCTION && ast.args.length === 1 && ast.args[0].type === ASTNodeType.NUMBER) {
    const fnName = ast.name;
    const argVal = ast.args[0].value;

    if (fnName === 'sqrt') {
      explanationSteps.push(`Expression: √${argVal}`);
      explanationSteps.push(`Find the non-negative number whose square equals ${argVal}.`);
      explanationSteps.push(`${result} × ${result} = ${argVal}`);
      explanationSteps.push(`Therefore: √${argVal} = ${result}`);
      return { title: 'Square Root Explanation', steps: explanationSteps, finalAnswer: result };
    }

    if (fnName === 'cbrt') {
      explanationSteps.push(`Expression: ∛${argVal}`);
      explanationSteps.push(`Find the number whose cube equals ${argVal}.`);
      explanationSteps.push(`${result} × ${result} × ${result} = ${argVal}`);
      explanationSteps.push(`Therefore: ∛${argVal} = ${result}`);
      return { title: 'Cube Root Explanation', steps: explanationSteps, finalAnswer: result };
    }

    if (fnName === 'log' || fnName === 'log10') {
      explanationSteps.push(`Expression: log₁₀(${argVal})`);
      explanationSteps.push(`Find the exponent y such that 10ʸ = ${argVal}.`);
      explanationSteps.push(`10^y = ${argVal}`);
      explanationSteps.push(`Therefore: y = log₁₀(${argVal}) ≈ ${result}`);
      return { title: 'Logarithm (Base 10) Explanation', steps: explanationSteps, finalAnswer: result };
    }

    if (fnName === 'log2') {
      explanationSteps.push(`Expression: log₂(${argVal})`);
      explanationSteps.push(`Find the exponent y such that 2ʸ = ${argVal}.`);
      explanationSteps.push(`2^${result} = ${argVal}`);
      explanationSteps.push(`Therefore: log₂(${argVal}) = ${result}`);
      return { title: 'Logarithm (Base 2) Explanation', steps: explanationSteps, finalAnswer: result };
    }

    if (fnName === 'ln') {
      explanationSteps.push(`Expression: ln(${argVal})`);
      explanationSteps.push(`Find exponent y for natural base e ≈ 2.71828 such that eʸ = ${argVal}.`);
      explanationSteps.push(`e^${result} ≈ ${argVal}`);
      explanationSteps.push(`Therefore: ln(${argVal}) = ${result}`);
      return { title: 'Natural Logarithm Explanation', steps: explanationSteps, finalAnswer: result };
    }

    if (['sin', 'cos', 'tan', 'csc', 'sec', 'cot'].includes(fnName)) {
      explanationSteps.push(`Selected angle mode: ${angleMode === 'DEG' ? 'Degrees (°)' : 'Radians (rad)'}`);
      explanationSteps.push(`Function: ${fnName}`);
      explanationSteps.push(`Input angle: ${argVal}${angleMode === 'DEG' ? '°' : ''}`);

      if (angleMode === 'DEG') {
        if (fnName === 'sin' && argVal === 30) explanationSteps.push(`Exact Trigonometric Identity: sin(30°) = 1/2 = 0.5`);
        else if (fnName === 'cos' && argVal === 60) explanationSteps.push(`Exact Trigonometric Identity: cos(60°) = 1/2 = 0.5`);
        else if (fnName === 'tan' && argVal === 45) explanationSteps.push(`Exact Trigonometric Identity: tan(45°) = 1`);
      }
      explanationSteps.push(`Result: ${fnName}(${argVal}${angleMode === 'DEG' ? '°' : ''}) = ${result}`);
      return { title: 'Trigonometric Function Explanation', steps: explanationSteps, finalAnswer: result };
    }
  }

  // Single Factorial
  if (ast.type === ASTNodeType.FACTORIAL && ast.expr.type === ASTNodeType.NUMBER) {
    const num = ast.expr.value;
    explanationSteps.push(`Expression: ${num}!`);
    const terms = [];
    for (let i = num; i >= 1; i--) terms.push(i);
    explanationSteps.push(`Formula: ${num}! = ${terms.join(' × ')}`);
    explanationSteps.push(`= ${result}`);
    explanationSteps.push(`Therefore: Answer = ${result}`);
    return { title: 'Factorial Explanation', steps: explanationSteps, finalAnswer: result };
  }

  // General Multi-step Expression Explanation using precedence order & evaluated steps
  explanationSteps.push(`Expression: ${rawExpression}`);
  explanationSteps.push(`Operator Precedence Order: Parentheses → Functions → Exponents (^) → Multiplication/Division (×, ÷) → Addition/Subtraction (+, −)`);

  if (steps && steps.length > 0) {
    explanationSteps.push(`\nStep-by-step computation:`);
    steps.forEach((step, idx) => {
      if (step.type === 'BINARY') {
        explanationSteps.push(`Step ${idx + 1}: Compute ${step.left} ${step.op === '*' ? '×' : step.op === '/' ? '÷' : step.op} ${step.right} = ${step.result}`);
      } else if (step.type === 'FUNCTION') {
        explanationSteps.push(`Step ${idx + 1}: Evaluate ${step.name}(${step.arg}${step.angleMode === 'DEG' ? '°' : ''}) = ${step.result}`);
      } else if (step.type === 'FACTORIAL') {
        explanationSteps.push(`Step ${idx + 1}: Compute ${step.input}! = ${step.result}`);
      }
    });
  }

  explanationSteps.push(`\nFinal Calculated Result: ${result}`);

  return {
    title: 'Mathematical Expression Breakdown',
    steps: explanationSteps,
    finalAnswer: result,
  };
}
