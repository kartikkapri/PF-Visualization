import { GridContext } from "@/contexts/GridContext";
import type { GridContextType } from "@/types/context/GridContext";
import { useContext } from "react";

export function useGridContext(): GridContextType {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error("useGridContext must be used within GridProvider");
  }

  return context;
}

// Hook to get only state
export function useGridState() {
  return useGridContext().state;
}

// Hook to get only actions
export function useGridActions() {
  return useGridContext().actions;
}
