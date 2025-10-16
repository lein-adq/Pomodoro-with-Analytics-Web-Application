import { useCallback, useState } from "react";
import type { Mode, ModeConfigs } from "../types/pomodoro.types";
import { useTimerActions, useTimerState } from "./";

/**
 * Dialog state for mode switching confirmation
 */
interface ConfirmDialogState {
  isOpen: boolean;
  mode: Mode | null;
}

/**
 * Custom hook to handle mode switching with confirmation dialog
 *
 * Provides:
 * - Confirmation dialog state
 * - Logic to check if switching would lose progress
 * - Handlers for confirming/canceling mode switch
 *
 * Shows confirmation dialog when:
 * - Timer has time left
 * - AND (has completed sessions OR has a current task)
 * - AND switching to a different mode
 */
export const useModeSwitch = (modeConfigs: ModeConfigs) => {
  const timer = useTimerState();
  const timerActions = useTimerActions();

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    mode: null,
  });

  /**
   * Initiate mode switch (with confirmation if needed)
   */
  const handleModeSwitch = useCallback(
    (newMode: Mode) => {
      // Check if there's progress that would be lost
      const hasProgress =
        timer.timeLeft > 0 &&
        (timer.completedSessions > 0 || timer.currentTask !== "");

      // If there's progress and not already on this mode, show confirmation
      if (hasProgress && timer.mode !== newMode) {
        setConfirmDialog({ isOpen: true, mode: newMode });
      } else {
        // No progress or same mode, switch directly
        timerActions.switchMode(newMode, modeConfigs);
      }
    },
    [
      timer.timeLeft,
      timer.completedSessions,
      timer.currentTask,
      timer.mode,
      timerActions,
      modeConfigs,
    ],
  );

  /**
   * Confirm and execute mode switch
   */
  const confirmModeSwitch = useCallback(() => {
    if (confirmDialog.mode) {
      timerActions.switchMode(confirmDialog.mode, modeConfigs);
      setConfirmDialog({ isOpen: false, mode: null });
    }
  }, [confirmDialog.mode, timerActions, modeConfigs]);

  /**
   * Cancel mode switch
   */
  const cancelModeSwitch = useCallback(() => {
    setConfirmDialog({ isOpen: false, mode: null });
  }, []);

  return {
    confirmDialog,
    handleModeSwitch,
    confirmModeSwitch,
    cancelModeSwitch,
  };
};
