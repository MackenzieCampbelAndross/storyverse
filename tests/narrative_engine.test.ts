import { describe, it, expect } from 'vitest';
import { NarrativeEngine } from '../src/core/narrative_engine';
import { QUANTUM_HORIZON } from '../src/core/story_catalog';

describe('NarrativeEngine', () => {
  it('initializes session at root node with configured initial stats and inventory', () => {
    const engine = new NarrativeEngine(QUANTUM_HORIZON);
    const session = engine.getSession();
    const currentNode = engine.getCurrentNode();

    expect(session.currentNodeId).toBe(QUANTUM_HORIZON.rootNodeId);
    expect(currentNode.id).toBe(QUANTUM_HORIZON.rootNodeId);
    expect(session.stats.health).toBe(100);
    expect(session.inventory).toContain('Scanner Omni-Tool');
    expect(session.history.length).toBe(1);
  });

  it('makes choices, updates location, and records history breadcrumbs', () => {
    const engine = new NarrativeEngine(QUANTUM_HORIZON);
    // Airlock -> Bridge
    const success = engine.makeChoice('c_to_bridge');
    expect(success).toBe(true);
    expect(engine.getSession().currentNodeId).toBe('node_bridge');
    expect(engine.getSession().history.length).toBe(2);
    expect(engine.getSession().visitedNodeIds).toContain('node_bridge');
  });

  it('saves and loads game slots accurately', () => {
    const engine = new NarrativeEngine(QUANTUM_HORIZON);
    engine.makeChoice('c_search_lockers');
    expect(engine.getSession().currentNodeId).toBe('node_lockers');

    const saveSlot = engine.saveGame('At Lockers');
    expect(saveSlot.name).toBe('At Lockers');
    expect(engine.getSaveSlots().length).toBeGreaterThan(0);

    // Restart
    engine.restart();
    expect(engine.getSession().currentNodeId).toBe('node_airlock');

    // Load save
    const loaded = engine.loadGame(saveSlot.id);
    expect(loaded).toBe(true);
    expect(engine.getSession().currentNodeId).toBe('node_lockers');
  });
});
