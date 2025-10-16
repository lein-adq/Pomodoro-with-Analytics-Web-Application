/**
 * Session History Component (Example)
 *
 * This is an example component showing how to display session history
 * and analytics from the stats store.
 */

import { Award, Calendar, Clock } from "lucide-react";
import { useStats, useStatsActions } from "../../hooks";
import type { SessionHistoryItem } from "../../store/types";

/**
 * Formats seconds to minutes
 */
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

/**
 * Formats timestamp to readable time
 */
const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Groups sessions by date
 */
const groupSessionsByDate = (sessions: SessionHistoryItem[]) => {
  const groups: Record<string, SessionHistoryItem[]> = {};

  for (const session of sessions) {
    const date = new Date(session.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
  }

  return groups;
};

export const SessionHistoryExample = () => {
  const { sessionHistory } = useStats();
  const { getTodayStats, getWeeklyStats, getTotalStats } = useStatsActions();

  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const totalStats = getTotalStats();

  // Get recent sessions (last 20)
  const recentSessions = [...sessionHistory].reverse().slice(0, 20);

  const groupedSessions = groupSessionsByDate(recentSessions);

  return (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Session History
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Today */}
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Today</span>
          </div>
          <p className="text-2xl font-bold text-white">{todayStats.sessions}</p>
          <p className="text-xs text-white/50">
            {formatDuration(todayStats.focusTime)}
          </p>
        </div>

        {/* This Week */}
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">This Week</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {weeklyStats.sessions}
          </p>
          <p className="text-xs text-white/50">
            {formatDuration(weeklyStats.focusTime)}
          </p>
        </div>

        {/* All Time */}
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Award className="w-4 h-4" />
            <span className="text-sm">All Time</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalStats.sessions}</p>
          <p className="text-xs text-white/50">
            {formatDuration(totalStats.focusTime)}
          </p>
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {recentSessions.length === 0 ? (
          <p className="text-white/50 text-center py-8">
            No sessions yet. Complete your first pomodoro!
          </p>
        ) : (
          Object.entries(groupedSessions).map(([date, sessions]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-white/70 mb-2 sticky top-0 bg-transparent">
                {date}
              </h3>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white/5 rounded-lg p-3 border border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              session.phase === "work"
                                ? "bg-red-500/20 text-red-300"
                                : session.phase === "break"
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-blue-500/20 text-blue-300"
                            }`}
                          >
                            {session.phase === "work"
                              ? "Work"
                              : session.phase === "break"
                                ? "Break"
                                : "Long Break"}
                          </span>
                          <span className="text-xs text-white/50">
                            {session.mode}
                          </span>
                        </div>

                        <p className="text-white font-medium mt-1">
                          {session.taskName || "Untitled Session"}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                          <span>{formatTime(session.timestamp)}</span>
                          <span>•</span>
                          <span>{formatDuration(session.duration)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {sessionHistory.length > 20 && (
        <p className="text-xs text-white/50 text-center mt-4">
          Showing 20 most recent sessions of {sessionHistory.length} total
        </p>
      )}
    </div>
  );
};
