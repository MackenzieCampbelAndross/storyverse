import React from 'react';
import { StoryBook, PlayerSession } from '../types';

interface StoryGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: StoryBook;
  session: PlayerSession;
}

export const StoryGraphModal: React.FC<StoryGraphModalProps> = ({
  isOpen,
  onClose,
  book,
  session,
}) => {
  if (!isOpen) return null;

  const nodesList = Object.values(book.nodes);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🗺️</span>
            <div>
              <h3 className="text-base font-bold text-slate-100">Narrative Branching Map</h3>
              <p className="text-xs text-slate-400">
                Visual topography of storylines, endings, and decision branches.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nodesList.map((node) => {
              const isCurrent = session.currentNodeId === node.id;
              const isVisited = session.visitedNodeIds.includes(node.id);

              let statusBadge = (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-500">
                  Unvisited
                </span>
              );

              if (isCurrent) {
                statusBadge = (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                    Current Location
                  </span>
                );
              } else if (isVisited) {
                statusBadge = (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Visited
                  </span>
                );
              }

              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-500/10'
                      : isVisited
                      ? 'bg-slate-900/90 border-slate-800'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">
                        {node.id}
                      </span>
                      {statusBadge}
                    </div>

                    <h4 className="text-sm font-bold text-slate-200 mb-1">{node.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 italic mb-3">
                      {isVisited ? node.content : 'Content obscured until discovered.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    {node.isEnding ? (
                      <span className="text-amber-400 font-bold">🏁 Ending ({node.endingType})</span>
                    ) : (
                      <span>{node.choices.length} Decision Paths</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
