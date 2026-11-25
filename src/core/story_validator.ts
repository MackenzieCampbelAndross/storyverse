import { StoryBook } from '../types';

export interface StoryValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  reachableNodeCount: number;
  totalNodeCount: number;
}

export class StoryValidator {
  static validate(book: StoryBook): StoryValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const nodeIds = Object.keys(book.nodes);
    const totalNodeCount = nodeIds.length;

    // 1. Root node check
    if (!book.rootNodeId || !book.nodes[book.rootNodeId]) {
      errors.push(`Book has missing or invalid root node ID: "${book.rootNodeId}"`);
      return { isValid: false, errors, warnings, reachableNodeCount: 0, totalNodeCount };
    }

    // 2. Choice targets and dead ends check
    for (const [nodeId, node] of Object.entries(book.nodes)) {
      if (!node.isEnding && node.choices.length === 0) {
        errors.push(`Node "${node.title}" (${nodeId}) has no choices but is not marked as an ending`);
      }

      for (const choice of node.choices) {
        if (!book.nodes[choice.targetNodeId]) {
          errors.push(
            `Node "${node.title}" (${nodeId}) has choice "${choice.text}" pointing to missing target "${choice.targetNodeId}"`
          );
        }
      }
    }

    // 3. Reachability traversal (BFS from root)
    const visited = new Set<string>();
    const queue: string[] = [book.rootNodeId];
    visited.add(book.rootNodeId);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const node = book.nodes[curr];
      if (!node) continue;

      for (const choice of node.choices) {
        if (!visited.has(choice.targetNodeId) && book.nodes[choice.targetNodeId]) {
          visited.add(choice.targetNodeId);
          queue.push(choice.targetNodeId);
        }
      }
    }

    const unreachable = nodeIds.filter((id) => !visited.has(id));
    if (unreachable.length > 0) {
      warnings.push(`Story contains ${unreachable.length} unreachable nodes from root: ${unreachable.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      reachableNodeCount: visited.size,
      totalNodeCount,
    };
  }
}
