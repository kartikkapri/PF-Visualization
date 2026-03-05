import { AppContext } from "@/contexts/AppContext";
import type { AppContextType } from "@/types/context/AppContext";
import { useContext } from "react";

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}

// State only
export function useAppState() {
  return useAppContext().state;
}

// Actions only
export function useAppActions() {
  return useAppContext().actions;
}
