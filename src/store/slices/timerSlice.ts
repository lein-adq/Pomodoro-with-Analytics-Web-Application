import type { StateCreator } from "zustand";
import type { Mode, ModeConfigs } from "../../types/pomodoro.types";
import type { SavedModeSession, TimerState } from "../types";

export interface TimerActions {
  // Core timer actions
  toggleTimer: () => void;
  tick: () => void;
  resetTimer: () => void;

  // Mode management
  switchMode: (newMode: Mode, customWork?: number) => void;
  saveCurrentSession: () => void;
  resumeSavedSession: (mode: Mode) => boolean;

  // Phase management
  completePhase: (modeConfigs: ModeConfigs) => void;

  // Task management
  setTaskInput: (value: string) => void;
  setCurrentTask: (value: string) => void;

  // Helpers
  getProgress: (modeConfigs: ModeConfigs) => number;
  getModeConfig: (modeConfigs: ModeConfigs) => ModeConfigs[Mode];
}

export type TimerSlice = TimerState & TimerActions;

const initialState: TimerState = {
  mode: "pomodoro",
  phase: "work",
  timeLeft: 25 * 60,
  isRunning: false,
  completedSessions: 0,
  currentTask: "",
  taskInput: "",
  savedSessions: {
    pomodoro: null,
    animedoro: null,
    custom: null,
  },
};

export const createTimerSlice: StateCreator<TimerSlice, [], [], TimerSlice> = (
  set,
  get,
) => ({
  ...initialState,

  /**
   * Toggles timer between running and paused
   */
  toggleTimer: () => {
    const state = get();

    // If starting and in work phase without a task, set one
    if (!state.isRunning && state.phase === "work" && !state.currentTask) {
      set({
        isRunning: true,
        currentTask: state.taskInput || "Focus Session",
      });
    } else {
      set({ isRunning: !state.isRunning });
    }
  },

  /**
   * Decrements timer by one second
   */
  tick: () => {
    const state = get();
    if (state.timeLeft > 0) {
      set({ timeLeft: state.timeLeft - 1 });
    }
  },

  /**
   * Resets timer to initial work phase
   */
  resetTimer: () => {
    set({
      isRunning: false,
      phase: "work",
      completedSessions: 0,
      currentTask: "",
      taskInput: "",
    });
  },

  /**
   * Saves current session state for later resumption
   */
  saveCurrentSession: () => {
    const state = get();
    const saved: SavedModeSession = {
      phase: state.phase,
      timeLeft: state.timeLeft,
      completedSessions: state.completedSessions,
      currentTask: state.currentTask,
      timestamp: Date.now(),
    };

    set({
      savedSessions: {
        ...state.savedSessions,
        [state.mode]: saved,
      },
    });
  },

  /**
   * Attempts to resume a saved session for a mode
   */
  resumeSavedSession: (mode: Mode) => {
    const state = get();
    const saved = state.savedSessions[mode];

    if (saved) {
      set({
        mode,
        phase: saved.phase,
        timeLeft: saved.timeLeft,
        completedSessions: saved.completedSessions,
        currentTask: saved.currentTask,
        taskInput: saved.currentTask,
        isRunning: false,
      });
      return true;
    }
    return false;
  },

  /**
   * Switches to a different timer mode
   */
  switchMode: (newMode: Mode, customWork?: number) => {
    const state = get();

    // Save current session before switching
    if (state.timeLeft > 0 && state.phase === "work") {
      get().saveCurrentSession();
    }

    // Clear saved session for new mode
    const newSavedSessions = { ...state.savedSessions };
    newSavedSessions[newMode] = null;

    set({
      mode: newMode,
      isRunning: false,
      phase: "work",
      completedSessions: 0,
      currentTask: "",
      taskInput: "",
      timeLeft: customWork !== undefined ? customWork * 60 : 25 * 60,
      savedSessions: newSavedSessions,
    });
  },

  /**
   * Handles completion of a phase
   */
  completePhase: (modeConfigs: ModeConfigs) => {
    const state = get();
    const config = modeConfigs[state.mode];

    set({ isRunning: false });

    if (state.phase === "work") {
      const newSessions = state.completedSessions + 1;

      // Determine next phase
      if (newSessions % config.sessionsBeforeLong === 0) {
        set({
          phase: "longBreak",
          timeLeft: config.longBreak,
          completedSessions: newSessions,
        });
      } else {
        set({
          phase: "break",
          timeLeft: config.break,
          completedSessions: newSessions,
        });
      }
    } else {
      // Break completed, return to work
      set({
        phase: "work",
        timeLeft: config.work,
        currentTask: "",
      });
    }
  },

  /**
   * Sets task input value
   */
  setTaskInput: (value: string) => {
    set({ taskInput: value });
  },

  /**
   * Sets current active task
   */
  setCurrentTask: (value: string) => {
    set({ currentTask: value });
  },

  /**
   * Calculates progress percentage for current phase
   */
  getProgress: (modeConfigs: ModeConfigs) => {
    const state = get();
    const config = modeConfigs[state.mode];
    const total =
      state.phase === "work"
        ? config.work
        : state.phase === "break"
          ? config.break
          : config.longBreak;
    return ((total - state.timeLeft) / total) * 100;
  },

  /**
   * Gets the current mode configuration
   */
  getModeConfig: (modeConfigs: ModeConfigs) => {
    return modeConfigs[get().mode];
  },
});
