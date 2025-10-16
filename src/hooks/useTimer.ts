/**
 * Timer Hook
 *
 * Core timer logic and state management for the Pomodoro application.
 */

import { useState, useEffect, useRef } from "react";
import type { Mode, Phase, ModeConfigs, Stats } from "../types/pomodoro.types";

interface UseTimerProps {
  modeConfigs: ModeConfigs;
  onPhaseComplete: () => void;
}

export const useTimer = ({ modeConfigs, onPhaseComplete }: UseTimerProps) => {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [taskInput, setTaskInput] = useState("");

  const [stats, setStats] = useState<Stats>({
    todaysSessions: 0,
    totalFocusTime: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Main timer effect - handles countdown and phase completion
   */
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handlePhaseComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  /**
   * Handles completion of a phase (work or break)
   */
  const handlePhaseComplete = () => {
    setIsRunning(false);
    onPhaseComplete();

    if (phase === "work") {
      const newSessions = completedSessions + 1;
      setCompletedSessions(newSessions);
      setStats((prev) => ({
        todaysSessions: prev.todaysSessions + 1,
        totalFocusTime: prev.totalFocusTime + modeConfigs[mode].work,
      }));

      const config = modeConfigs[mode];
      if (newSessions % config.sessionsBeforeLong === 0) {
        setPhase("longBreak");
        setTimeLeft(config.longBreak);
      } else {
        setPhase("break");
        setTimeLeft(config.break);
      }
    } else {
      setPhase("work");
      setTimeLeft(modeConfigs[mode].work);
      setCurrentTask("");
    }
  };

  /**
   * Toggles the timer between running and paused
   */
  const toggleTimer = () => {
    if (!isRunning && phase === "work" && !currentTask) {
      setCurrentTask(taskInput || "Focus Session");
    }
    setIsRunning(!isRunning);
  };

  /**
   * Resets the timer to initial state
   */
  const resetTimer = () => {
    setIsRunning(false);
    setPhase("work");
    setCompletedSessions(0);
    setTimeLeft(modeConfigs[mode].work);
    setCurrentTask("");
    setTaskInput("");
  };

  /**
   * Switches to a different timer mode
   */
  const switchMode = (newMode: Mode, customWork?: number) => {
    setMode(newMode);
    setIsRunning(false);
    setPhase("work");
    setCompletedSessions(0);
    setCurrentTask("");
    setTaskInput("");

    if (newMode === "custom" && customWork !== undefined) {
      setTimeLeft(customWork * 60);
    } else {
      setTimeLeft(modeConfigs[newMode].work);
    }
  };

  /**
   * Calculates progress percentage for current phase
   */
  const getProgress = () => {
    const total =
      phase === "work"
        ? modeConfigs[mode].work
        : phase === "break"
          ? modeConfigs[mode].break
          : modeConfigs[mode].longBreak;
    return ((total - timeLeft) / total) * 100;
  };

  return {
    // State
    mode,
    phase,
    timeLeft,
    isRunning,
    completedSessions,
    currentTask,
    taskInput,
    stats,

    // Actions
    toggleTimer,
    resetTimer,
    switchMode,
    setTaskInput,

    // Computed
    getProgress,
    modeConfig: modeConfigs[mode],
  };
};
