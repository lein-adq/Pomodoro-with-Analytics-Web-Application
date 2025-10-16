/**
 * Stats Display Component
 *
 * Shows today's statistics (sessions completed and focus time) with Motion animations.
 */

import { motion } from "motion/react";
import { Target, Zap } from "lucide-react";
import type { Stats } from "../../types/pomodoro.types";

interface StatsDisplayProps {
  stats: Stats;
}

export const StatsDisplay = ({ stats }: StatsDisplayProps) => {
  return (
    <motion.div
      className="space-y-3 mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="text-white/60 text-sm font-semibold mb-3">
        TODAY'S STATS
      </h3>

      <motion.div
        className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-5 h-5 text-white/60" />
          <span className="text-white/60 text-sm">Sessions</span>
        </div>
        <motion.p
          className="text-3xl font-bold text-white"
          key={stats.todaysSessions}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {stats.todaysSessions}
        </motion.p>
      </motion.div>

      <motion.div
        className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-5 h-5 text-white/60" />
          <span className="text-white/60 text-sm">Focus Time</span>
        </div>
        <p className="text-3xl font-bold text-white">
          {Math.floor(stats.totalFocusTime / 60)}m
        </p>
      </motion.div>
    </motion.div>
  );
};
