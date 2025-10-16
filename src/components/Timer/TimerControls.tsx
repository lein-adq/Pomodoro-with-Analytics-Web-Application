/**
 * Timer Controls Component
 *
 * Play/Pause and Reset buttons for the timer.
 */

import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const TimerControls = ({
  isRunning,
  onToggle,
  onReset,
}: TimerControlsProps) => {
  return (
    <div className="flex gap-4 justify-center mb-6">
      <button
        onClick={onToggle}
        className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl"
        type="button"
      >
        {isRunning ? (
          <>
            <Pause className="w-5 h-5" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Start
          </>
        )}
      </button>
      <button
        onClick={onReset}
        className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/20"
        type="button"
      >
        <RotateCcw className="w-5 h-5" />
        Reset
      </button>
    </div>
  );
};
