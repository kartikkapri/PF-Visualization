import type { Grid } from "../Cell";
import type { AnimationStep } from "../animation";

export interface GridContextState {
  grid: Grid;
}

export interface GridContextActions {
  setGrid: (grid: Grid | ((prev: Grid) => Grid)) => void;

  resetGrid: () => void;

  clearWalls: () => void;

  clearPath: () => void;

  applyStep: (step: AnimationStep) => void;
}

export type GridContextType = {
  state: GridContextState;
  actions: GridContextActions;
};
