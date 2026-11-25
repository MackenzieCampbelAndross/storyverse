import { describe, it, expect } from 'vitest';
import { ConditionEvaluator } from '../src/core/condition_evaluator';
import { PlayerSession, StoryChoice } from '../src/types';

describe('ConditionEvaluator', () => {
  const baseSession: PlayerSession = {
    bookId: 'book_test',
    currentNodeId: 'node_start',
    stats: { health: 80, sanity: 60, credits: 200, reputation: 5 },
    inventory: ['Plasma Torch', 'Keycard'],
    flags: { has_access: true },
    visitedNodeIds: ['node_start'],
    unlockedAchievements: [],
    history: [],
  };

  it('allows choices with no conditions', () => {
    const choice: StoryChoice = { id: 'c1', text: 'Walk forward', targetNodeId: 'node_next' };
    const res = ConditionEvaluator.evaluate(choice, baseSession);
    expect(res.isAvailable).toBe(true);
  });

  it('evaluates minimum and maximum stat constraints', () => {
    const choiceHighHealth: StoryChoice = {
      id: 'c2',
      text: 'Sprint through toxic gas',
      targetNodeId: 'node_gas',
      condition: { minStat: 90, stat: 'health' }, // Session has 80
    };
    const res1 = ConditionEvaluator.evaluate(choiceHighHealth, baseSession);
    expect(res1.isAvailable).toBe(false);
    expect(res1.reason).toContain('health');

    const choicePass: StoryChoice = {
      id: 'c3',
      text: 'Standard physical feat',
      targetNodeId: 'node_pass',
      condition: { minStat: 50, stat: 'health' },
    };
    const res2 = ConditionEvaluator.evaluate(choicePass, baseSession);
    expect(res2.isAvailable).toBe(true);
  });

  it('evaluates inventory item prerequisites', () => {
    const choiceNeedHack: StoryChoice = {
      id: 'c4',
      text: 'Bypass console',
      targetNodeId: 'node_bypass',
      condition: { requiredItem: 'Cyber Deck' }, // Missing
    };
    expect(ConditionEvaluator.evaluate(choiceNeedHack, baseSession).isAvailable).toBe(false);

    const choiceHaveKey: StoryChoice = {
      id: 'c5',
      text: 'Unlock door',
      targetNodeId: 'node_door',
      condition: { requiredItem: 'Keycard' }, // Possessed
    };
    expect(ConditionEvaluator.evaluate(choiceHaveKey, baseSession).isAvailable).toBe(true);
  });

  it('applies rewards and clamps health and sanity between 0 and 100', () => {
    const reward = {
      statChanges: { health: 50, sanity: -80, credits: 100 },
      addItem: 'Ancient Artifact',
      setFlag: 'artifact_found',
      unlockAchievement: 'ach_finder',
    };

    const res = ConditionEvaluator.applyReward(reward, baseSession);
    expect(res.updatedStats.health).toBe(100); // Clamped from 80 + 50 = 130
    expect(res.updatedStats.sanity).toBe(0); // Clamped from 60 - 80 = -20
    expect(res.updatedStats.credits).toBe(300);
    expect(res.updatedInventory).toContain('Ancient Artifact');
    expect(res.updatedFlags['artifact_found']).toBe(true);
    expect(res.newAchievements).toContain('ach_finder');
  });
});
