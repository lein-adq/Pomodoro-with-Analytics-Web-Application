import { useCallback, useEffect, useRef } from "react";
import type { ModeConfigs } from "../types/pomodoro.types";
import {
  useTimerActions,
  useTimerState,
  useTimerWorker,
  usePhaseCompletion,
} from "./";

/**
 * Custom hook to orchestrate timer worker and timer state
 *
 * Manages the coordination between:
 * - Timer state (from Zustand store)
 * - Web Worker (for accurate timing)
 * - Phase completion logic
 *
 * Handles:
 * - Starting/pausing worker when timer runs/pauses
 * - Stopping worker on timer reset
 * - Triggering phase completion
 *
 * @param modeConfigs - Configuration for all timer modes
 */
export const useTimerController = (modeConfigs: ModeConfigs) => {
  const timer = useTimerState();
  const timerActions = useTimerActions();
  const handlePhaseCompletionBase = usePhaseCompletion();

  // Track previous isRunning state to detect changes
  const prevIsRunningRef = useRef(timer.isRunning);

  /**
   * Wrap phase completion to include advancing to next phase
   */
  const handlePhaseComplete = useCallback(() => {
    handlePhaseCompletionBase(
      timer.phase,
      timer.mode,
      timer.currentTask,
      modeConfigs,
    );

    // Advance to next phase
    timerActions.completePhase(modeConfigs);
  }, [
    handlePhaseCompletionBase,
    timer.phase,
    timer.mode,
    timer.currentTask,
    modeConfigs,
    timerActions,
  ]);

  /**
   * Initialize timer worker
   */
  const worker = useTimerWorker({
    onTick: (timeLeft) => {
      timerActions.setTimeLeft(timeLeft);
    },
    onComplete: handlePhaseComplete,
  });

  /**
   * Control worker based on timer state changes
   */
  useEffect(() => {
    const wasRunning = prevIsRunningRef.current;
    const isNowRunning = timer.isRunning;

    // Only start/pause when the running state actually changes
    if (isNowRunning && !wasRunning) {
      // Just started - start worker with current time
      worker.start(timer.timeLeft);
    } else if (!isNowRunning && wasRunning) {
      // Just paused/stopped - pause worker
      worker.pause();
    }

    // Update ref for next render
    prevIsRunningRef.current = isNowRunning;
  }, [timer.isRunning, timer.timeLeft, worker]);

  /**
   * Stop worker when timer is reset
   */
  useEffect(() => {
    if (
      !timer.isRunning &&
      timer.completedSessions === 0 &&
      timer.phase === "work"
    ) {
      worker.stop();
    }
  }, [timer.completedSessions, timer.phase, timer.isRunning, worker]);

  return worker;
};
