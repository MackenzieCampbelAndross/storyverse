import { CharacterStats, PlayerSession, StoryChoice, StoryReward } from '../types';

export class ConditionEvaluator {
  static evaluate(choice: StoryChoice, session: PlayerSession): { isAvailable: boolean; reason?: string } {
    if (!choice.condition) {
      return { isAvailable: true };
    }

    const { stat, minStat, maxStat, requiredItem, forbiddenItem, requiredFlag } = choice.condition;

    // 1. Stat condition
    if (stat !== undefined) {
      const currentVal = session.stats[stat];
      if (minStat !== undefined && currentVal < minStat) {
        return { isAvailable: false, reason: `Requires at least ${minStat} ${stat} (You have: ${currentVal})` };
      }
      if (maxStat !== undefined && currentVal > maxStat) {
        return { isAvailable: false, reason: `Requires at most ${maxStat} ${stat} (You have: ${currentVal})` };
      }
    }

    // 2. Required item
    if (requiredItem && !session.inventory.includes(requiredItem)) {
      return { isAvailable: false, reason: `Requires item: "${requiredItem}"` };
    }

    // 3. Forbidden item
    if (forbiddenItem && session.inventory.includes(forbiddenItem)) {
      return { isAvailable: false, reason: `Cannot possess: "${forbiddenItem}"` };
    }

    // 4. Required flag
    if (requiredFlag && !session.flags[requiredFlag]) {
      return { isAvailable: false, reason: `Prerequisite unfulfilled: ${requiredFlag}` };
    }

    return { isAvailable: true };
  }

  static applyReward(reward: StoryReward, session: PlayerSession): {
    updatedStats: CharacterStats;
    updatedInventory: string[];
    updatedFlags: Record<string, boolean>;
    newAchievements: string[];
  } {
    const updatedStats = { ...session.stats };
    const updatedInventory = [...session.inventory];
    const updatedFlags = { ...session.flags };
    const newAchievements: string[] = [];

    // Stat changes
    if (reward.statChanges) {
      for (const [k, v] of Object.entries(reward.statChanges)) {
        const statKey = k as keyof CharacterStats;
        let newVal = updatedStats[statKey] + (v || 0);
        if (statKey === 'health' || statKey === 'sanity') {
          newVal = Math.max(0, Math.min(100, newVal));
        }
        updatedStats[statKey] = newVal;
      }
    }

    // Inventory addition
    if (reward.addItem && !updatedInventory.includes(reward.addItem)) {
      updatedInventory.push(reward.addItem);
    }

    // Inventory removal
    if (reward.removeItem) {
      const idx = updatedInventory.indexOf(reward.removeItem);
      if (idx >= 0) {
        updatedInventory.splice(idx, 1);
      }
    }

    // Flags
    if (reward.setFlag) {
      updatedFlags[reward.setFlag] = true;
    }

    // Achievements
    if (reward.unlockAchievement && !session.unlockedAchievements.includes(reward.unlockAchievement)) {
      newAchievements.push(reward.unlockAchievement);
    }

    return {
      updatedStats,
      updatedInventory,
      updatedFlags,
      newAchievements,
    };
  }
}
