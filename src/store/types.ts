import type { Mode, Phase } from "../types/pomodoro.types";

/**
 * Represents a completed session in history
 */
export interface SessionHistoryItem {
  id: string;
  timestamp: number;
  duration: number; // in seconds
  mode: Mode;
  phase: Phase;
  taskName: string;
  completedAt: number;
}

/**
 * Represents a task that can be worked on
 */
export interface TaskItem {
  id: string;
  name: string;
  createdAt: number;
  completedSessions: number;
  totalFocusTime: number; // in seconds
  lastWorkedOn?: number;
}

/**
 * Daily statistics aggregation
 */
export interface DailyStats {
  date: string; // YYYY-MM-DD format
  sessions: number;
  focusTime: number; // in seconds
  tasksSessions: Record<string, number>; // task id -> session count
}

/**
 * Saved session state per mode (for resuming)
 */
export interface SavedModeSession {
  phase: Phase;
  timeLeft: number;
  completedSessions: number;
  currentTask: string;
  timestamp: number;
}

/**
 * Timer slice state
 */
export interface TimerState {
  mode: Mode;
  phase: Phase;
  timeLeft: number;
  isRunning: boolean;
  completedSessions: number;
  currentTask: string;
  taskInput: string;
  savedSessions: Record<Mode, SavedModeSession | null>;
}

/**
 * Settings slice state
 */
export interface SettingsState {
  customSettings: {
    work: number;
    break: number;
    longBreak: number;
  };
}

/**
 * Tasks slice state
 */
export interface TasksState {
  tasks: TaskItem[];
  activeTaskId: string | null;
}

/**
 * Stats slice state
 */
export interface StatsState {
  sessionHistory: SessionHistoryItem[];
  dailyStats: Record<string, DailyStats>;
}

/**
 * UI slice state
 */
export interface UIState {
  sidebarOpen: boolean;
  settingsOpen: boolean;
  focusMode: boolean;
  showCelebration: boolean;
}

/**
 * Full persisted state shape
 */
export interface PersistedState {
  version: number;
  timer: Omit<TimerState, "isRunning">;
  settings: SettingsState;
  tasks: TasksState;
  stats: StatsState;
  ui: Omit<UIState, "showCelebration">;
}
