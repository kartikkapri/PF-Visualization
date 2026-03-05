import type { AppContextType } from "@/types/context/AppContext";
import { createContext } from "react";

export const AppContext = createContext<AppContextType | undefined>(undefined);
