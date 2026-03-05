import type { Grid, Position } from "@/types/Cell";
import type { AlgorithmResult } from "@/types/algorithms";
import type { AnimationStep } from "@/types/animation";
import type { AnimationStats } from "@/types/context/AppContext";

/**
 * A* Search Algorithm with stats
 *
 * Guarantees shortest path (with admissible heuristic)
 */
export function executeAStar(
  grid: Grid,
  start: Position,
  end: Position,
): AlgorithmResult {
  const steps: AnimationStep[] = [];
  const visited = new Set<string>();
  const parent = new Map<string, Position | null>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const pq = new MinPriorityQueue<{ position: Position; fScore: number }>();

  const key = (pos: Position) => `${pos.row}-${pos.col}`;

  gScore.set(key(start), 0);
  fScore.set(key(start), heuristic(start, end));
  parent.set(key(start), null);
  pq.enqueue({ position: start, fScore: heuristic(start, end) });

  const stats: AnimationStats = {
    visitedNodes: 0,
    pathLength: 0,
    executionTime: 0,
  };
  const startTime = performance.now();

  while (!pq.isEmpty()) {
    const { position: current } = pq.dequeue()!;
    const currentKey = key(current);

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    stats.visitedNodes++;

    if (current.row === end.row && current.col === end.col) {
      const pathSteps = reconstructPath(parent, start, end);
      stats.pathLength = pathSteps.length;
      stats.executionTime = performance.now() - startTime;
      return { steps: [...steps, ...pathSteps], stats };
    }

    if (!(current.row === start.row && current.col === start.col)) {
      steps.push({
        mutations: [
          {
            kind: "setState",
            row: current.row,
            col: current.col,
            state: "visited",
          },
        ],
        phase: "search",
      });
    }

    const directions: [number, number][] = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];

    for (const [dr, dc] of directions) {
      const newRow = current.row + dr;
      const newCol = current.col + dc;
      const neighbor: Position = { row: newRow, col: newCol };
      const neighborKey = key(neighbor);

      if (
        newRow < 0 ||
        newRow >= grid.length ||
        newCol < 0 ||
        newCol >= grid[0].length
      )
        continue;
      const cell = grid[newRow][newCol];
      if (cell.state === "wall" || visited.has(neighborKey)) continue;

      const edgeWeight = cell.weight ?? 1;
      const tentativeGScore = (gScore.get(currentKey) ?? Infinity) + edgeWeight;
      const currentGScore = gScore.get(neighborKey) ?? Infinity;

      if (tentativeGScore < currentGScore) {
        parent.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);

        const h = heuristic(neighbor, end);
        const f = tentativeGScore + h;
        fScore.set(neighborKey, f);

        pq.enqueue({ position: neighbor, fScore: f });

        if (!(newRow === end.row && newCol === end.col)) {
          steps.push({
            mutations: [
              { kind: "setState", row: newRow, col: newCol, state: "frontier" },
            ],
            phase: "search",
          });
        }
      }
    }
  }

  stats.executionTime = performance.now() - startTime;
  console.warn("A*: No path found from start to end");
  return { steps, stats };
}

// Manhattan distance heuristic
function heuristic(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Path reconstruction (same as BFS/DFS)
function reconstructPath(
  parent: Map<string, Position | null>,
  start: Position,
  end: Position,
): AnimationStep[] {
  const pathSteps: AnimationStep[] = [];
  const path: Position[] = [];
  const key = (pos: Position) => `${pos.row}-${pos.col}`;
  let current: Position | null = end;

  while (current !== null) {
    path.unshift(current);
    const parentPos = parent.get(key(current));
    if (parentPos === undefined) break;
    current = parentPos;
  }

  for (const pos of path) {
    if (
      (pos.row === start.row && pos.col === start.col) ||
      (pos.row === end.row && pos.col === end.col)
    )
      continue;
    pathSteps.push({
      mutations: [
        { kind: "setState", row: pos.row, col: pos.col, state: "path" },
      ],
      phase: "path",
    });
  }
  return pathSteps;
}

// Min Priority Queue (unchanged)
class MinPriorityQueue<T extends { fScore: number }> {
  private heap: T[] = [];

  enqueue(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return min;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].fScore >= this.heap[parentIndex].fScore) break;
      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;
      if (
        leftChild < this.heap.length &&
        this.heap[leftChild].fScore < this.heap[smallest].fScore
      )
        smallest = leftChild;
      if (
        rightChild < this.heap.length &&
        this.heap[rightChild].fScore < this.heap[smallest].fScore
      )
        smallest = rightChild;
      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }
}
