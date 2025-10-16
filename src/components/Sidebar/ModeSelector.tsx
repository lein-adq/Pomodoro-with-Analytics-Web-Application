/**
 * Mode Selector Component
 *
 * Buttons to switch between Pomodoro, Animedoro, and Custom modes with Motion animations.
 */

import { motion } from "motion/react";
import { Flame, Tv, Settings } from "lucide-react";
import type { Mode } from "../../types/pomodoro.types";

interface ModeSelectorProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const modeOptions = [
  { id: "pomodoro" as Mode, label: "Pomodoro", icon: Flame },
  { id: "animedoro" as Mode, label: "Animedoro", icon: Tv },
  { id: "custom" as Mode, label: "Custom", icon: Settings },
];

export const ModeSelector = ({
  currentMode,
  onModeChange,
}: ModeSelectorProps) => {
  return (
    <motion.div
      className="space-y-2 mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-white/60 text-sm font-semibold mb-3">MODE</h3>
      {modeOptions.map(({ id, label, icon: Icon }, index) => {
        const isActive = currentMode === id;

        return (
          <motion.button
            key={id}
            onClick={() => onModeChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
              isActive
                ? "bg-white/20 text-white shadow-lg"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
            type="button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{
              scale: 1.02,
              x: 5,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
