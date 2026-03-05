import type { Grid } from "@/types/Cell";
import type { AnimationStep } from "@/types/animation";
import type { MazeAlgorithm } from "@/types/algorithms";
import { executeRecursiveDivision } from "./mazeGenAlgos.ts/recursiveDivision";
import { executeRandomizedPrims } from "./mazeGenAlgos.ts/randomizedPrims";
import { executeBinaryTree } from "./mazeGenAlgos.ts/binaryTree";

/**
 * Execute a maze generation algorithm and return animation steps
 *
 * @param algorithm - The maze algorithm to execute
 * @param grid - The current grid state
 * @returns Array of animation steps for visualization
 */
export function executeMazeAlgorithm(
  algorithm: MazeAlgorithm,
  grid: Grid
): AnimationStep[] {
  switch (algorithm) {
    case "recursive-division":
      return executeRecursiveDivision(grid);
    case "randomized-prims":
      return executeRandomizedPrims(grid);
    case "binary-tree":
      return executeBinaryTree(grid);
    default:
      console.error(`Unknown maze algorithm: ${algorithm}`);
      return [];
  }
}
