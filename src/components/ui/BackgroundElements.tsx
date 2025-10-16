/**
 * Background Elements Component
 *
 * Animated background decorative elements using Motion.
 */

import { motion } from "motion/react";

export const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
};
