/**
 * Timer Display Component
 *
 * Circular SVG timer with animated progress ring and time display.
 */

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
        {/* Progress circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="white"
          strokeWidth="12"
          strokeDasharray={`${2 * Math.PI * 90}`}
          strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
          transform="rotate(-90 100 100)"
          className="transition-all duration-1000"
          filter="url(#glow)"
          strokeLinecap="round"
        />
      </svg>
      {/* Time display overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div
            className={`text-7xl font-bold text-white mb-2 ${isRunning ? "animate-pulse" : ""}`}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="text-white/60 text-sm">Session {sessionNumber}</div>
        </div>
      </div>
    </div>
  );
};
