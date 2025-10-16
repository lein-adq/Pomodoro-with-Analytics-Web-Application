import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

import type { NextPhaseInfo } from "../../types/pomodoro.types";

interface NextPhasePreviewProps {
  nextPhase: NextPhaseInfo;
}

export const NextPhasePreview = ({ nextPhase }: NextPhasePreviewProps) => {
  return (
    <motion.div
      className="bg-white/5 rounded-xl p-4 border border-white/10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-white/60 text-sm">Next up</span>
        <div className="flex items-center gap-2 text-white">
          <motion.span
            className="font-medium"
            key={nextPhase.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {nextPhase.name}
          </motion.span>
          <span className="text-white/60">·</span>
          <span className="text-white/60">{nextPhase.duration}</span>
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <ChevronRight className="w-4 h-4 text-white/40" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
