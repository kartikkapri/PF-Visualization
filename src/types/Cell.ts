export type CellState =
  | "empty"
  | "wall"
  | "start"
  | "end"
  | "frontier"
  | "visited"
  | "path";

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  position: Position;
  state: CellState;
  weight?: number; // later.
}

export type Grid = Cell[][];
