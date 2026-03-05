import { LeftPanel } from "../LeftPanel";
import { RightPanel } from "../RightPanel";
import { GridArea } from "./GridArea";

export const Main = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ---------- LEFT SIDEBAR (Desktop) ---------- */}
      <aside className="hidden lg:flex w-72 border-r bg-sidebar overflow-y-auto px-4 py-4">
        <LeftPanel />
      </aside>

      {/* ---------- CENTER (GRID + FOOTER) ---------- */}
      <main className="flex flex-col flex-1 bg-muted/30">
        {/* Grid */}
        <div className="flex-1 overflow-hidden p-4">
          <GridArea />
        </div>

        {/* Footer */}

        <footer className="shrink-0 border-t bg-card px-4 py-3 text-sm text-muted-foreground">
          <div className="mx-auto flex items-center justify-center">
            <span>
              Made by{" "}
              <span className="font-medium text-foreground">Kartik</span>
            </span>
          </div>
        </footer>
      </main>

      {/* ---------- RIGHT SIDEBAR (Desktop) ---------- */}
      <aside className="hidden xl:flex w-72 border-l bg-card overflow-y-auto px-4 py-4">
        <RightPanel />
      </aside>
    </div>
  );
};
