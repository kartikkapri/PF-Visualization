import type { GraphAlgorithm, MazeAlgorithm } from "../algorithms";
import type { AppMode, Speed } from "../app";

export interface AnimationStats {
  visitedNodes: number;
  pathLength: number;
  executionTime: number;
}

export interface AppContextState {
  graphAlgorithm: GraphAlgorithm;
  mazeAlgorithm: MazeAlgorithm | null;

  speed: Speed;
  mode: AppMode;
  isAnimating: boolean;

  animationStats: AnimationStats;
}

export interface AppContextActions {
  setGraphAlgorithm: (graphAlgo: GraphAlgorithm) => void;
  setMazeAlgorithm: (mazeAlgo: MazeAlgorithm) => void;

  setSpeed: (speed: Speed) => void;
  setMode: (mode: AppMode) => void;
  setIsAnimating: (isAnimating: boolean) => void;

  setAnimationStats: (stats: AnimationStats) => void;
}

export type AppContextType = {
  state: AppContextState;
  actions: AppContextActions;
};
