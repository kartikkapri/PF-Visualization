import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAppActions, useAppState } from "@/hooks/useApp";
import { useGridState, useGridActions } from "@/hooks/useGrid";
import { useAnimationRunner } from "@/hooks/useAnimationRunner";
import { executeMazeAlgorithm } from "@/lib/mazeAlgorithms";
import type { GraphAlgorithm, MazeAlgorithm } from "@/types/algorithms";
import type { Speed } from "@/types/app";

export const LeftPanel = () => {
  const { graphAlgorithm, speed, mode } = useAppState();
  const { setGraphAlgorithm, setSpeed, setAnimationStats } = useAppActions();
  const { grid } = useGridState();
  const { resetGrid } = useGridActions();
  const { runMazeAnimation, isAnimating } = useAnimationRunner();

  const isDisabled = mode !== "idle";

  const handleMazeClick = (algorithm: MazeAlgorithm) => {
    if (isAnimating) return;
    resetGrid();

    setTimeout(() => {
      const steps = executeMazeAlgorithm(algorithm, grid);

      if (steps.length === 0) {
        console.warn("No maze animation steps generated");
        return;
      }

      runMazeAnimation(steps);
    }, 5);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Graph Algorithm Select */}
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-medium">Graph Algorithms</h3>
        <Select
          value={graphAlgorithm}
          onValueChange={(value) => {
            setAnimationStats({
              visitedNodes: 0,
              pathLength: 0,
              executionTime: 0,
            });
            setGraphAlgorithm(value as GraphAlgorithm);
          }}
          disabled={isDisabled}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Select graph algorithm" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectItem value="bfs">BFS</SelectItem>
            <SelectItem value="dfs">DFS</SelectItem>
            <SelectItem value="dijkstra">Dijkstra</SelectItem>
            <SelectItem value="astar">A*</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Maze Algorithm Buttons */}
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-medium">Maze Algorithms</h3>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMazeClick("recursive-division")}
            disabled={isDisabled}
            className="w-full justify-start"
          >
            Recursive Division
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMazeClick("randomized-prims")}
            disabled={isDisabled}
            className="w-full justify-start"
          >
            Randomized Prim's
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMazeClick("binary-tree")}
            disabled={isDisabled}
            className="w-full justify-start"
          >
            Binary Tree
          </Button>
        </div>
      </div>

      <Separator />

      {/* Speed Select */}
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-medium">Speed</h3>
        <Select
          value={speed}
          onValueChange={(value) => setSpeed(value as Speed)}
          disabled={isDisabled}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Select speed" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectItem value="slow">Slow</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="fast">Fast</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Legend */}
      <div className="flex flex-col w-full space-y-2 text-sm">
        <h3 className="font-medium">Legend</h3>

        <div className="flex items-center justify-between w-full">
          <span>Start Node</span>
          <div className="w-5 h-5 bg-node-start border border-border" />
        </div>

        <div className="flex items-center justify-between w-full">
          <span>End Node</span>
          <div className="w-5 h-5 bg-node-end border border-border" />
        </div>

        <div className="flex items-center justify-between w-full">
          <span>Wall Node</span>
          <div className="w-5 h-5 bg-node-wall border border-border" />
        </div>

        <div className="flex items-center justify-between w-full">
          <span>Visited Node</span>
          <div className="w-5 h-5 bg-node-visited border border-border" />
        </div>

        <div className="flex items-center justify-between w-full">
          <span>Path Node</span>
          <div className="w-5 h-5 bg-node-path border border-border" />
        </div>
      </div>
    </div>
  );
};
