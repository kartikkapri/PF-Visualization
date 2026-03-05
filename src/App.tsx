import { Header } from "@/components/header/Header";
import { Main } from "@/components/main/Main";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pf-viz-theme">
      <div className="h-svh font-bricolage overflow-hidden bg-background text-foreground flex flex-col">
        <Header />
        <Main />
      </div>
    </ThemeProvider>
  );
}

export default App;
