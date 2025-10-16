/**
 * Store Hooks
 *
 * Typed selector hooks for optimal re-renders
 */

import { useShallow } from "zustand/react/shallow";
import { usePomodoroStore } from "./index";
import type { TimerSlice } from "./slices/timerSlice";

/**
 * Timer state selector (reactive)
 */
export const useTimerState = () =>
  usePomodoroStore(
    useShallow((state) => ({
      mode: state.mode,
      phase: state.phase,
      timeLeft: state.timeLeft,
      isRunning: state.isRunning,
      completedSessions: state.completedSessions,
      currentTask: state.currentTask,
      taskInput: state.taskInput,
      savedSessions: state.savedSessions,
    })),
  );

/**
 * Timer actions selector (non-reactive)
 */
export const useTimerActions = () =>
  usePomodoroStore(
    useShallow((state) => ({
      toggleTimer: state.toggleTimer,
      tick: state.tick,
      resetTimer: state.resetTimer,
      switchMode: state.switchMode,
      saveCurrentSession: state.saveCurrentSession,
      resumeSavedSession: state.resumeSavedSession,
      completePhase: state.completePhase,
      setTaskInput: state.setTaskInput,
      setCurrentTask: state.setCurrentTask,
      getProgress: state.getProgress,
      getModeConfig: state.getModeConfig,
    })),
  );

/**
 * Settings state selector
 */
export const useSettings = () =>
  usePomodoroStore(
    useShallow((state) => ({
      customSettings: state.customSettings,
    })),
  );

/**
 * Settings actions selector
 */
export const useSettingsActions = () =>
  usePomodoroStore(
    useShallow((state) => ({
      updateCustomWork: state.updateCustomWork,
      updateCustomBreak: state.updateCustomBreak,
      updateCustomLongBreak: state.updateCustomLongBreak,
      resetSettings: state.resetSettings,
    })),
  );

/**
 * Tasks state selector
 */
export const useTasks = () =>
  usePomodoroStore(
    useShallow((state) => ({
      tasks: state.tasks,
      activeTaskId: state.activeTaskId,
    })),
  );

/**
 * Tasks actions selector
 */
export const useTasksActions = () =>
  usePomodoroStore(
    useShallow((state) => ({
      addTask: state.addTask,
      selectTask: state.selectTask,
      deleteTask: state.deleteTask,
      updateTaskStats: state.updateTaskStats,
      getTaskById: state.getTaskById,
      getTaskStats: state.getTaskStats,
    })),
  );

/**
 * Stats state selector
 */
export const useStats = () =>
  usePomodoroStore(
    useShallow((state) => ({
      sessionHistory: state.sessionHistory,
      dailyStats: state.dailyStats,
    })),
  );

/**
 * Stats actions selector
 */
export const useStatsActions = () =>
  usePomodoroStore(
    useShallow((state) => ({
      addSession: state.addSession,
      getStatsForDate: state.getStatsForDate,
      getWeeklyStats: state.getWeeklyStats,
      getTotalStats: state.getTotalStats,
      getTodayStats: state.getTodayStats,
      clearOldHistory: state.clearOldHistory,
    })),
  );

/**
 * UI state selector
 */
export const useUI = () =>
  usePomodoroStore(
    useShallow((state) => ({
      sidebarOpen: state.sidebarOpen,
      settingsOpen: state.settingsOpen,
      focusMode: state.focusMode,
      showCelebration: state.showCelebration,
    })),
  );

/**
 * UI actions selector
 */
export const useUIActions = () =>
  usePomodoroStore(
    useShallow((state) => ({
      toggleSidebar: state.toggleSidebar,
      setSidebarOpen: state.setSidebarOpen,
      toggleSettings: state.toggleSettings,
      setSettingsOpen: state.setSettingsOpen,
      toggleFocusMode: state.toggleFocusMode,
      setFocusMode: state.setFocusMode,
      triggerCelebration: state.triggerCelebration,
      hideCelebration: state.hideCelebration,
    })),
  );

/**
 * Combined timer hook (for convenience, may cause more re-renders)
 */
export const useTimer = (): TimerSlice => {
  return usePomodoroStore(
    useShallow((state) => ({
      mode: state.mode,
      phase: state.phase,
      timeLeft: state.timeLeft,
      isRunning: state.isRunning,
      completedSessions: state.completedSessions,
      currentTask: state.currentTask,
      taskInput: state.taskInput,
      savedSessions: state.savedSessions,
      toggleTimer: state.toggleTimer,
      tick: state.tick,
      resetTimer: state.resetTimer,
      switchMode: state.switchMode,
      saveCurrentSession: state.saveCurrentSession,
      resumeSavedSession: state.resumeSavedSession,
      completePhase: state.completePhase,
      setTaskInput: state.setTaskInput,
      setCurrentTask: state.setCurrentTask,
      getProgress: state.getProgress,
      getModeConfig: state.getModeConfig,
    })),
  );
};
