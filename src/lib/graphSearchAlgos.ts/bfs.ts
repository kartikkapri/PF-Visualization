import type { AlgorithmResult } from "@/types/algorithms";
import type { AnimationStep } from "@/types/animation";
import type { Grid, Position } from "@/types/Cell";
import type { AnimationStats } from "@/types/context/AppContext";

/**
 * Reconstruct the shortest path from start to end using parent tracking
 */
function reconstructPath(
  parent: Map<string, Position | null>,
  start: Position,
  end: Position,
): AnimationStep[] {
  const pathSteps: AnimationStep[] = [];
  const path: Position[] = [];

  const key = (pos: Position) => `${pos.row}-${pos.col}`;

  // Trace back from end to start
  let current: Position | null = end;

  while (current !== null) {
    path.unshift(current);
    const parentPos = parent.get(key(current));
    if (parentPos === undefined) break;
    current = parentPos;
  }

  // Create animation steps for the path (skip start and end)
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

export function executeBFS(
  grid: Grid,
  start: Position,
  end: Position,
): AlgorithmResult {
  const steps: AnimationStep[] = [];
  const visited = new Set<string>();
  const parent = new Map<string, Position | null>();
  const queue: Position[] = [start];

  const key = (pos: Position) => `${pos.row}-${pos.col}`;

  visited.add(key(start));
  parent.set(key(start), null);

  const stats: AnimationStats = {
    visitedNodes: 0,
    pathLength: 0,
    executionTime: 0,
  };

  const startTime = performance.now();

  while (queue.length > 0) {
    const current = queue.shift()!;
    stats.visitedNodes++;

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

    for (const [dr, dc] of directions) {
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
      queue.push(neighbor);

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
  console.warn("BFS: No path found");
  return { steps, stats };
}
