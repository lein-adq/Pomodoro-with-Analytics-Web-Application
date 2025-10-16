/**
 * Phase Indicator Component
 *
 * Displays the current phase (Focus Time, Short Break, or Long Break) with an icon.
 */

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
      <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 shadow-lg">
        <PhaseIcon className="w-6 h-6 text-white" />
        <span className="text-white font-semibold text-lg">
          {getPhaseText(phase)}
        </span>
      </div>
    </div>
  );
};
