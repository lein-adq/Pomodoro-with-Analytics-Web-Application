import { motion } from "motion/react";
import type { Phase } from "../../types/pomodoro.types";
import { formatTime } from "../../utils/formatTime";

interface TimerDisplayProps {
  timeLeft: number;
  progress: number;
  isRunning: boolean;
  sessionNumber: number;
  phase: Phase;
}

export const TimerDisplay = ({
  timeLeft,
  progress,
  isRunning,
  sessionNumber,
  phase,
}: TimerDisplayProps) => {
  // Determine the label based on phase
  const getPhaseLabel = () => {
    if (phase === "work") {
      return `Session ${sessionNumber}`;
    }
    if (phase === "longBreak") {
      return "Long Break";
    }
    // Regular break - show which break number (based on completed sessions)
    return `Break ${sessionNumber - 1}`;
  };
  return (
    <div className="w-full px-8 mb-8">
      {/* Progress Bar with Glow */}
      <div className="relative mb-8">
        <svg width="0" height="0">
          <defs>
            <filter id="progressGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        <div className="h-1.5 bg-white/10 rounded-full overflow-visible backdrop-blur-xl">
          <motion.div
            className="h-full bg-gradient-to-r from-white/40 to-white rounded-full shadow-lg"
            style={{
              filter: "url(#progressGlow)",
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.6)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Time display */}
      <div className="text-center">
        <motion.div
          className="text-8xl font-bold text-white mb-2"
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
          key={`${phase}-${sessionNumber}`}
        >
          {getPhaseLabel()}
        </motion.div>
      </div>
    </div>
  );
};
