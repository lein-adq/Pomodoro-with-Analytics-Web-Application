import { useEffect } from "react";
import type { Phase } from "../types/pomodoro.types";

/**
 * Custom hook to update document title based on timer state
 *
 * Updates the browser tab title to show:
 * - Timer countdown when running
 * - Current phase (Focus/Break/Long Break)
 * - Default title when stopped
 */
export const useDocumentTitle = (
  timeLeft: number,
  isRunning: boolean,
  phase: Phase,
) => {
  useEffect(() => {
    if (isRunning) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

      const phaseLabel =
        phase === "work"
          ? "Focus"
          : phase === "longBreak"
            ? "Long Break"
            : "Break";

      document.title = `${timeStr} - ${phaseLabel}`;
    } else {
      document.title = "Focus Time - Pomodoro Timer";
    }
  }, [timeLeft, isRunning, phase]);
};
