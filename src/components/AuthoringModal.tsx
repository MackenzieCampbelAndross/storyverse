import React, { useState } from 'react';
import { StoryBook, StoryNode } from '../types';

interface AuthoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: StoryBook;
  onSaveBook: (updatedBook: StoryBook) => void;
}

export const AuthoringModal: React.FC<AuthoringModalProps> = ({
  isOpen,
  onClose,
  book,
  onSaveBook,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(book.rootNodeId);
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeContent, setNodeContent] = useState('');
  const [isEnding, setIsEnding] = useState(false);

  if (!isOpen) return null;

  const currentNode = book.nodes[selectedNodeId] || Object.values(book.nodes)[0];

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    const n = book.nodes[nodeId];
    if (n) {
      setNodeTitle(n.title);
      setNodeContent(n.content);
      setIsEnding(!!n.isEnding);
    }
  };

  const handleApplyNodeUpdate = () => {
    const updatedBook: StoryBook = {
      ...book,
      nodes: {
        ...book.nodes,
        [selectedNodeId]: {
          ...currentNode,
          title: nodeTitle || currentNode.title,
          content: nodeContent || currentNode.content,
          isEnding,
        },
      },
    };
    onSaveBook(updatedBook);
  };

  const handleCreateNewNode = () => {
    const newId = `node_custom_${Date.now()}`;
    const newNode: StoryNode = {
      id: newId,
      title: 'New Chapter Scene',
      content: 'Write the prose narrative describing the scene and choices here...',
      visualMood: 'space_station',
      choices: [],
    };

    const updatedBook: StoryBook = {
      ...book,
      nodes: {
        ...book.nodes,
        [newId]: newNode,
      },
    };

    onSaveBook(updatedBook);
    handleSelectNode(newId);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">✍️</span>
            <div>
              <h3 className="text-base font-bold text-slate-100">Story Authoring Suite</h3>
              <p className="text-xs text-slate-400">
                Author new narrative scenes, edit choices, and configure branching parameters.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Node Selector List */}
          <div className="w-64 border-r border-slate-800 bg-slate-950/60 p-3 overflow-y-auto space-y-1">
            <button
              onClick={handleCreateNewNode}
              className="w-full py-2 mb-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm"
            >
              + New Scene Node
            </button>

            {Object.values(book.nodes).map((n) => (
              <div
                key={n.id}
                onClick={() => handleSelectNode(n.id)}
                className={`p-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                  selectedNodeId === n.id
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="truncate font-semibold">{n.title}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">{n.id}</div>
              </div>
            ))}
          </div>

          {/* Node Editor Form */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Scene Title
              </label>
              <input
                type="text"
                value={nodeTitle || currentNode.title}
                onChange={(e) => setNodeTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Narrative Prose Content
              </label>
              <textarea
                value={nodeContent || currentNode.content}
                onChange={(e) => setNodeContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-serif leading-relaxed text-slate-200 h-44 outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isEndingCheck"
                checked={isEnding}
                onChange={(e) => setIsEnding(e.target.checked)}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="isEndingCheck" className="text-xs text-slate-300 font-medium">
                Mark this scene as a story chapter ending
              </label>
            </div>

            <button
              onClick={handleApplyNodeUpdate}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
            >
              Apply Scene Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
