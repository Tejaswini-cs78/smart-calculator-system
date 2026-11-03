import { useEffect } from 'react';

export function useKeyboard({ onInputChar, onBackspace, onClear, onEvaluate, activeMode }) {
  useEffect(() => {
    function handleKeyDown(e) {
      // Don't capture when typing in standard input fields (e.g. text inputs in algebra, stats)
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === 'Enter') {
          onEvaluate?.();
        }
        return;
      }

      const key = e.key;

      if (key >= '0' && key <= '9') {
        onInputChar?.(key);
      } else if (key === '.') {
        onInputChar?.('.');
      } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%' || key === '^') {
        onInputChar?.(key === '*' ? '×' : key === '/' ? '÷' : key);
      } else if (key === '(' || key === ')') {
        onInputChar?.(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        onEvaluate?.();
      } else if (key === 'Backspace') {
        e.preventDefault();
        onBackspace?.();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        onClear?.();
      } else if (key === '!') {
        onInputChar?.('!');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInputChar, onBackspace, onClear, onEvaluate, activeMode]);
}
