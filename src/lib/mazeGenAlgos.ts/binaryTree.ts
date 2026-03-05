import type { Grid } from "@/types/Cell";
import type { AnimationStep, CellMutation } from "@/types/animation";

export function executeBinaryTree(grid: Grid): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const rows = grid.length;
  if (rows === 0) return steps;
  const cols = grid[0].length;

  const isPersistent = (r: number, c: number) => {
    const state = grid[r][c].state;
    return state === "start" || state === "end";
  };

  for (let r = 0; r < rows; r++) {
    const rowMutations: CellMutation[] = [];

    for (let c = 0; c < cols; c++) {
      if (isPersistent(r, c)) continue;

      rowMutations.push({ kind: "setState", row: r, col: c, state: "wall" });
    }
    if (r % 2 !== 0) {
      for (let c = 1; c < cols; c += 2) {
        if (!isPersistent(r, c)) {
          const mut = rowMutations.find((m) => m.row === r && m.col === c);
          if (mut) mut.state = "empty";
        }

        const hasEastNeighbor = c + 2 < cols;
        const hasSouthNeighbor = r + 2 < rows;

        let direction: "east" | "south" | null = null;

        if (hasEastNeighbor && hasSouthNeighbor) {
          direction = Math.random() < 0.5 ? "east" : "south";
        } else if (hasEastNeighbor) {
          direction = "east";
        } else if (hasSouthNeighbor) {
          direction = "south";
        }

        // Apply Carving
        if (direction === "east") {
          if (!isPersistent(r, c + 1)) {
            const mut = rowMutations.find(
              (m) => m.row === r && m.col === c + 1,
            );
            if (mut) mut.state = "empty";
          }
        } else if (direction === "south") {
          // South carving affects the NEXT row.
          // We don't mutate rowMutations here because (r+1) isn't in this frame.
          // We will handle South carving when we actually process the next row
          // to keep the "Printer" style consistent.
        }
      }
    }

    if (r > 0 && r % 2 === 0) {
      for (let c = 1; c < cols; c += 2) {
        const prevR = r - 1;
        const hasEast = c + 2 < cols;
        const hasSouth = prevR + 2 < rows;

        const chance = ((prevR * 31 + c) * 17) % 100;

        let choseSouth = false;
        if (hasEast && hasSouth) choseSouth = chance >= 50;
        else if (!hasEast && hasSouth) choseSouth = true;

        if (choseSouth && !isPersistent(r, c)) {
          const mut = rowMutations.find((m) => m.row === r && m.col === c);
          if (mut) mut.state = "empty";
        }
      }
    }

    if (rowMutations.length > 0) {
      steps.push({ mutations: rowMutations, phase: "maze" });
    }
  }

  return steps;
}
