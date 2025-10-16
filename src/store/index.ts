/**
 * Main Zustand Store
 *
 * Combines all slices with persistence middleware
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  createSettingsSlice,
  type SettingsSlice,
} from "./slices/settingsSlice";
import { createStatsSlice, type StatsSlice } from "./slices/statsSlice";
import { createTasksSlice, type TasksSlice } from "./slices/tasksSlice";
import { createTimerSlice, type TimerSlice } from "./slices/timerSlice";
import { createUISlice, type UISlice } from "./slices/uiSlice";

/**
 * Combined store type
 */
export type PomodoroStore = TimerSlice &
  SettingsSlice &
  TasksSlice &
  StatsSlice &
  UISlice;

/**
 * Main Pomodoro store with persistence
 */
export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (...args) => ({
      ...createTimerSlice(...args),
      ...createSettingsSlice(...args),
      ...createTasksSlice(...args),
      ...createStatsSlice(...args),
      ...createUISlice(...args),
    }),
    {
      name: "pomodoro-app-state",
      storage: createJSONStorage(() => localStorage),
      version: 1,

      /**
       * Partialize: exclude volatile state from persistence
       */
      partialize: (state) => ({
        // Timer - exclude isRunning (volatile)
        mode: state.mode,
        phase: state.phase,
        timeLeft: state.timeLeft,
        completedSessions: state.completedSessions,
        currentTask: state.currentTask,
        taskInput: state.taskInput,
        savedSessions: state.savedSessions,

        // Settings - persist all
        customSettings: state.customSettings,

        // Tasks - persist all
        tasks: state.tasks,
        activeTaskId: state.activeTaskId,

        // Stats - persist all
        sessionHistory: state.sessionHistory,
        dailyStats: state.dailyStats,

        // UI - exclude showCelebration (volatile)
        sidebarOpen: state.sidebarOpen,
        settingsOpen: state.settingsOpen,
        focusMode: state.focusMode,
      }),

      /**
       * Merge function to handle state hydration
       */
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<PomodoroStore>;

        return {
          ...currentState,
          ...persisted,
          // Always start with timer not running
          isRunning: false,
          // Always start with celebration hidden
          showCelebration: false,
        };
      },
    },
  ),
);

// Export store type for external use
export type { PomodoroStore as Store };
