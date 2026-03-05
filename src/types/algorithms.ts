import type { AnimationStep } from "./animation";
import type { AnimationStats } from "./context/AppContext";

export type GraphAlgorithm = "bfs" | "dfs" | "dijkstra" | "astar";

export type MazeAlgorithm =
  | "recursive-division"
  | "randomized-prims"
  | "binary-tree";

export interface AlgorithmResult {
  steps: AnimationStep[];
  stats: AnimationStats;
}
