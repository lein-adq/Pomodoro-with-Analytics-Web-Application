import { useCallback } from "react";
import type { ModeConfigs, Phase, Mode } from "../types/pomodoro.types";
import { useAudio, useStatsActions, useUIActions } from "./";

/**
 * Custom hook to handle phase completion logic
 *
 * Orchestrates all actions that should happen when a timer phase completes:
 * 1. Plays notification sound
 * 2. Records session in stats history
 * 3. Shows celebration modal (for work sessions)
 * 4. Prepares for next phase
 *
 * @returns A memoized callback to execute phase completion
 */
export const usePhaseCompletion = () => {
  const { playNotification } = useAudio();
  const statsActions = useStatsActions();
  const uiActions = useUIActions();

  return useCallback(
    (
      phase: Phase,
      mode: Mode,
      currentTask: string,
      modeConfigs: ModeConfigs,
    ) => {
      // Play notification sound
      playNotification();

      // Calculate duration of completed phase
      const config = modeConfigs[mode];
      const duration =
        phase === "work"
          ? config.work
          : phase === "break"
            ? config.break
            : config.longBreak;

      // Record session in history
      statsActions.addSession(duration, mode, phase, currentTask);

      // Show celebration for work completion
      if (phase === "work") {
        uiActions.triggerCelebration();
        setTimeout(() => uiActions.hideCelebration(), 3000);
      }
    },
    [playNotification, statsActions, uiActions],
  );
};
