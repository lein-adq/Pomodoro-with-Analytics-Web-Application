/**
 * Phase Utility Functions
 *
 * Helper functions for phase-related logic.
 */

import type {
  Phase,
  Mode,
  ModeConfigs,
  NextPhaseInfo,
} from "../types/pomodoro.types";
import { formatTime } from "./formatTime";

/**
 * Gets the background gradient color for a phase
 */
export const getPhaseColor = (phase: Phase): string => {
  if (phase === "work") return "from-rose-500 via-red-500 to-orange-500";
  if (phase === "break") return "from-emerald-500 via-green-500 to-teal-500";
  return "from-blue-500 via-indigo-500 to-purple-500";
};

/**
 * Gets information about the next phase
 */
export const getNextPhase = (
  phase: Phase,
  completedSessions: number,
  mode: Mode,
  modeConfigs: ModeConfigs,
): NextPhaseInfo => {
  if (phase === "work") {
    if ((completedSessions + 1) % modeConfigs[mode].sessionsBeforeLong === 0) {
      return {
        name: "Long Break",
        duration: formatTime(modeConfigs[mode].longBreak),
      };
    }
    return {
      name: "Short Break",
      duration: formatTime(modeConfigs[mode].break),
    };
  }
  return {
    name: "Work Session",
    duration: formatTime(modeConfigs[mode].work),
  };
};
