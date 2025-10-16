import type { StateCreator } from "zustand";
import type { Mode, Phase } from "../../types/pomodoro.types";
import type { DailyStats, SessionHistoryItem, StatsState } from "../types";

export interface StatsActions {
  addSession: (
    duration: number,
    mode: Mode,
    phase: Phase,
    taskName: string,
  ) => void;
  getStatsForDate: (date: string) => DailyStats | null;
  getWeeklyStats: () => {
    sessions: number;
    focusTime: number;
  };
  getTotalStats: () => {
    sessions: number;
    focusTime: number;
  };
  getTodayStats: () => DailyStats;
  clearOldHistory: (daysToKeep: number) => void;
}

export type StatsSlice = StatsState & StatsActions;

const initialState: StatsState = {
  sessionHistory: [],
  dailyStats: {},
};

/**
 * Generates a simple unique ID for sessions
 */
const generateSessionId = () =>
  `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Formats a date as YYYY-MM-DD
 */
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
};

export const createStatsSlice: StateCreator<StatsSlice, [], [], StatsSlice> = (
  set,
  get,
) => ({
  ...initialState,

  /**
   * Adds a completed session to history
   */
  addSession: (
    duration: number,
    mode: Mode,
    phase: Phase,
    taskName: string,
  ) => {
    const now = Date.now();
    const dateKey = formatDate(now);

    const session: SessionHistoryItem = {
      id: generateSessionId(),
      timestamp: now,
      duration,
      mode,
      phase,
      taskName,
      completedAt: now,
    };

    set((state) => {
      // Add to session history
      const newHistory = [...state.sessionHistory, session];

      // Update daily stats
      const currentDayStats = state.dailyStats[dateKey] || {
        date: dateKey,
        sessions: 0,
        focusTime: 0,
        tasksSessions: {},
      };

      const updatedDayStats: DailyStats = {
        ...currentDayStats,
        sessions: currentDayStats.sessions + 1,
        focusTime:
          currentDayStats.focusTime + (phase === "work" ? duration : 0),
      };

      return {
        sessionHistory: newHistory,
        dailyStats: {
          ...state.dailyStats,
          [dateKey]: updatedDayStats,
        },
      };
    });
  },

  /**
   * Gets statistics for a specific date
   */
  getStatsForDate: (date: string) => {
    return get().dailyStats[date] || null;
  },

  /**
   * Gets statistics for the past 7 days
   */
  getWeeklyStats: () => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const sessions = get().sessionHistory.filter(
      (session) => session.timestamp >= weekAgo && session.phase === "work",
    );

    return {
      sessions: sessions.length,
      focusTime: sessions.reduce((sum, s) => sum + s.duration, 0),
    };
  },

  /**
   * Gets total statistics across all time
   */
  getTotalStats: () => {
    const workSessions = get().sessionHistory.filter((s) => s.phase === "work");

    return {
      sessions: workSessions.length,
      focusTime: workSessions.reduce((sum, s) => sum + s.duration, 0),
    };
  },

  /**
   * Gets today's statistics
   */
  getTodayStats: () => {
    const dateKey = formatDate(Date.now());
    return (
      get().dailyStats[dateKey] || {
        date: dateKey,
        sessions: 0,
        focusTime: 0,
        tasksSessions: {},
      }
    );
  },

  /**
   * Clears old session history beyond specified days
   */
  clearOldHistory: (daysToKeep: number) => {
    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;

    set((state) => {
      const filteredHistory = state.sessionHistory.filter(
        (session) => session.timestamp >= cutoffTime,
      );

      // Rebuild daily stats from filtered history
      const newDailyStats: Record<string, DailyStats> = {};

      for (const session of filteredHistory) {
        const dateKey = formatDate(session.timestamp);
        if (!newDailyStats[dateKey]) {
          newDailyStats[dateKey] = {
            date: dateKey,
            sessions: 0,
            focusTime: 0,
            tasksSessions: {},
          };
        }
        newDailyStats[dateKey].sessions += 1;
        if (session.phase === "work") {
          newDailyStats[dateKey].focusTime += session.duration;
        }
      }

      return {
        sessionHistory: filteredHistory,
        dailyStats: newDailyStats,
      };
    });
  },
});
