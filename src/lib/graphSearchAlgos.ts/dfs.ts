import type { Grid, Position } from "@/types/Cell";
import type { AlgorithmResult } from "@/types/algorithms";
import type {  AnimationStep } from "@/types/animation";
import type { AnimationStats } from "@/types/context/AppContext";

/**
 * Depth-First Search (DFS) Algorithm with stats
 *
 * Does NOT guarantee shortest path
 * Explores as far as possible along each branch before backtracking
 *
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
export function executeDFS(
  grid: Grid,
  start: Position,
  end: Position,
): AlgorithmResult {
  const steps: AnimationStep[] = [];
  const visited = new Set<string>();
  const parent = new Map<string, Position | null>();
  const stack: Position[] = [start];

  const key = (pos: Position) => `${pos.row}-${pos.col}`;

  visited.add(key(start));
  parent.set(key(start), null);

  const stats: AnimationStats = {
    visitedNodes: 0,
    pathLength: 0,
    executionTime: 0,
  };

  const startTime = performance.now();

  while (stack.length > 0) {
    const current = stack.pop()!;
    stats.visitedNodes++;

    // Check if reached end
    if (current.row === end.row && current.col === end.col) {
      const pathSteps = reconstructPath(parent, start, end);
      stats.pathLength = pathSteps.length;
      stats.executionTime = performance.now() - startTime;

      return { steps: [...steps, ...pathSteps], stats };
    }

    if (!(current.row === start.row && current.col === start.col)) {
      steps.push({
        mutations: [
          {
            kind: "setState",
            row: current.row,
            col: current.col,
            state: "visited",
          },
        ],
        phase: "search",
      });
    }

    const directions: [number, number][] = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];

    // Reverse for DFS visual consistency
    for (let i = directions.length - 1; i >= 0; i--) {
      const [dr, dc] = directions[i];
      const newRow = current.row + dr;
      const newCol = current.col + dc;
      const neighbor: Position = { row: newRow, col: newCol };
      const neighborKey = key(neighbor);

      if (
        newRow < 0 ||
        newRow >= grid.length ||
        newCol < 0 ||
        newCol >= grid[0].length
      )
        continue;
      const cell = grid[newRow][newCol];
      if (cell.state === "wall" || visited.has(neighborKey)) continue;

      visited.add(neighborKey);
      parent.set(neighborKey, current);
      stack.push(neighbor);

      if (!(newRow === end.row && newCol === end.col)) {
        steps.push({
          mutations: [
            { kind: "setState", row: newRow, col: newCol, state: "frontier" },
          ],
          phase: "search",
        });
      }
    }
  }

  stats.executionTime = performance.now() - startTime;
  console.warn("DFS: No path found from start to end");
  return { steps, stats };
}

/**
 * Reconstruct path for DFS (same as original)
 */
function reconstructPath(
  parent: Map<string, Position | null>,
  start: Position,
  end: Position,
): AnimationStep[] {
  const pathSteps: AnimationStep[] = [];
  const path: Position[] = [];

  const key = (pos: Position) => `${pos.row}-${pos.col}`;
  let current: Position | null = end;

  while (current !== null) {
    path.unshift(current);
    const parentPos = parent.get(key(current));
    if (parentPos === undefined) break;
    current = parentPos;
  }

  for (const pos of path) {
    if (
      (pos.row === start.row && pos.col === start.col) ||
      (pos.row === end.row && pos.col === end.col)
    )
      continue;

    pathSteps.push({
      mutations: [
        { kind: "setState", row: pos.row, col: pos.col, state: "path" },
      ],
      phase: "path",
    });
  }

  return pathSteps;
}
