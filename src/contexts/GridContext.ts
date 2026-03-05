import type { GridContextType } from "@/types/context/GridContext";
import { createContext } from "react";

export const GridContext = createContext<GridContextType | undefined>(
  undefined
);
