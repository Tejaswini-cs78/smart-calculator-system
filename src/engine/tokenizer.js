// Mathematical Tokenizer

export const TokenType = {
  NUMBER: 'NUMBER',
  CONSTANT: 'CONSTANT',
  OPERATOR: 'OPERATOR',
  FUNCTION: 'FUNCTION',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  FACTORIAL: 'FACTORIAL',
  COMMA: 'COMMA',
};

export const CONSTANTS = {
  'π': Math.PI,
  'pi': Math.PI,
  'PI': Math.PI,
  'e': Math.E,
  'E': Math.E,
};

export const FUNCTIONS = new Set([
  'sin', 'cos', 'tan',
  'csc', 'cosec', 'sec', 'cot',
  'asin', 'arcsin', 'acos', 'arccos', 'atan', 'arctan',
  'log', 'log10', 'ln', 'log2',
  'sqrt', 'cbrt', 'fact', 'abs'
]);

export function tokenize(expression) {
  if (!expression || typeof expression !== 'string') {
    return [];
  }

  const str = expression.trim();
  const tokens = [];
  let i = 0;

  while (i < str.length) {
    const char = str[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Number matching (e.g., 12, 3.14)
    if (/[0-9]/.test(char) || (char === '.' && i + 1 < str.length && /[0-9]/.test(str[i + 1]))) {
      let numStr = '';
      while (i < str.length && (/[0-9]/.test(str[i]) || str[i] === '.')) {
        numStr += str[i];
        i++;
      }
      tokens.push({ type: TokenType.NUMBER, value: parseFloat(numStr), raw: numStr });
      continue;
    }

    // Constants (π)
    if (char === 'π') {
      tokens.push({ type: TokenType.CONSTANT, name: 'π', value: Math.PI });
      i++;
      continue;
    }

    // Identifiers (functions or constant names like e, pi)
    if (/[a-zA-Z_]/.test(char)) {
      let ident = '';
      while (i < str.length && /[a-zA-Z0-9_]/.test(str[i])) {
        ident += str[i];
        i++;
      }
      const lower = ident.toLowerCase();
      if (CONSTANTS[ident] !== undefined || CONSTANTS[lower] !== undefined) {
        const val = CONSTANTS[ident] ?? CONSTANTS[lower];
        tokens.push({ type: TokenType.CONSTANT, name: ident, value: val });
      } else if (FUNCTIONS.has(lower)) {
        tokens.push({ type: TokenType.FUNCTION, name: lower });
      } else {
        throw new Error(`Unknown mathematical symbol or function '${ident}'`);
      }
      continue;
    }

    // Symbols and operators
    if (char === '+' || char === '-' || char === '*' || char === '×' || char === '/' || char === '÷' || char === '%' || char === '^') {
      const normalizedOp = (char === '×') ? '*' : (char === '÷') ? '/' : char;
      tokens.push({ type: TokenType.OPERATOR, value: normalizedOp, raw: char });
      i++;
      continue;
    }

    if (char === '!') {
      tokens.push({ type: TokenType.FACTORIAL, value: '!' });
      i++;
      continue;
    }

    if (char === '(' || char === ')') {
      tokens.push({ type: char === '(' ? TokenType.LPAREN : TokenType.RPAREN, value: char });
      i++;
      continue;
    }

    if (char === ',') {
      tokens.push({ type: TokenType.COMMA, value: ',' });
      i++;
      continue;
    }

    if (char === '√') {
      tokens.push({ type: TokenType.FUNCTION, name: 'sqrt' });
      i++;
      continue;
    }

    if (char === '∛') {
      tokens.push({ type: TokenType.FUNCTION, name: 'cbrt' });
      i++;
      continue;
    }

    throw new Error(`Invalid mathematical character '${char}'`);
  }

  // Insert implicit multiplication tokens where necessary
  // e.g., 2π -> 2 * π, 3(4) -> 3 * (4), (2)(3) -> (2) * (3), 2sin(30) -> 2 * sin(30)
  const processed = [];
  for (let j = 0; j < tokens.length; j++) {
    const current = tokens[j];
    const prev = tokens[j - 1];

    if (prev) {
      const prevIsVal = (prev.type === TokenType.NUMBER || prev.type === TokenType.CONSTANT || prev.type === TokenType.RPAREN || prev.type === TokenType.FACTORIAL);
      const currIsValOrFunc = (current.type === TokenType.NUMBER || current.type === TokenType.CONSTANT || current.type === TokenType.FUNCTION || current.type === TokenType.LPAREN);

      if (prevIsVal && currIsValOrFunc) {
        processed.push({ type: TokenType.OPERATOR, value: '*', raw: '×', implicit: true });
      }
    }

    processed.push(current);
  }

  return processed;
}
