import type { CellState } from "./Cell";

export type CellMutation = {
  kind: "setState";
  row: number;
  col: number;
  state: CellState;
};

export interface AnimationStep {
  mutations: CellMutation[];
  phase: "maze" | "search" | "path";
}
