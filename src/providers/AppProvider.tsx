import { useMemo, useState, type ReactNode } from "react";

import { AppContext } from "@/contexts/AppContext";
import type {
  AnimationStats,
  AppContextActions,
  AppContextState,
  AppContextType,
} from "@/types/context/AppContext";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // default state
  const [state, setState] = useState<AppContextState>({
    graphAlgorithm: "bfs",
    mazeAlgorithm: null,
    speed: "medium",
    mode: "idle",
    isAnimating: false,
    animationStats: { visitedNodes: 0, pathLength: 0, executionTime: 0 },
  });

  // actions to update state
  const actions: AppContextActions = useMemo(
    () => ({
      setGraphAlgorithm: (graphAlgo) => {
        setState((prev) => ({ ...prev, graphAlgorithm: graphAlgo }));
      },
      setMazeAlgorithm: (mazeAlgo) => {
        setState((prev) => ({ ...prev, mazeAlgorithm: mazeAlgo }));
      },
      setSpeed: (speed) => {
        setState((prev) => ({ ...prev, speed }));
      },
      setMode: (mode) => {
        setState((prev) => ({ ...prev, mode }));
      },
      setIsAnimating: (isAnimating) => {
        setState((prev) => ({ ...prev, isAnimating }));
      },
      setAnimationStats: (stats: AnimationStats) =>
        setState((prev) => ({ ...prev, animationStats: stats })),
    }),
    [],
  );

  const value: AppContextType = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
