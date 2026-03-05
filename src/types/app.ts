export type AppMode = "idle" | "generating-maze" | "running-algorithm";

export type Speed = "slow" | "medium" | "fast";

export const SPEED_DELAY_MS: Record<Speed, number> = {
  slow: 100,
  medium: 50,
  fast: 20,
};
