import React from 'react';
import { StoryBook } from '../types';

interface HeaderProps {
  book: StoryBook;
  onOpenGraph: () => void;
  onOpenAuthoring: () => void;
  onOpenSaves: () => void;
  onRestart: () => void;
  achievementCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  book,
  onOpenGraph,
  onOpenAuthoring,
  onOpenSaves,
  onRestart,
  achievementCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 select-none">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">
          🌌
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
              STORYVERSE
            </span>
            <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
              {book.genre}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate max-w-sm">{book.title}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenGraph}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all flex items-center space-x-1.5"
          title="Inspect Story Branching Map"
        >
          <span>🗺️</span>
          <span>Story Map</span>
        </button>

        <button
          onClick={onOpenSaves}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all flex items-center space-x-1.5"
        >
          <span>💾</span>
          <span>Saves</span>
        </button>

        <button
          onClick={onOpenAuthoring}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 text-xs font-medium border border-slate-700 transition-all flex items-center space-x-1.5"
        >
          <span>✍️</span>
          <span>Author Mode</span>
        </button>

        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-400">
          <span>🏆</span>
          <span className="font-bold">{achievementCount}</span>
        </div>

        <button
          onClick={onRestart}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 text-xs transition-colors"
          title="Restart Story"
        >
          🔄
        </button>
      </div>
    </header>
  );
};
