import { useCallback, useRef } from "react";
import { useAppActions, useAppState } from "./useApp";
import { useGridActions } from "./useGrid";
import type { AnimationStep } from "@/types/animation";
import { SPEED_DELAY_MS } from "@/types/app";

/**
 * useAnimationRunner
 * Handles all animations (graph & maze) with batching and cancellation
 */
export function useAnimationRunner() {
  const { speed, isAnimating } = useAppState();
  const { setMode, setIsAnimating } = useAppActions();
  const { applyStep, clearPath } = useGridActions();

  // Cancellation ref
  const isCancelledRef = useRef(false);

  // Simple settings - one step at a time
  const GRAPH_BATCH_SIZE = 1;

  /**
   * Simple step-by-step runner
   */
  const runStepByStep = useCallback(
    async (steps: AnimationStep[], delay: number) => {
      isCancelledRef.current = false;

      for (let i = 0; i < steps.length && !isCancelledRef.current; i++) {
        applyStep(steps[i]);
        if (i < steps.length - 1) {
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    },
    [applyStep],
  );

  /**
   * Run a graph algorithm animation
   */
  const runGraphAnimation = useCallback(
    async (steps: AnimationStep[]) => {
      if (isAnimating) {
        console.warn("Animation already running");
        return;
      }

      setIsAnimating(true);
      setMode("running-algorithm");
      clearPath();

      const delay = SPEED_DELAY_MS[speed];

      try {
        await runStepByStep(steps, delay);
      } catch (e) {
        console.error("Graph animation error:", e);
      } finally {
        setIsAnimating(false);
        setMode("idle");
      }
    },
    [
      isAnimating,
      speed,
      setIsAnimating,
      setMode,
      clearPath,
      runStepByStep,
    ],
  );

  /**
   * Run a maze generation animation
   */
  const runMazeAnimation = useCallback(
    async (steps: AnimationStep[]) => {
      if (isAnimating) {
        console.warn("Animation already running");
        return;
      }

      setIsAnimating(true);
      setMode("generating-maze");

      try {
        await runStepByStep(steps, 100);
      } catch (e) {
        console.error("Maze animation error:", e);
      } finally {
        setIsAnimating(false);
        setMode("idle");
      }
    },
    [isAnimating, setIsAnimating, setMode, runStepByStep],
  );

  /**
   * Cancel the current animation immediately
   */
  const cancelAnimation = useCallback(() => {
    isCancelledRef.current = true;
    setIsAnimating(false);
    setMode("idle");
  }, [setIsAnimating, setMode]);

  return {
    runGraphAnimation,
    runMazeAnimation,
    cancelAnimation,
    isAnimating,
  };
}
