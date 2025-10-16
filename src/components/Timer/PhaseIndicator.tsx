/**
 * Phase Indicator Component
 *
 * Displays the current phase (Focus Time, Short Break, or Long Break) with an icon.
 * Uses Motion for smooth phase transitions.
 */

import { motion, AnimatePresence } from "motion/react";
import { Flame, Coffee, Tv } from "lucide-react";
import type { Phase } from "../../types/pomodoro.types";

interface PhaseIndicatorProps {
  phase: Phase;
}

/**
 * Gets the appropriate icon component for the current phase
 */
const getPhaseIcon = (phase: Phase) => {
  if (phase === "work") return Flame;
  if (phase === "break") return Coffee;
  return Tv;
};

/**
 * Gets the display text for the current phase
 */
const getPhaseText = (phase: Phase) => {
  if (phase === "work") return "Focus Time";
  if (phase === "break") return "Short Break";
  return "Long Break";
};

export const PhaseIndicator = ({ phase }: PhaseIndicatorProps) => {
  const PhaseIcon = getPhaseIcon(phase);

  return (
    <div className="text-center mb-8">
      <motion.div
        className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 shadow-lg"
        initial={{ scale: 0.8, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        key={phase}
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <PhaseIcon className="w-6 h-6 text-white" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="text-white font-semibold text-lg"
          >
            {getPhaseText(phase)}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
