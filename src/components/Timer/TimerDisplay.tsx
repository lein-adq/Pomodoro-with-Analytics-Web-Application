/**
 * Timer Display Component
 *
 * Circular SVG timer with animated progress ring and time display.
 * Uses Motion for smooth animations.
 */

import { motion } from "motion/react";
import { formatTime } from "../../utils/formatTime";

interface TimerDisplayProps {
  timeLeft: number;
  progress: number;
  isRunning: boolean;
  sessionNumber: number;
}

export const TimerDisplay = ({
  timeLeft,
  progress,
  isRunning,
  sessionNumber,
}: TimerDisplayProps) => {
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="relative mb-8">
      <svg className="w-full h-64" viewBox="0 0 200 200">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="12"
        />
        {/* Progress circle - animated with Motion */}
        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="white"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress / 100)}
          transform="rotate(-90 100 100)"
          filter="url(#glow)"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
        />
      </svg>
      {/* Time display overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="text-7xl font-bold text-white mb-2"
            animate={
              isRunning
                ? {
                    opacity: [1, 0.7, 1],
                  }
                : {
                    opacity: 1,
                  }
            }
            transition={
              isRunning
                ? {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }
                : {}
            }
          >
            {formatTime(timeLeft)}
          </motion.div>
          <motion.div
            className="text-white/60 text-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Session {sessionNumber}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
