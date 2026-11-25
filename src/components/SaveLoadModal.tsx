import React, { useState } from 'react';
import { NarrativeEngine } from '../core/narrative_engine';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  engine: NarrativeEngine;
  onRefresh: () => void;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  onClose,
  engine,
  onRefresh,
}) => {
  const [slotName, setSlotName] = useState('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const saves = engine.getSaveSlots();

  const handleCreateSave = () => {
    if (!slotName.trim()) return;
    engine.saveGame(slotName.trim());
    setSlotName('');
    setSaveToast('Progress saved successfully!');
    setTimeout(() => setSaveToast(null), 2500);
    onRefresh();
  };

  const handleLoadSave = (slotId: string) => {
    engine.loadGame(slotId);
    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">💾</span>
            <h3 className="text-base font-bold text-slate-100">Chronicle Save Slots</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Create Save Slot */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Create New Save Point
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={slotName}
                onChange={(e) => setSlotName(e.target.value)}
                placeholder="e.g. Before Entering Engineering"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-purple-500"
              />
              <button
                onClick={handleCreateSave}
                disabled={!slotName.trim()}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold disabled:opacity-50"
              >
                Save
              </button>
            </div>
            {saveToast && (
              <p className="text-xs text-emerald-400 font-semibold">{saveToast}</p>
            )}
          </div>

          {/* Existing Saves List */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Saved Timelines ({saves.length})
            </h4>

            {saves.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No saved games found.</p>
            ) : (
              <div className="space-y-2">
                {saves.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{slot.name}</h5>
                      <p className="text-[10px] text-slate-500">
                        {new Date(slot.timestamp).toLocaleString()} • {slot.session.history.length} steps
                      </p>
                    </div>
                    <button
                      onClick={() => handleLoadSave(slot.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-purple-300 font-semibold border border-slate-700 transition-all"
                    >
                      Load
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
