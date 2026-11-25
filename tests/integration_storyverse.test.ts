import { describe, it, expect } from 'vitest';
import { NarrativeEngine } from '../src/core/narrative_engine';
import { QUANTUM_HORIZON } from '../src/core/story_catalog';

describe('StoryVerse End-to-End Narrative Playthrough', () => {
  it('completes the hyper-drive prototype shuttle escape storyline with achievements and keycard prerequisites', () => {
    const engine = new NarrativeEngine(QUANTUM_HORIZON);

    // 1. Airlock: search lockers
    expect(engine.getCurrentNode().id).toBe('node_airlock');
    const move1 = engine.makeChoice('c_search_lockers');
    expect(move1).toBe(true);

    // 2. Lockers: take Level-3 Keycard to bridge
    expect(engine.getCurrentNode().id).toBe('node_lockers');
    const move2 = engine.makeChoice('c_take_gear_to_bridge');
    expect(move2).toBe(true);
    expect(engine.getSession().inventory).toContain('Level-3 Security Keycard');

    // 3. Bridge: attempt to decrypt logs using Level-3 Keycard
    expect(engine.getCurrentNode().id).toBe('node_bridge');
    const move3 = engine.makeChoice('c_decrypt_logs');
    expect(move3).toBe(true);

    // 4. Secret archive: sprint to Hangar 9 to pilot the hyper-drive vessel
    expect(engine.getCurrentNode().id).toBe('node_director_secret');
    const move4 = engine.makeChoice('c_to_hangar_shuttle');
    expect(move4).toBe(true);
    expect(engine.getSession().stats.reputation).toBe(30); // 10 + 20

    // 5. Victory Ending
    const endingNode = engine.getCurrentNode();
    expect(endingNode.id).toBe('node_hangar_shuttle');
    expect(endingNode.isEnding).toBe(true);
    expect(endingNode.endingType).toBe('VICTORY');

    // 6. Verify full session state
    const session = engine.getSession();
    expect(session.history.length).toBe(5);
    expect(session.visitedNodeIds.length).toBe(5);
    expect(session.inventory).toContain('Hyper-Drive Coordinates');
  });
});
