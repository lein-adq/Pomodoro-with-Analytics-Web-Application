/**
 * Timer Card Component
 *
 * Main card containing the timer display and controls.
 */

import type { ReactNode } from "react";

interface TimerCardProps {
  children: ReactNode;
}

export const TimerCard = ({ children }: TimerCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/20 relative overflow-hidden">
      {/* Animated glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
