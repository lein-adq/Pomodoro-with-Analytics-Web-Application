import { useMemo } from "react";
import {
  DEFAULT_ANIMEDORO_CONFIG,
  DEFAULT_POMODORO_CONFIG,
} from "../constants/pomodoro.constants";
import type { ModeConfigs } from "../types/pomodoro.types";
import { useSettings } from "./";

/**
 * Custom hook to compute and memoize mode configurations
 *
 * Returns configurations for all timer modes:
 * - Pomodoro (default 25/5/15)
 * - Animedoro (default 40/20/20)
 * - Custom (user-defined settings)
 *
 * The custom config is recomputed only when custom settings change.
 */
export const useModeConfigs = (): ModeConfigs => {
  const { customSettings } = useSettings();

  return useMemo(
    () => ({
      pomodoro: DEFAULT_POMODORO_CONFIG,
      animedoro: DEFAULT_ANIMEDORO_CONFIG,
      custom: {
        work: customSettings.work * 60,
        break: customSettings.break * 60,
        longBreak: customSettings.longBreak * 60,
        sessionsBeforeLong: 4,
      },
    }),
    [customSettings.work, customSettings.break, customSettings.longBreak],
  );
};
