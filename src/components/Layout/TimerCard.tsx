/**
 * Timer Card Component
 *
 * Main card containing the timer display and controls with Motion animations.
 */

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface TimerCardProps {
  children: ReactNode;
}

export const TimerCard = ({ children }: TimerCardProps) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/20 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.1,
      }}
    >
      {/* Animated glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
