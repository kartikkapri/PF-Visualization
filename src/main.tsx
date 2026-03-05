import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GridProvider } from "@/providers/GridProvider.tsx";
import { AppProvider } from "@/providers/AppProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <GridProvider>
        <App />
      </GridProvider>
    </AppProvider>
  </StrictMode>
);
