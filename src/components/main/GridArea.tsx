import {
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { CellSide } from "@/lib/constants";
import type { Cell, Grid } from "@/types/Cell";
import { useGridActions, useGridState } from "@/hooks/useGrid";
import { useAppState } from "@/hooks/useApp";
import { CellComp } from "@/components/main/CellComp";

export const GridArea = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  const [size, setSize] = useState({ width: 0, height: 0 });

  const { grid } = useGridState();
  const { setGrid } = useGridActions();
  const { mode, isAnimating } = useAppState();

  const isMouseDownRef = useRef(false);
  const pendingUpdatesRef = useRef<Map<string, boolean>>(new Map());
  const updateTimeoutRef = useRef<number | null>(null);

  // Batch wall toggle updates
  const flushUpdates = useCallback(() => {
    if (pendingUpdatesRef.current.size === 0) return;

    const updates = new Map(pendingUpdatesRef.current);
    pendingUpdatesRef.current.clear();

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);

      updates.forEach((shouldBeWall, key) => {
        const [row, col] = key.split("-").map(Number);
        const cell = newGrid[row][col];

        if (cell.state === "start" || cell.state === "end") return;

        newGrid[row][col] = {
          ...cell,
          state: shouldBeWall ? "wall" : "empty",
        };
      });

      return newGrid;
    });
  }, [setGrid]);

  const handleToggleWall = useCallback(
    (row: number, col: number) => {
      // Don't allow wall toggling during animation
      if (isAnimating) return;

      const key = `${row}-${col}`;
      const currentCell = grid[row]?.[col];

      if (
        !currentCell ||
        currentCell.state === "start" ||
        currentCell.state === "end"
      ) {
        return;
      }

      // Toggle the state
      const shouldBeWall = currentCell.state !== "wall";
      pendingUpdatesRef.current.set(key, shouldBeWall);

      // Debounce updates for smoother dragging
      if (updateTimeoutRef.current !== null) {
        cancelAnimationFrame(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = requestAnimationFrame(() => {
        flushUpdates();
        updateTimeoutRef.current = null;
      });
    },
    [grid, flushUpdates, isAnimating],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current !== null) {
        cancelAnimationFrame(updateTimeoutRef.current);
        flushUpdates();
      }
    };
  }, [flushUpdates]);

  // Measure container
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) => {
        const w = Math.floor(width);
        const h = Math.floor(height);
        return prev.width === w && prev.height === h
          ? prev
          : { width: w, height: h };
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { rows, cols } = useMemo(() => {
    // Compute raw rows and cols
    const rawRows = Math.floor(size.height / CellSide);
    const rawCols = Math.floor(size.width / CellSide);

    // Make them odd
    const rows = rawRows % 2 === 0 ? rawRows - 1 : rawRows;
    const cols = rawCols % 2 === 0 ? rawCols - 1 : rawCols;

    return { rows, cols };
  }, [size]);

  const computedGrid: Grid = useMemo(() => {
    if (rows === 0 || cols === 0) return [];

    const startPos = { row: 2, col: 2 };
    const endPos = { row: rows - 3, col: cols - 3 };

    const grid: Grid = [];

    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];

      for (let c = 0; c < cols; c++) {
        let state: Cell["state"] = "empty";

        if (r === startPos.row && c === startPos.col) state = "start";
        else if (r === endPos.row && c === endPos.col) state = "end";

        row.push({
          position: { row: r, col: c },
          state,
          weight: 1,
        });
      }

      grid.push(row);
    }

    return grid;
  }, [rows, cols]);

  useEffect(() => {
    if (initializedRef.current) return;
    if (computedGrid.length === 0) return;

    setGrid(computedGrid);
    initializedRef.current = true;
  }, [computedGrid, setGrid]);

  const isIdle = mode === "idle";

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-background"
      onMouseUp={() => (isMouseDownRef.current = false)}
      onMouseLeave={() => {
        isMouseDownRef.current = false;
        // Flush any pending updates when mouse leaves
        if (updateTimeoutRef.current !== null) {
          cancelAnimationFrame(updateTimeoutRef.current);
          flushUpdates();
          updateTimeoutRef.current = null;
        }
      }}
    >
      {grid.map((row) => (
        <div key={row[0].position.row} className="flex">
          {row.map((cell) => (
            <CellComp
              key={`${cell.position.row}-${cell.position.col}`}
              cell={cell}
              isMouseDownRef={isMouseDownRef}
              onToggleWall={handleToggleWall}
              isIdle={isIdle}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
