import { memo, useCallback } from "react";
import type { Cell as CellType } from "@/types/Cell";
import { CellSide } from "@/lib/constants";

interface CellProps {
  cell: CellType;
  isMouseDownRef: React.RefObject<boolean>;
  onToggleWall: (row: number, col: number) => void;
  isIdle: boolean;
}

const CellCompBase = ({
  cell,
  isMouseDownRef,
  onToggleWall,
  isIdle,
}: CellProps) => {
  const { state, position } = cell;

  const handleMouseDown = useCallback(() => {
    if (!isIdle) return;
    if (state === "start" || state === "end") return;

    onToggleWall(position.row, position.col);
    isMouseDownRef.current = true;
  }, [isIdle, state, position.row, position.col, onToggleWall, isMouseDownRef]);

  const handleMouseEnter = useCallback(() => {
    if (!isMouseDownRef.current || !isIdle) return;
    if (state === "start" || state === "end") return;

    onToggleWall(position.row, position.col);
  }, [isMouseDownRef, isIdle, state, position.row, position.col, onToggleWall]);

  const handleMouseUp = useCallback(() => {
    isMouseDownRef.current = false;
  }, [isMouseDownRef]);

  let bgClass = "bg-background hover:bg-muted/50";
  let animClass = "";
  let content = "";

  if (state === "wall") {
    bgClass = "bg-node-wall";
    animClass = "animate-[var(--animate-wall)]";
    content = "🧱";
  } else if (state === "start") {
    bgClass = "bg-node-start";
    content = "🎯";
  } else if (state === "end") {
    bgClass = "bg-node-end";
    content = "🏁";
  } else if (state === "frontier") {
    bgClass = "bg-indigo-400 animate-[var(--animate-traversed)]";
  } else if (state === "visited") {
    bgClass = "bg-node-visited animate-[var(--animate-traversed)]";
  } else if (state === "path") {
    bgClass = "bg-node-path animate-[var(--animate-path)]";
    content = "✨";
  }

  return (
    <div
      style={{ width: CellSide, height: CellSide }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
      className={`border border-border/30 select-none cursor-pointer transition-all duration-200 flex items-center justify-center text-xs ${bgClass} ${animClass} ${isIdle ? 'hover:scale-105' : ''}`}
    >
      {content}
    </div>
  );
};

export const CellComp = memo(
  CellCompBase,
  (prev, next) =>
    prev.cell.state === next.cell.state && prev.isIdle === next.isIdle
);
