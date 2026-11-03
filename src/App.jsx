import React, { useState, useCallback } from 'react';
import BackgroundBubbles from './components/common/BackgroundBubbles';
import SplashScreen from './components/common/SplashScreen';
import Header from './components/common/Header';

import HomePage from './components/views/HomePage';
import BasicScientificView from './components/views/BasicScientificView';
import AlgebraView from './components/views/AlgebraView';
import FractionsView from './components/views/FractionsView';
import StatisticsView from './components/views/StatisticsView';
import GeometryView from './components/views/GeometryView';
import ConverterView from './components/views/ConverterView';
import FinanceView from './components/views/FinanceView';
import GraphView from './components/views/GraphView';
import HistoryView from './components/views/HistoryView';

import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';
import { useFavorites } from './hooks/useFavorites';
import { useKeyboard } from './hooks/useKeyboard';

import { parse } from './engine/parser';
import { evaluateAST, cleanFloat } from './engine/evaluator';
import { generateExplanation } from './engine/explanation';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeMode, setActiveMode] = useState('Home'); // Default Home Page
  const [angleMode, setAngleMode] = useState('DEG'); // 'DEG' | 'RAD'
  const [precision, setPrecision] = useState('auto'); // 'auto' | '2' | '4' | '6'

  // Calculator expression state
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [fraction, setFraction] = useState(null);
  const [exactVal, setExactVal] = useState(null);
  const [error, setError] = useState(null);
  const [explanation, setExplanation] = useState(null);

  const { theme, toggleTheme } = useTheme();
  const { history, addHistoryItem, deleteHistoryItem, clearHistory } = useHistory();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Evaluate mathematical expression
  const handleEvaluate = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    try {
      setError(null);
      const ast = parse(expression);
      const evalRes = evaluateAST(ast, { angleMode });

      let formattedRes = evalRes.result;
      if (precision !== 'auto' && typeof formattedRes === 'number') {
        formattedRes = cleanFloat(formattedRes, parseInt(precision, 10));
      }

      setResult(formattedRes);
      setFraction(evalRes.fraction);
      setExactVal(evalRes.exactVal);

      const exp = generateExplanation(ast, evalRes, expression, { angleMode });
      
      // Inject exact value step into explanation if present
      if (evalRes.exactVal && evalRes.exactVal.exact) {
        exp.steps.unshift(`Exact Value: ${evalRes.exactVal.exact}${evalRes.exactVal.simplified ? ' = ' + evalRes.exactVal.simplified : ''}`);
      }

      setExplanation(exp);

      // Save to history
      const historyResText = evalRes.exactVal && evalRes.exactVal.exact
        ? `${formattedRes} (Exact: ${evalRes.exactVal.exact}${evalRes.exactVal.simplified ? ' = ' + evalRes.exactVal.simplified : ''})`
        : formattedRes;

      addHistoryItem({
        expression,
        result: historyResText,
        explanation: exp,
        mode: activeMode,
      });
    } catch (err) {
      setError(err.message || 'Invalid mathematical expression');
      setResult(null);
      setFraction(null);
      setExactVal(null);
      setExplanation(null);
    }
  }, [expression, angleMode, precision, activeMode, addHistoryItem]);

  const handleInputChar = useCallback((char) => {
    setError(null);
    setExpression((prev) => prev + char);
  }, []);

  const handleClear = useCallback(() => {
    setExpression('');
    setResult(null);
    setFraction(null);
    setExactVal(null);
    setError(null);
    setExplanation(null);
  }, []);

  const navigateToMode = useCallback((newMode) => {
    handleClear();
    setActiveMode(newMode);
  }, [handleClear]);

  const handleBackspace = useCallback(() => {
    setError(null);
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  const handleToggleSign = useCallback(() => {
    setExpression((prev) => {
      if (!prev) return '-';
      if (prev.startsWith('-')) return prev.slice(1);
      return '-' + prev;
    });
  }, []);

  // Keyboard integration
  useKeyboard({
    onInputChar: handleInputChar,
    onBackspace: handleBackspace,
    onClear: handleClear,
    onEvaluate: handleEvaluate,
    activeMode,
  });

  const handleRecallItem = (item) => {
    handleClear();
    setExpression(item.expression || '');
    setResult(item.result);
    setExplanation(item.explanation || null);
    if (item.mode && ['Basic', 'Scientific'].includes(item.mode)) {
      setActiveMode(item.mode);
    } else {
      setActiveMode('Basic');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Animated Floating Bubbles Background */}
      <BackgroundBubbles />

      {/* Main Container */}
      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 py-4 md:px-6 md:py-6 flex flex-col">
        {/* Navigation Header */}
        <Header
          activeMode={activeMode}
          onBackToHome={() => navigateToMode('Home')}
          angleMode={angleMode}
          setAngleMode={setAngleMode}
          precision={precision}
          setPrecision={setPrecision}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Dynamic Mode View */}
        <main className="flex-1 w-full animate-fade-in">
          {activeMode === 'Home' && (
            <HomePage onSelectMode={(mode) => navigateToMode(mode)} />
          )}

          {(activeMode === 'Basic' || activeMode === 'Scientific') && (
            <BasicScientificView
              expression={expression}
              setExpression={setExpression}
              result={result}
              fraction={fraction}
              exactVal={exactVal}
              error={error}
              explanation={explanation}
              angleMode={angleMode}
              setAngleMode={setAngleMode}
              mode={activeMode}
              isFavorite={isFavorite({ expression, result })}
              onToggleFavorite={() => toggleFavorite({ expression, result, explanation, mode: activeMode })}
              onEvaluate={handleEvaluate}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onToggleSign={handleToggleSign}
              onInputChar={handleInputChar}
            />
          )}

          {activeMode === 'Algebra' && (
            <AlgebraView onSaveHistory={addHistoryItem} />
          )}

          {activeMode === 'Fractions' && (
            <FractionsView onSaveHistory={addHistoryItem} />
          )}

          {activeMode === 'Statistics' && (
            <StatisticsView onSaveHistory={addHistoryItem} />
          )}

          {activeMode === 'Geometry' && (
            <GeometryView onSaveHistory={addHistoryItem} />
          )}

          {activeMode === 'Converter' && (
            <ConverterView onSaveHistory={addHistoryItem} />
          )}

          {activeMode === 'Finance' && (
            <FinanceView onSaveHistory={addHistoryItem} />
          )}

          {activeMode === 'Graph' && <GraphView />}

          {activeMode === 'History' && (
            <HistoryView
              history={history}
              onClearHistory={clearHistory}
              onDeleteHistoryItem={deleteHistoryItem}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              onRecallItem={handleRecallItem}
            />
          )}
        </main>
      </div>
    </div>
  );
}
