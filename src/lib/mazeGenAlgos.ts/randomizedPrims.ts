import type { Grid, Position } from "@/types/Cell";
import type { AnimationStep, CellMutation } from "@/types/animation";

export function executeRandomizedPrims(grid: Grid): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const rows = grid.length;
  if (rows < 3) return steps;
  const cols = grid[0].length;
  if (cols < 3) return steps;

  const initMutations: CellMutation[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell.state !== "start" && cell.state !== "end") {
        initMutations.push({
          kind: "setState",
          row: r,
          col: c,
          state: "wall",
        });
      }
    }
  }

  if (initMutations.length > 0) {
    steps.push({ mutations: initMutations, phase: "maze" });
  }

  const isValidPosition = (r: number, c: number) => {
    return r > 0 && r < rows - 1 && c > 0 && c < cols - 1;
  };

  const getDistance2Neighbors = (r: number, c: number): Position[] => {
    const moves = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ];
    const neighbors: Position[] = [];

    for (const [dr, dc] of moves) {
      const nr = r + dr;
      const nc = c + dc;
      if (isValidPosition(nr, nc)) {
        neighbors.push({ row: nr, col: nc });
      }
    }
    return neighbors;
  };

  const visited = new Set<string>();
  const frontier: Position[] = [];

  const startRow = 1;
  const startCol = 1;

  visited.add(`${startRow},${startCol}`);

  const seedMutations: CellMutation[] = [];
  if (
    grid[startRow][startCol].state !== "start" &&
    grid[startRow][startCol].state !== "end"
  ) {
    seedMutations.push({
      kind: "setState",
      row: startRow,
      col: startCol,
      state: "empty",
    });
  }

  const seedNeighbors = getDistance2Neighbors(startRow, startCol);
  for (const n of seedNeighbors) {
    frontier.push(n);
    if (
      grid[n.row][n.col].state !== "start" &&
      grid[n.row][n.col].state !== "end"
    ) {
      seedMutations.push({
        kind: "setState",
        row: n.row,
        col: n.col,
        state: "frontier",
      });
    }
  }

  steps.push({ mutations: seedMutations, phase: "maze" });

  while (frontier.length > 0) {
    const randIdx = Math.floor(Math.random() * frontier.length);
    const current = frontier[randIdx];
    frontier[randIdx] = frontier[frontier.length - 1];
    frontier.pop();

    if (visited.has(`${current.row},${current.col}`)) continue;

    const neighbors = getDistance2Neighbors(current.row, current.col);
    const validConnections = neighbors.filter((n) =>
      visited.has(`${n.row},${n.col}`),
    );

    if (validConnections.length > 0) {
      const connection =
        validConnections[Math.floor(Math.random() * validConnections.length)];

      const wallRow = current.row + (connection.row - current.row) / 2;
      const wallCol = current.col + (connection.col - current.col) / 2;

      const stepMutations: CellMutation[] = [];

      if (
        grid[wallRow][wallCol].state !== "start" &&
        grid[wallRow][wallCol].state !== "end"
      ) {
        stepMutations.push({
          kind: "setState",
          row: wallRow,
          col: wallCol,
          state: "empty",
        });
      }

      if (
        grid[current.row][current.col].state !== "start" &&
        grid[current.row][current.col].state !== "end"
      ) {
        stepMutations.push({
          kind: "setState",
          row: current.row,
          col: current.col,
          state: "empty",
        });
      }

      visited.add(`${current.row},${current.col}`);

      const potentialNewFrontier = getDistance2Neighbors(
        current.row,
        current.col,
      );

      for (const n of potentialNewFrontier) {
        if (!visited.has(`${n.row},${n.col}`)) {
          frontier.push(n);

          if (
            grid[n.row][n.col].state !== "start" &&
            grid[n.row][n.col].state !== "end" &&
            grid[n.row][n.col].state !== "frontier"
          ) {
            stepMutations.push({
              kind: "setState",
              row: n.row,
              col: n.col,
              state: "frontier",
            });
          }
        }
      }

      if (stepMutations.length > 0) {
        steps.push({ mutations: stepMutations, phase: "maze" });
      }
    }
  }

  return steps;
}
