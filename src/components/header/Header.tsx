import { Info, Menu, Play, Square, RotateCcw, Eraser, Trash2 } from "lucide-react";
import { useCallback } from "react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { LeftPanel } from "../LeftPanel";
import { RightPanel } from "../RightPanel";
import { ThemeToggle } from "../theme-toggle";

import { useGridActions, useGridState } from "@/hooks/useGrid";
import { useAppActions, useAppState } from "@/hooks/useApp";
import { useAnimationRunner } from "@/hooks/useAnimationRunner";

import { executeGraphAlgorithm } from "@/lib/graphAlgorithms";

import type { Position } from "@/types/Cell";

const algorithmInfo = {
  bfs: { name: "Breadth-First Search", desc: "Guarantees shortest path (unweighted)" },
  dfs: { name: "Depth-First Search", desc: "Does not guarantee shortest path" },
  dijkstra: { name: "Dijkstra's Algorithm", desc: "Guarantees shortest path (weighted)" },
  astar: { name: "A* Algorithm", desc: "Optimal with heuristic" },
};

export const Header = () => {
  const { resetGrid, clearPath, clearWalls } = useGridActions();
  const { grid } = useGridState();
  const { graphAlgorithm, isAnimating, speed } = useAppState();
  const { setAnimationStats } = useAppActions();
  const { runGraphAnimation, cancelAnimation } = useAnimationRunner();

  const handleRunAlgorithm = useCallback(() => {
    if (isAnimating) return;

    let start: Position | null = null;
    let end: Position | null = null;

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (cell.state === "start") start = cell.position;
        else if (cell.state === "end") end = cell.position;
      }
    }

    if (!start || !end) {
      console.error("Start or end position not found");
      return;
    }

    const { steps, stats } = executeGraphAlgorithm(
      graphAlgorithm,
      grid,
      start,
      end,
    );

    if (steps.length === 0) {
      console.warn("No animation steps generated");
      return;
    }

    setAnimationStats(stats);
    runGraphAnimation(steps);
  }, [grid, graphAlgorithm, isAnimating, runGraphAnimation, setAnimationStats]);



  const currentAlgo = algorithmInfo[graphAlgorithm];

  return (
    <header className="border-b bg-card/95 backdrop-blur-sm shrink-0 sticky top-0 z-50">
      <div className="mx-auto max-w-400 px-4 py-3 flex items-center justify-between gap-2">
        {/* Left */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-lg font-semibold tracking-tight hover:underline flex items-center gap-2"
          >
            🔍 Pathfinding Visualizer
          </a>
          <div className="hidden sm:flex flex-col">
            <Badge variant="secondary" className="text-xs">
              {currentAlgo.name}
            </Badge>
            <span className="text-xs text-muted-foreground mt-1">
              {currentAlgo.desc}
            </span>
          </div>
        </div>

        {/* Center / Primary Actions */}
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={handleRunAlgorithm} 
            disabled={isAnimating}
            className="bg-green-600 hover:bg-green-700 text-white"
title="Run Algorithm"
          >
            {isAnimating ? (
              <>
                <Square className="h-4 w-4 mr-1" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Run
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={isAnimating ? cancelAnimation : resetGrid}
title={isAnimating ? "Stop" : "Reset"}
          >
            {isAnimating ? (
              <>
                <Square className="h-4 w-4 mr-1" />
                Stop
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </>
            )}
          </Button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Desktop-only extras */}
          <div className="hidden lg:flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={clearWalls}
              disabled={isAnimating}
              className="hover:bg-orange-50 hover:border-orange-200"
title="Clear Walls"
            >
              <Eraser className="h-4 w-4 mr-1" />
              Clear Walls
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={clearPath}
              disabled={isAnimating}
              className="hover:bg-blue-50 hover:border-blue-200"
title="Clear Path"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear Path
            </Button>
          </div>

          {/* Speed indicator */}
          <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
            <span>Speed:</span>
            <Badge variant="outline" className="capitalize">
              {speed}
            </Badge>
          </div>



          {/* Theme toggle */}
          <ThemeToggle />

          {/* Mobile drawers */}
          <div className="flex lg:hidden gap-2">
            {/* Controls Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-4 w-72 overflow-y-auto">
                <SheetHeader className="px-0 py-3">
                  <SheetTitle>Controls</SheetTitle>
                  <SheetDescription className="sr-only">
                    Select algorithms, mazes, and board options
                  </SheetDescription>
                </SheetHeader>
                <LeftPanel />
              </SheetContent>
            </Sheet>

            {/* Stats Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <Info className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-4 w-72 overflow-y-auto">
                <SheetHeader className="px-0 py-3">
                  <SheetTitle>Stats & Info</SheetTitle>
                  <SheetDescription className="sr-only">
                    View algorithm statistics and execution details
                  </SheetDescription>
                </SheetHeader>
                <RightPanel />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
