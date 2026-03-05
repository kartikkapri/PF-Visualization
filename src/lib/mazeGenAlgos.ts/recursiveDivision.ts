import type { Grid } from "@/types/Cell";
import type { AnimationStep, CellMutation } from "@/types/animation";

export function executeRecursiveDivision(grid: Grid): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const rows = grid.length;
  if (rows < 3) return steps;
  const cols = grid[0].length;
  if (cols < 3) return steps;

  const borderMutations: CellMutation[] = [];

  for (let c = 0; c < cols; c++) {
    [0, rows - 1].forEach((r) => {
      if (grid[r][c].state !== "start" && grid[r][c].state !== "end") {
        borderMutations.push({
          kind: "setState",
          row: r,
          col: c,
          state: "wall",
        });
      }
    });
  }

  for (let r = 0; r < rows; r++) {
    [0, cols - 1].forEach((c) => {
      if (
        grid[r][c].state !== "start" &&
        grid[r][c].state !== "end" &&
        r > 0 &&
        r < rows - 1
      ) {
        borderMutations.push({
          kind: "setState",
          row: r,
          col: c,
          state: "wall",
        });
      }
    });
  }

  if (borderMutations.length > 0) {
    steps.push({ mutations: borderMutations, phase: "maze" });
  }

  const divide = (r1: number, r2: number, c1: number, c2: number) => {
    const height = r2 - r1 + 1;
    const width = c2 - c1 + 1;

    if (height < 2 || width < 2) return;

    let orientation: "horizontal" | "vertical";
    if (width > height) orientation = "vertical";
    else if (height > width) orientation = "horizontal";
    else orientation = Math.random() < 0.5 ? "horizontal" : "vertical";

    const mutations: CellMutation[] = [];

    if (orientation === "horizontal") {
      const wallRow = getRandomEven(r1, r2);
      if (wallRow === -1) return;
      const holeCol = getRandomOdd(c1, c2);

      for (let c = c1 - 1; c <= c2 + 1; c++) {
        if (c === holeCol) continue;
        if (c < 0 || c >= cols) continue;
        if (
          grid[wallRow][c].state !== "start" &&
          grid[wallRow][c].state !== "end"
        ) {
          mutations.push({
            kind: "setState",
            row: wallRow,
            col: c,
            state: "wall",
          });
        }
      }

      if (mutations.length > 0) steps.push({ mutations, phase: "maze" });

      divide(r1, wallRow - 1, c1, c2);
      divide(wallRow + 1, r2, c1, c2);
    } else {
      const wallCol = getRandomEven(c1, c2);
      if (wallCol === -1) return;
      const holeRow = getRandomOdd(r1, r2);

      for (let r = r1 - 1; r <= r2 + 1; r++) {
        if (r === holeRow) continue;
        if (r < 0 || r >= rows) continue;
        if (
          grid[r][wallCol].state !== "start" &&
          grid[r][wallCol].state !== "end"
        ) {
          mutations.push({
            kind: "setState",
            row: r,
            col: wallCol,
            state: "wall",
          });
        }
      }

      if (mutations.length > 0) steps.push({ mutations, phase: "maze" });

      divide(r1, r2, c1, wallCol - 1);
      divide(r1, r2, wallCol + 1, c2);
    }
  };

  divide(1, rows - 2, 1, cols - 2);

  return steps;
}

function getRandomEven(min: number, max: number): number {
  if (min % 2 !== 0) min++;
  if (max % 2 !== 0) max--;
  if (min > max) return -1;

  const range = (max - min) / 2;
  return min + Math.floor(Math.random() * (range + 1)) * 2;
}

function getRandomOdd(min: number, max: number): number {
  if (min % 2 === 0) min++;
  if (max % 2 === 0) max--;
  if (min > max) return -1;

  const range = (max - min) / 2;
  return min + Math.floor(Math.random() * (range + 1)) * 2;
}
