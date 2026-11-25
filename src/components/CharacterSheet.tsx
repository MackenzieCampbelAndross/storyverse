import React from 'react';
import { PlayerSession, StoryBook } from '../types';

interface CharacterSheetProps {
  session: PlayerSession;
  book: StoryBook;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ session, book }) => {
  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-[calc(100vh-56px)] select-none z-10 text-slate-200">
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Protagonist Status
        </h3>

        {/* Health & Sanity Bars */}
        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
              <span>Health</span>
              <span className="font-mono text-emerald-400">{session.stats.health}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${session.stats.health}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
              <span>Sanity</span>
              <span className="font-mono text-purple-400">{session.stats.sanity}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${session.stats.sanity}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400">Credits:</span>
            <span className="font-mono font-bold text-amber-400">¢{session.stats.credits}</span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Reputation:</span>
            <span className="font-mono font-bold text-sky-400">+{session.stats.reputation}</span>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Inventory ({session.inventory.length})
        </h4>

        {session.inventory.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Inventory is currently empty.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {session.inventory.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 font-medium border border-slate-700/80 flex items-center space-x-1"
              >
                <span>📦</span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Traversed Timeline History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Timeline Chronicle ({session.history.length})
        </h4>

        <div className="space-y-1.5">
          {session.history.map((entry, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs font-mono"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Step {idx + 1}</span>
                <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-slate-200 font-semibold mt-0.5 truncate">{entry.nodeTitle}</p>
              {entry.choiceText && (
                <p className="text-purple-400/80 text-[11px] mt-1 italic truncate">
                  ↳ {entry.choiceText}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements List */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
            Achievements
          </span>
          <span className="font-mono text-amber-400 text-xs">
            {session.unlockedAchievements.length} / {book.achievements.length}
          </span>
        </div>

        <div className="flex space-x-2 overflow-x-auto py-1">
          {book.achievements.map((ach) => {
            const isUnlocked = session.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                title={`${ach.title}: ${ach.description} (${isUnlocked ? 'Unlocked' : 'Locked'})`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${
                  isUnlocked
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-600 grayscale opacity-40'
                }`}
              >
                {ach.icon}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
