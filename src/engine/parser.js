// Abstract Syntax Tree (AST) Parser based on Pratt / Precedence parsing

import { TokenType, tokenize } from './tokenizer.js';

export const ASTNodeType = {
  NUMBER: 'NumberNode',
  CONSTANT: 'ConstantNode',
  BINARY: 'BinaryNode',
  UNARY: 'UnaryNode',
  FUNCTION: 'FunctionNode',
  FACTORIAL: 'FactorialNode',
};

const PRECEDENCE = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
  '^': 4,
};

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek() {
    return this.tokens[this.pos] || null;
  }

  consume() {
    const token = this.peek();
    if (token) this.pos++;
    return token;
  }

  expect(type, value = null) {
    const token = this.peek();
    if (!token || token.type !== type || (value !== null && token.value !== value)) {
      const actual = token ? `'${token.value || token.name || token.raw}'` : 'end of expression';
      const expected = value ? `'${value}'` : type;
      throw new Error(`Expected ${expected} but found ${actual}`);
    }
    return this.consume();
  }

  parseExpression(minPrecedence = 0) {
    let left = this.parsePrefix();

    while (true) {
      const token = this.peek();
      if (!token) break;

      // Postfix operators like Factorial !
      if (token.type === TokenType.FACTORIAL) {
        this.consume();
        left = {
          type: ASTNodeType.FACTORIAL,
          expr: left,
        };
        continue;
      }

      if (token.type !== TokenType.OPERATOR) break;

      const prec = PRECEDENCE[token.value] || 0;
      if (prec < minPrecedence) break;

      const opToken = this.consume();
      const isRightAssoc = opToken.value === '^';
      const nextMinPrecedence = isRightAssoc ? prec : prec + 1;

      const right = this.parseExpression(nextMinPrecedence);

      left = {
        type: ASTNodeType.BINARY,
        op: opToken.value,
        rawOp: opToken.raw || opToken.value,
        left,
        right,
      };
    }

    return left;
  }

  parsePrefix() {
    const token = this.peek();

    if (!token) {
      throw new Error('Unexpected end of expression');
    }

    // Unary + or -
    if (token.type === TokenType.OPERATOR && (token.value === '+' || token.value === '-')) {
      const opToken = this.consume();
      const expr = this.parseExpression(3); // Unary precedence 3
      return {
        type: ASTNodeType.UNARY,
        op: opToken.value,
        expr,
      };
    }

    // Numbers
    if (token.type === TokenType.NUMBER) {
      this.consume();
      return {
        type: ASTNodeType.NUMBER,
        value: token.value,
        raw: token.raw,
      };
    }

    // Constants (e.g., π, e)
    if (token.type === TokenType.CONSTANT) {
      this.consume();
      return {
        type: ASTNodeType.CONSTANT,
        name: token.name,
        value: token.value,
      };
    }

    // Parentheses
    if (token.type === TokenType.LPAREN) {
      this.consume();
      const expr = this.parseExpression(0);
      this.expect(TokenType.RPAREN, ')');
      return expr;
    }

    // Functions
    if (token.type === TokenType.FUNCTION) {
      const funcToken = this.consume();
      let args = [];

      if (this.peek() && this.peek().type === TokenType.LPAREN) {
        this.consume(); // '('
        if (this.peek() && this.peek().type !== TokenType.RPAREN) {
          args.push(this.parseExpression(0));
          while (this.peek() && this.peek().type === TokenType.COMMA) {
            this.consume(); // ','
            args.push(this.parseExpression(0));
          }
        }
        this.expect(TokenType.RPAREN, ')');
      } else {
        // Single argument function without parentheses e.g., sin 30 -> sin(30)
        args.push(this.parseExpression(3));
      }

      return {
        type: ASTNodeType.FUNCTION,
        name: funcToken.name,
        args,
      };
    }

    throw new Error(`Unexpected token '${token.value || token.name || token.raw}'`);
  }
}

export function parse(expression) {
  const tokens = tokenize(expression);
  if (tokens.length === 0) {
    throw new Error('Expression is empty');
  }
  const parser = new Parser(tokens);
  const ast = parser.parseExpression(0);
  if (parser.pos < tokens.length) {
    const trailing = tokens[parser.pos];
    throw new Error(`Unexpected extra token '${trailing.value || trailing.raw || trailing.name}'`);
  }
  return ast;
}
