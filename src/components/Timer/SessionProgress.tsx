import { motion } from "motion/react";

interface SessionProgressProps {
  completedSessions: number;
  sessionsBeforeLong: number;
}

export const SessionProgress = ({
  completedSessions,
  sessionsBeforeLong,
}: SessionProgressProps) => {
  return (
    <div className="mt-6 flex justify-center gap-2">
      {[...Array(sessionsBeforeLong)].map((_, i) => {
        const isCompleted = i < completedSessions % sessionsBeforeLong;

        return (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${
              isCompleted ? "bg-white" : "bg-white/30"
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isCompleted ? 1.1 : 1,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: i * 0.05,
            }}
          />
        );
      })}
    </div>
  );
};
