import type { Grid, Position } from "@/types/Cell";
import type { AlgorithmResult, GraphAlgorithm } from "@/types/algorithms";
import { executeBFS } from "./graphSearchAlgos.ts/bfs";
import { executeDFS } from "./graphSearchAlgos.ts/dfs";
import { executeDijkstra } from "./graphSearchAlgos.ts/dijkstra";
import { executeAStar } from "./graphSearchAlgos.ts/astar";

/**
 * Execute a graph algorithm and return animation steps
 *
 * @param algorithm - The algorithm to execute (bfs, dfs, dijkstra, astar)
 * @param grid - The current grid state
 * @param start - Start position
 * @param end - End position
 * @returns Array of animation steps for visualization
 */
export function executeGraphAlgorithm(
  algorithm: GraphAlgorithm,
  grid: Grid,
  start: Position,
  end: Position,
): AlgorithmResult {
  switch (algorithm) {
    case "bfs":
      return executeBFS(grid, start, end);
    case "dfs":
      return executeDFS(grid, start, end);
    case "dijkstra":
      return executeDijkstra(grid, start, end);
    case "astar":
      return executeAStar(grid, start, end);
    default:
      console.error(`Unknown algorithm: ${algorithm}`);
      return {
        steps: [],
        stats: { visitedNodes: 0, pathLength: 0, executionTime: 0 },
      };
  }
}
