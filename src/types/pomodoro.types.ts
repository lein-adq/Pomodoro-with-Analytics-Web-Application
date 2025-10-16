export type Mode = "pomodoro" | "animedoro" | "custom";

export type Phase = "work" | "break" | "longBreak";

export interface ModeConfig {
  work: number;
  break: number;
  longBreak: number;
  sessionsBeforeLong: number;
}

export interface ModeConfigs {
  pomodoro: ModeConfig;
  animedoro: ModeConfig;
  custom: ModeConfig;
}

export interface CustomSettings {
  work: number;
  break: number;
  longBreak: number;
}

export interface TimerState {
  mode: Mode;
  phase: Phase;
  timeLeft: number;
  isRunning: boolean;
  completedSessions: number;
  currentTask: string;
}

export interface Stats {
  todaysSessions: number;
  totalFocusTime: number;
}

export interface NextPhaseInfo {
  name: string;
  duration: string;
}

// Re-export store types for convenience
export type {
  DailyStats,
  SavedModeSession,
  SessionHistoryItem,
  TaskItem,
} from "../store/types";
