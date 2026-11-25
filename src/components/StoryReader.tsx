import React from 'react';
import { StoryNode, PlayerSession } from '../types';
import { ConditionEvaluator } from '../core/condition_evaluator';

interface StoryReaderProps {
  node: StoryNode;
  session: PlayerSession;
  onMakeChoice: (choiceId: string) => void;
  onRestart: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  node,
  session,
  onMakeChoice,
  onRestart,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Visual Scene Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-indigo-950/60 to-slate-900/80 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              {node.visualMood.replace('_', ' ')}
            </span>

            {node.isEnding && (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  node.endingType === 'VICTORY'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {node.endingType} ENDING
              </span>
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-100 mb-4">{node.title}</h2>

          <p className="text-slate-300 leading-relaxed font-serif text-base sm:text-lg whitespace-pre-line">
            {node.content}
          </p>
        </div>

        {/* Choices Section */}
        {!node.isEnding ? (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              What do you do?
            </h3>

            <div className="space-y-2.5">
              {node.choices.map((choice) => {
                const evalResult = ConditionEvaluator.evaluate(choice, session);

                return (
                  <button
                    key={choice.id}
                    disabled={!evalResult.isAvailable}
                    onClick={() => onMakeChoice(choice.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between group ${
                      evalResult.isAvailable
                        ? 'bg-slate-900/90 border-slate-800 hover:border-purple-500/60 hover:bg-slate-800/80 text-slate-200 shadow-md cursor-pointer'
                        : 'bg-slate-950/60 border-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm font-medium group-hover:text-purple-300 transition-colors">
                        {choice.text}
                      </span>
                      {evalResult.isAvailable ? (
                        <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      ) : (
                        <span className="text-xs text-rose-400/80 font-mono">🔒 Locked</span>
                      )}
                    </div>

                    {!evalResult.isAvailable && evalResult.reason && (
                      <p className="text-[11px] text-rose-400/90 mt-2 font-mono">
                        {evalResult.reason}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Chapter Concluded</h3>
            <p className="text-xs text-slate-400">
              You have completed this narrative branch. Explore alternate timelines or restart.
            </p>
            <button
              onClick={onRestart}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all"
            >
              Begin a New Timeline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
