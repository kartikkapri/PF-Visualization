import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { Grid } from "@/types/Cell";
import type { AnimationStep } from "@/types/animation";
import { GridContext } from "@/contexts/GridContext";

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const [grid, setGrid] = useState<Grid>([]);

  /**
   * Reset the entire grid to its initial state
   * - All cells become empty except start and end
   * - Preserves the positions of start and end nodes
   */
  const resetGrid = useCallback(() => {
    setGrid((prevGrid) => {
      if (prevGrid.length === 0) return prevGrid;

      return prevGrid.map((row) =>
        row.map((cell) => {
          if (cell.state === "start" || cell.state === "end") {
            return cell;
          }
          return {
            ...cell,
            state: "empty" as const,
            weight: 1,
          };
        })
      );
    });
  }, []);

  /**
   * Clear only wall cells from the grid
   * - Walls become empty
   * - Preserves start, end, and any algorithm visualization states
   */
  const clearWalls = useCallback(() => {
    setGrid((prevGrid) => {
      if (prevGrid.length === 0) return prevGrid;

      return prevGrid.map((row) =>
        row.map((cell) => {
          if (cell.state === "wall") {
            return {
              ...cell,
              state: "empty" as const,
            };
          }
          return cell;
        })
      );
    });
  }, []);

  /**
   * Clear algorithm visualization states from the grid
   * - Removes visited, frontier, and path states
   * - Preserves walls, start, and end nodes
   */
  const clearPath = useCallback(() => {
    setGrid((prevGrid) => {
      if (prevGrid.length === 0) return prevGrid;

      return prevGrid.map((row) =>
        row.map((cell) => {
          // Clear only algorithm visualization states
          if (
            cell.state === "visited" ||
            cell.state === "frontier" ||
            cell.state === "path"
          ) {
            return {
              ...cell,
              state: "empty" as const,
            };
          }
          return cell;
        })
      );
    });
  }, []);

  /**
   * Apply an animation step to the grid
   * - Processes all mutations in the step
   * - Updates cell states based on the mutations
   * @param step - The animation step containing mutations to apply
   */
  const applyStep = useCallback((step: AnimationStep) => {
    setGrid((prevGrid) => {
      if (prevGrid.length === 0) return prevGrid;

      // Create a shallow copy of the grid
      const newGrid = prevGrid.map((row) => [...row]);

      // Apply each mutation in the step
      step.mutations.forEach((mutation) => {
        const { row, col, state } = mutation;

        // Validate indices
        if (
          row < 0 ||
          row >= newGrid.length ||
          col < 0 ||
          col >= newGrid[0].length
        ) {
          console.warn(
            `Invalid mutation: row=${row}, col=${col} out of bounds`
          );
          return;
        }

        const cell = newGrid[row][col];

        // Not overwriting start or end nodes unless the mutation explicitly sets them
        if (
          (cell.state === "start" || cell.state === "end") &&
          state !== "start" &&
          state !== "end"
        ) {
          return;
        }

        // Apply the state change
        newGrid[row][col] = {
          ...cell,
          state,
        };
      });

      return newGrid;
    });
  }, []);

  const value = useMemo(
    () => ({
      state: { grid },
      actions: {
        setGrid,
        resetGrid,
        clearWalls,
        clearPath,
        applyStep,
      },
    }),
    [grid, resetGrid, clearWalls, clearPath, applyStep]
  );

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
};
