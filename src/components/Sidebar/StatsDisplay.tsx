/**
 * Stats Display Component
 *
 * Shows today's statistics (sessions completed and focus time).
 */

import { Target, Zap } from "lucide-react";
import type { Stats } from "../../types/pomodoro.types";

interface StatsDisplayProps {
  stats: Stats;
}

export const StatsDisplay = ({ stats }: StatsDisplayProps) => {
  return (
    <div className="space-y-3 mb-8">
      <h3 className="text-white/60 text-sm font-semibold mb-3">
        TODAY'S STATS
      </h3>

      <div className="bg-white/10 rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-5 h-5 text-white/60" />
          <span className="text-white/60 text-sm">Sessions</span>
        </div>
        <p className="text-3xl font-bold text-white">{stats.todaysSessions}</p>
      </div>

      <div className="bg-white/10 rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-5 h-5 text-white/60" />
          <span className="text-white/60 text-sm">Focus Time</span>
        </div>
        <p className="text-3xl font-bold text-white">
          {Math.floor(stats.totalFocusTime / 60)}m
        </p>
      </div>
    </div>
  );
};
