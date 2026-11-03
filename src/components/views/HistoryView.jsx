import React, { useState } from 'react';
import ExplanationCard from '../common/ExplanationCard';
import { History, Star, Trash2, Search, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function HistoryView({
  history,
  onClearHistory,
  onDeleteHistoryItem,
  favorites,
  onToggleFavorite,
  isFavorite,
  onRecallItem
}) {
  const [search, setSearch] = useState('');
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const displayList = showOnlyFavs ? favorites : history;

  const filtered = displayList.filter((item) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      item.expression?.toLowerCase().includes(query) ||
      item.result?.toString().toLowerCase().includes(query) ||
      item.mode?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header controls: Search & Filter */}
      <div className="glass-panel p-4 border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-slate-200 text-base">Calculation History & Favorites</h3>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-slate-900/80 text-white text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Favorites toggle */}
          <button
            onClick={() => setShowOnlyFavs(!showOnlyFavs)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              showOnlyFavs
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showOnlyFavs ? 'fill-current' : ''}`} />
            <span>Favorites ({favorites.length})</span>
          </button>

          {/* Clear History */}
          {!showOnlyFavs && history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all calculation history?')) {
                  onClearHistory();
                }
              }}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-colors"
              title="Clear History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* History Items List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400 space-y-2">
          <History className="w-8 h-8 text-slate-500 mx-auto opacity-50" />
          <h4 className="font-semibold text-slate-300">
            {showOnlyFavs ? 'No Saved Favorites' : 'No History Found'}
          </h4>
          <p className="text-xs">
            {showOnlyFavs
              ? 'Click the star icon on any calculation result to save it to favorites.'
              : 'Your calculated expressions and step explanations will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const fav = isFavorite(item);
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="glass-card p-4 border border-white/10 hover:border-indigo-500/30 transition-all shadow-md space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.mode || 'Calc'}
                    </span>
                    {item.timestamp && (
                      <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Recall item */}
                    <button
                      onClick={() => onRecallItem?.(item)}
                      className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-indigo-400 border border-white/10 transition-colors"
                      title="Recall Calculation"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    {/* Favorite toggle */}
                    <button
                      onClick={() => onToggleFavorite(item)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        fav
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                      title={fav ? 'Remove Favorite' : 'Save Favorite'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>

                    {/* Delete single item */}
                    {!showOnlyFavs && (
                      <button
                        onClick={() => onDeleteHistoryItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete from History"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expression & Result */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-white/5 pt-2">
                  <span className="font-mono text-sm text-slate-400">{item.expression}</span>
                  <span className="font-mono text-lg font-bold text-white text-indigo-300">
                    = {item.result}
                  </span>
                </div>

                {/* Expand Explanation toggle */}
                {item.explanation && (
                  <div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-xs font-semibold text-indigo-400 hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <span>{isExpanded ? 'Hide Step Explanation' : 'View Step Explanation'}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2">
                        <ExplanationCard explanation={item.explanation} defaultExpanded={true} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
