import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_calc_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('smart_calc_favorites', JSON.stringify(favorites));
    } catch (err) {
      console.error('Failed to save favorites to localStorage', err);
    }
  }, [favorites]);

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.expression === item.expression && f.result === item.result);
      if (exists) {
        return prev.filter(f => !(f.expression === item.expression && f.result === item.result));
      } else {
        return [{
          id: Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          expression: item.expression,
          result: item.result,
          explanation: item.explanation,
          mode: item.mode || 'Saved',
        }, ...prev];
      }
    });
  };

  const isFavorite = (item) => {
    if (!item || !item.expression) return false;
    return favorites.some(f => f.expression === item.expression && f.result === item.result);
  };

  return { favorites, toggleFavorite, isFavorite };
}
