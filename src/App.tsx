import React, { useState, useMemo } from 'react';
import { NarrativeEngine } from './core/narrative_engine';
import { QUANTUM_HORIZON } from './core/story_catalog';
import { Header } from './components/Header';
import { StoryReader } from './components/StoryReader';
import { CharacterSheet } from './components/CharacterSheet';
import { StoryGraphModal } from './components/StoryGraphModal';
import { AuthoringModal } from './components/AuthoringModal';
import { SaveLoadModal } from './components/SaveLoadModal';
import { StoryBook } from './types';

export const App: React.FC = () => {
  const [book, setBook] = useState<StoryBook>(QUANTUM_HORIZON);
  const engine = useMemo(() => new NarrativeEngine(book), [book]);
  const [, setTick] = useState(0);

  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isAuthoringOpen, setIsAuthoringOpen] = useState(false);
  const [isSavesOpen, setIsSavesOpen] = useState(false);

  const refresh = () => setTick((t) => t + 1);

  const currentNode = engine.getCurrentNode();
  const session = engine.getSession();

  const handleMakeChoice = (choiceId: string) => {
    engine.makeChoice(choiceId);
    refresh();
  };

  const handleRestart = () => {
    engine.restart();
    refresh();
  };

  const handleSaveBook = (updatedBook: StoryBook) => {
    setBook(updatedBook);
    refresh();
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      <Header
        book={book}
        onOpenGraph={() => setIsGraphOpen(true)}
        onOpenAuthoring={() => setIsAuthoringOpen(true)}
        onOpenSaves={() => setIsSavesOpen(true)}
        onRestart={handleRestart}
        achievementCount={session.unlockedAchievements.length}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <StoryReader
          node={currentNode}
          session={session}
          onMakeChoice={handleMakeChoice}
          onRestart={handleRestart}
        />

        <CharacterSheet session={session} book={book} />
      </div>

      <StoryGraphModal
        isOpen={isGraphOpen}
        onClose={() => setIsGraphOpen(false)}
        book={book}
        session={session}
      />

      <AuthoringModal
        isOpen={isAuthoringOpen}
        onClose={() => setIsAuthoringOpen(false)}
        book={book}
        onSaveBook={handleSaveBook}
      />

      <SaveLoadModal
        isOpen={isSavesOpen}
        onClose={() => setIsSavesOpen(false)}
        engine={engine}
        onRefresh={refresh}
      />
    </div>
  );
};

export default App;
