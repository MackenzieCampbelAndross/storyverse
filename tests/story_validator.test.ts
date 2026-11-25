import { describe, it, expect } from 'vitest';
import { StoryValidator } from '../src/core/story_validator';
import { QUANTUM_HORIZON } from '../src/core/story_catalog';
import { StoryBook } from '../src/types';

describe('StoryValidator', () => {
  it('validates official storybook without critical errors', () => {
    const res = StoryValidator.validate(QUANTUM_HORIZON);
    expect(res.isValid).toBe(true);
    expect(res.errors.length).toBe(0);
    expect(res.reachableNodeCount).toBe(res.totalNodeCount);
  });

  it('detects missing root node', () => {
    const brokenBook: StoryBook = {
      ...QUANTUM_HORIZON,
      rootNodeId: 'non_existent_node_id',
    };
    const res = StoryValidator.validate(brokenBook);
    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.includes('root node ID'))).toBe(true);
  });

  it('detects broken choice targets', () => {
    const brokenBook: StoryBook = {
      ...QUANTUM_HORIZON,
      nodes: {
        ...QUANTUM_HORIZON.nodes,
        node_airlock: {
          ...QUANTUM_HORIZON.nodes.node_airlock,
          choices: [
            { id: 'c_broken', text: 'Go nowhere', targetNodeId: 'missing_destination_xyz' },
          ],
        },
      },
    };

    const res = StoryValidator.validate(brokenBook);
    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.includes('missing target'))).toBe(true);
  });
});
