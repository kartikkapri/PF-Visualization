function runAnimation(
  steps: AnimationStep[],
  gridContext: GridContextType,
  appContext: AppContextType
) {
  if (steps.length === 0) return;

  appContext.actions.setMode("running-algorithm"); // start animation
  let currentStep = 0;

  const speedMs = SPEED_DELAY_MS[appContext.state.speed]; // use your speed

  const timer = setInterval(() => {
    if (currentStep >= steps.length) {
      clearInterval(timer);
      appContext.actions.setMode("idle"); // animation finished
      return;
    }

    gridContext.actions.applyStep(steps[currentStep]);
    currentStep++;
  }, speedMs);
}


let currentAnimationTimer: ReturnType<typeof setInterval> | null = null;

function startNewAnimation(steps: AnimationStep[], gridContext, appContext) {
  if (currentAnimationTimer) {
    clearInterval(currentAnimationTimer); // cancel previous
  }
  currentAnimationTimer = runAnimation(steps, gridContext, appContext);
}

<!-- ----------------------------------------------- -->

// animationRunner.ts
import type { GridContextType } from "./GridContext";
import type { AppContextType } from "./AppContext";
import type { AnimationStep } from "../animation";
import { SPEED_DELAY_MS } from "../app";

export function runAnimation(
  steps: AnimationStep[],
  gridContext: GridContextType,
  appContext: AppContextType
) {
  if (steps.length === 0) return;

  appContext.actions.setMode("running-algorithm");
  let currentStep = 0;

  const speedMs = SPEED_DELAY_MS[appContext.state.speed];

  const timer = setInterval(() => {
    if (currentStep >= steps.length) {
      clearInterval(timer);
      appContext.actions.setMode("idle");
      return;
    }

    gridContext.actions.applyStep(steps[currentStep]);
    currentStep++;
  }, speedMs);

  return timer; // so caller can cancel if needed
}

<!-- custom hook -->

function useAnimationRunner(gridContext, appContext) {
  const timerRef = useRef<number | null>(null);

  const start = (steps: AnimationStep[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = runAnimation(steps, gridContext, appContext);
  };

  const cancel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    appContext.actions.setMode("idle");
  };

  return { start, cancel };
}

<!-- how to call -->

const steps = bfs(gridSnapshot, start, end); // or other algorithm
runAnimation(steps, gridContext, appContext);
