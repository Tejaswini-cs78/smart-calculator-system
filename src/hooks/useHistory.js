import { useState, useEffect } from 'react';

function getBrowserClientId() {
  try {
    let clientId = localStorage.getItem('smart_calc_client_id');
    if (!clientId) {
      clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('smart_calc_client_id', clientId);
    }
    return clientId;
  } catch {
    return 'default_client';
  }
}

function getHistoryStorageKey() {
  const clientId = getBrowserClientId();
  return `smart_calc_history_${clientId}`;
}

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const key = getHistoryStorageKey();
      let saved = localStorage.getItem(key);

      // Migration: if browser-specific key does not exist yet, check legacy key
      if (!saved) {
        const legacy = localStorage.getItem('smart_calc_history');
        if (legacy) {
          saved = legacy;
          localStorage.setItem(key, legacy);
          localStorage.removeItem('smart_calc_history');
        }
      }

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const key = getHistoryStorageKey();
      localStorage.setItem(key, JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save history to localStorage', err);
    }
  }, [history]);

  const addHistoryItem = (item) => {
    const newItem = {
      id: Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      expression: item.expression,
      result: item.result,
      explanation: item.explanation,
      mode: item.mode || 'Basic',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory(prev => [newItem, ...prev.slice(0, 49)]); // Keep last 50 items
  };

  const deleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addHistoryItem, deleteHistoryItem, clearHistory };
}
