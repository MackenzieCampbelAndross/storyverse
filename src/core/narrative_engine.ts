import { StoryBook, PlayerSession, StoryNode, StoryChoice, SaveSlot } from '../types';
import { ConditionEvaluator } from './condition_evaluator';

export class NarrativeEngine {
  private book: StoryBook;
  private session: PlayerSession;
  private saveSlots: SaveSlot[] = [];
  private storageKey = 'storyverse_saves_v1';

  constructor(book: StoryBook, savedSession?: PlayerSession) {
    this.book = book;
    if (savedSession) {
      this.session = savedSession;
    } else {
      this.session = this.createNewSession(book);
    }
    this.loadSavesFromStorage();
  }

  createNewSession(book: StoryBook): PlayerSession {
    const root = book.nodes[book.rootNodeId];
    return {
      bookId: book.id,
      currentNodeId: book.rootNodeId,
      stats: { ...book.initialStats },
      inventory: [...book.initialInventory],
      flags: {},
      visitedNodeIds: [book.rootNodeId],
      unlockedAchievements: [],
      history: [
        {
          nodeId: book.rootNodeId,
          nodeTitle: root?.title || 'Prologue',
          timestamp: Date.now(),
        },
      ],
    };
  }

  getCurrentNode(): StoryNode {
    return this.book.nodes[this.session.currentNodeId] || this.book.nodes[this.book.rootNodeId];
  }

  getSession(): PlayerSession {
    return this.session;
  }

  getBook(): StoryBook {
    return this.book;
  }

  canMakeChoice(choice: StoryChoice): { isAvailable: boolean; reason?: string } {
    return ConditionEvaluator.evaluate(choice, this.session);
  }

  makeChoice(choiceId: string): boolean {
    const currentNode = this.getCurrentNode();
    const choice = currentNode.choices.find((c) => c.id === choiceId);
    if (!choice) return false;

    const evalResult = this.canMakeChoice(choice);
    if (!evalResult.isAvailable) return false;

    // Apply rewards if any
    if (choice.reward) {
      const rewardResult = ConditionEvaluator.applyReward(choice.reward, this.session);
      this.session.stats = rewardResult.updatedStats;
      this.session.inventory = rewardResult.updatedInventory;
      this.session.flags = rewardResult.updatedFlags;
      for (const ach of rewardResult.newAchievements) {
        if (!this.session.unlockedAchievements.includes(ach)) {
          this.session.unlockedAchievements.push(ach);
        }
      }
    }

    // Advance to target node
    this.session.currentNodeId = choice.targetNodeId;
    if (!this.session.visitedNodeIds.includes(choice.targetNodeId)) {
      this.session.visitedNodeIds.push(choice.targetNodeId);
    }

    const nextNode = this.book.nodes[choice.targetNodeId];
    this.session.history.push({
      nodeId: choice.targetNodeId,
      nodeTitle: nextNode?.title || 'Unknown',
      choiceText: choice.text,
      timestamp: Date.now(),
    });

    this.syncStorage();
    return true;
  }

  restart(): void {
    this.session = this.createNewSession(this.book);
    this.syncStorage();
  }

  saveGame(name: string): SaveSlot {
    const slot: SaveSlot = {
      id: `save_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      timestamp: Date.now(),
      session: JSON.parse(JSON.stringify(this.session)),
    };

    this.saveSlots.push(slot);
    this.syncStorage();
    return slot;
  }

  loadGame(slotId: string): boolean {
    const slot = this.saveSlots.find((s) => s.id === slotId);
    if (!slot) return false;
    this.session = JSON.parse(JSON.stringify(slot.session));
    this.syncStorage();
    return true;
  }

  getSaveSlots(): SaveSlot[] {
    return this.saveSlots;
  }

  private syncStorage(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.saveSlots));
      } catch {
        // ignore
      }
    }
  }

  private loadSavesFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
          this.saveSlots = JSON.parse(raw);
        }
      } catch {
        // ignore
      }
    }
  }
}
