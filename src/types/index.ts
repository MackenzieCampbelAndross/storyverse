/**
 * Domain types and models for StoryVerse (Interactive Branching Narrative Platform).
 */

export type Genre = 'SCI_FI' | 'FANTASY' | 'MYSTERY' | 'HORROR' | 'CYBERPUNK';

export interface CharacterStats {
  health: number;      // 0 to 100
  sanity: number;      // 0 to 100
  credits: number;     // e.g. currency
  reputation: number;  // -50 to +50
}

export interface StoryCondition {
  stat?: keyof CharacterStats;
  minStat?: number;
  maxStat?: number;
  requiredItem?: string;
  forbiddenItem?: string;
  requiredFlag?: string;
}

export interface StoryReward {
  statChanges?: Partial<CharacterStats>;
  addItem?: string;
  removeItem?: string;
  setFlag?: string;
  unlockAchievement?: string;
}

export interface StoryChoice {
  id: string;
  text: string;
  targetNodeId: string;
  condition?: StoryCondition;
  reward?: StoryReward;
  isSecret?: boolean;
}

export interface StoryNode {
  id: string;
  title: string;
  content: string;
  visualMood: string; // e.g. 'space_station', 'dark_forest', 'neon_alley'
  isEnding?: boolean;
  endingType?: 'VICTORY' | 'TRAGIC' | 'MYSTERIOUS';
  choices: StoryChoice[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface StoryBook {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  synopsis: string;
  initialStats: CharacterStats;
  initialInventory: string[];
  rootNodeId: string;
  nodes: Record<string, StoryNode>;
  achievements: Achievement[];
}

export interface StoryHistoryEntry {
  nodeId: string;
  nodeTitle: string;
  choiceText?: string;
  timestamp: number;
}

export interface PlayerSession {
  bookId: string;
  currentNodeId: string;
  stats: CharacterStats;
  inventory: string[];
  flags: Record<string, boolean>;
  visitedNodeIds: string[];
  unlockedAchievements: string[];
  history: StoryHistoryEntry[];
}

export interface SaveSlot {
  id: string;
  name: string;
  timestamp: number;
  session: PlayerSession;
}
