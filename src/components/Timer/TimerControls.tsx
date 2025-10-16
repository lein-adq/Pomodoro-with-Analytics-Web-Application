import { Pause, Play, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

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
      <motion.button
        onClick={onToggle}
        className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl"
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
      </motion.button>
      <motion.button
        onClick={onReset}
        className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 border border-white/20 hover:bg-white/30"
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <RotateCcw className="w-5 h-5" />
        Reset
      </motion.button>
    </div>
  );
};
